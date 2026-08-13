import { isAdminAuthenticated } from '@/lib/adminAuth';
import { getCustomContacts } from '@/lib/customContacts';
import { writeGlobalConfigItems } from '@/lib/globalConfigWrite';
import { parseContactForm } from '@/lib/parseContactForm';
import type { ContactEntry } from '@/lib/contacts';

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: 'Not signed in.' }, { status: 401 });
  }

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

  const id = `${slugify(result.fields.label)}-${Date.now().toString(36)}`;
  const newContact: ContactEntry = { id, ...result.fields };

  const existing = await getCustomContacts();
  const updated = [...existing, newContact];

  const writeResult = await writeGlobalConfigItems([{ operation: 'upsert', key: 'customContacts', value: updated }]);
  if (!writeResult.ok) {
    return Response.json({ error: writeResult.error }, { status: 502 });
  }

  return Response.json({ ok: true, contact: { ...newContact, isCustom: true } });
}
