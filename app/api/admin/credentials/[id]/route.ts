import { isAdminAuthenticated } from '@/lib/adminAuth';
import { getCustomCredentials, getCredentialOverrides } from '@/lib/customCredentials';
import { writeGlobalConfigItems } from '@/lib/globalConfigWrite';
import { parseCredentialForm } from '@/lib/parseCredentialForm';
import { CREDENTIALS, type Credential } from '@/lib/credentials';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: 'Not signed in.' }, { status: 401 });
  }

  const { id } = await params;

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return Response.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const currentFile = String(form.get('currentFile') || '') || undefined;
  const result = await parseCredentialForm(form, currentFile);
  if (!result.ok) {
    return Response.json({ error: result.error }, { status: result.status });
  }

  const editedCredential: Credential = { id, ...result.fields };
  const isHardcoded = CREDENTIALS.some((c) => c.id === id);

  if (isHardcoded) {
    const overrides = await getCredentialOverrides();
    const updatedOverrides = { ...overrides, [id]: editedCredential };
    const writeResult = await writeGlobalConfigItems([
      { operation: 'upsert', key: 'credentialOverrides', value: updatedOverrides },
    ]);
    if (!writeResult.ok) {
      return Response.json({ error: writeResult.error }, { status: 502 });
    }
    return Response.json({ ok: true, credential: { ...editedCredential, isCustom: false } });
  }

  const existing = await getCustomCredentials();
  if (!existing.some((c) => c.id === id)) {
    return Response.json({ error: 'That credential could not be found.' }, { status: 404 });
  }
  const updated = existing.map((c) => (c.id === id ? editedCredential : c));
  const writeResult = await writeGlobalConfigItems([
    { operation: 'upsert', key: 'customCredentials', value: updated },
  ]);
  if (!writeResult.ok) {
    return Response.json({ error: writeResult.error }, { status: 502 });
  }
  return Response.json({ ok: true, credential: { ...editedCredential, isCustom: true } });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: 'Not signed in.' }, { status: 401 });
  }

  const { id } = await params;
  const existing = await getCustomCredentials();
  const updated = existing.filter((c) => c.id !== id);

  const result = await writeGlobalConfigItems([{ operation: 'upsert', key: 'customCredentials', value: updated }]);
  if (!result.ok) {
    return Response.json({ error: result.error }, { status: 502 });
  }
  return Response.json({ ok: true });
}
