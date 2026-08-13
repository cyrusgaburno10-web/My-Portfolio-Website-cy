import { isAdminAuthenticated } from '@/lib/adminAuth';
import { getCustomCredentials } from '@/lib/customCredentials';
import { writeGlobalConfigItems } from '@/lib/globalConfigWrite';
import { parseCredentialForm } from '@/lib/parseCredentialForm';
import type { Credential } from '@/lib/credentials';

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

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return Response.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const result = await parseCredentialForm(form);
  if (!result.ok) {
    return Response.json({ error: result.error }, { status: result.status });
  }

  const id = `${slugify(result.fields.title)}-${Date.now().toString(36)}`;
  const newCredential: Credential = { id, ...result.fields };

  const existing = await getCustomCredentials();
  const updated = [newCredential, ...existing];

  const writeResult = await writeGlobalConfigItems([
    { operation: 'upsert', key: 'customCredentials', value: updated },
  ]);
  if (!writeResult.ok) {
    return Response.json({ error: writeResult.error }, { status: 502 });
  }

  return Response.json({ ok: true, credential: { ...newCredential, isCustom: true } });
}
