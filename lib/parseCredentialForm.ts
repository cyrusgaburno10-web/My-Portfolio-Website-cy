import { put } from '@vercel/blob';
import type { Credential } from './credentials';

export type ParsedCredentialFields = Omit<Credential, 'id' | 'isCustom'>;
export type ParseCredentialFormResult =
  | { ok: true; fields: ParsedCredentialFields }
  | { ok: false; error: string; status: number };

/** Extracts, validates, and uploads-the-image-for a credential form submission. Shared by create and edit routes. */
export async function parseCredentialForm(form: FormData, currentFile?: string): Promise<ParseCredentialFormResult> {
  const title = String(form.get('title') || '').trim();
  const program = String(form.get('program') || '').trim();
  const issuer = String(form.get('issuer') || '').trim();
  const date = String(form.get('date') || '').trim();
  const imageFile = form.get('file');

  if (!title || !program || !issuer || !date) {
    return { ok: false, error: 'Please fill in every field.', status: 400 };
  }

  let file: string | undefined = currentFile;
  if (imageFile instanceof File && imageFile.size > 0) {
    if (!imageFile.type.startsWith('image/')) {
      return { ok: false, error: 'That file doesn’t look like an image.', status: 400 };
    }
    if (imageFile.size > 8 * 1024 * 1024) {
      return { ok: false, error: 'Please use an image smaller than 8MB.', status: 400 };
    }
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return {
        ok: false,
        error: 'Image uploads aren’t set up yet. Add a Blob store and its token to your environment.',
        status: 500,
      };
    }
    try {
      const blob = await put(`credentials/${Date.now()}-${imageFile.name}`, imageFile, {
        access: 'public',
        addRandomSuffix: true,
      });
      file = blob.url;
    } catch {
      return { ok: false, error: 'Could not upload the certificate image. Please try again.', status: 500 };
    }
  }

  if (!file) {
    return { ok: false, error: 'Please upload an image of the certificate.', status: 400 };
  }

  return { ok: true, fields: { title, program, issuer, date, file } };
}
