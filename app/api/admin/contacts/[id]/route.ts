import { isAdminAuthenticated } from '@/lib/adminAuth';
import { getCustomContacts, getContactOverrides, getDeletedContactIds } from '@/lib/customContacts';
import { writeGlobalConfigItems } from '@/lib/globalConfigWrite';
import { parseContactForm } from '@/lib/parseContactForm';
import { CONTACTS, type ContactEntry } from '@/lib/contacts';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: 'Not signed in.' }, { status: 401 });
  }

  const { id } = await params;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const result = parseContactForm(body);
  if (!result.ok) {
    return Response.json({ error: result.error }, { status: result.status });
  }

  const editedContact: ContactEntry = { id, ...result.fields };
  const isHardcoded = CONTACTS.some((c) => c.id === id);

  if (isHardcoded) {
    const overrides = await getContactOverrides();
    const updatedOverrides = { ...overrides, [id]: editedContact };
    const writeResult = await writeGlobalConfigItems([
      { operation: 'upsert', key: 'contactOverrides', value: updatedOverrides },
    ]);
    if (!writeResult.ok) {
      return Response.json({ error: writeResult.error }, { status: 502 });
    }
    return Response.json({ ok: true, contact: { ...editedContact, isCustom: false } });
  }

  const existing = await getCustomContacts();
  if (!existing.some((c) => c.id === id)) {
    return Response.json({ error: 'That contact could not be found.' }, { status: 404 });
  }
  const updated = existing.map((c) => (c.id === id ? editedContact : c));
  const writeResult = await writeGlobalConfigItems([{ operation: 'upsert', key: 'customContacts', value: updated }]);
  if (!writeResult.ok) {
    return Response.json({ error: writeResult.error }, { status: 502 });
  }
  return Response.json({ ok: true, contact: { ...editedContact, isCustom: true } });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: 'Not signed in.' }, { status: 401 });
  }

  const { id } = await params;
  const isHardcoded = CONTACTS.some((c) => c.id === id);

  if (isHardcoded) {
    const deletedIds = await getDeletedContactIds();
    if (!deletedIds.includes(id)) {
      const updated = [...deletedIds, id];
      const writeResult = await writeGlobalConfigItems([
        { operation: 'upsert', key: 'deletedContactIds', value: updated },
      ]);
      if (!writeResult.ok) {
        return Response.json({ error: writeResult.error }, { status: 502 });
      }
    }
    return Response.json({ ok: true });
  }

  const existing = await getCustomContacts();
  const updated = existing.filter((c) => c.id !== id);
  const writeResult = await writeGlobalConfigItems([{ operation: 'upsert', key: 'customContacts', value: updated }]);
  if (!writeResult.ok) {
    return Response.json({ error: writeResult.error }, { status: 502 });
  }
  return Response.json({ ok: true });
}
