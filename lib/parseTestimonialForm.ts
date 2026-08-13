import { put } from '@vercel/blob';
import type { Testimonial } from './testimonials';

export type ParsedTestimonialFields = Omit<Testimonial, 'id' | 'isCustom'>;
export type ParseTestimonialFormResult =
  | { ok: true; fields: ParsedTestimonialFields }
  | { ok: false; error: string; status: number };

/** Extracts, validates, and (if a new photo was chosen) uploads the avatar for a testimonial submission. Shared by create and edit routes. The avatar is optional. */
export async function parseTestimonialForm(form: FormData, currentAvatar?: string): Promise<ParseTestimonialFormResult> {
  const name = String(form.get('name') || '').trim();
  const role = String(form.get('role') || '').trim();
  const quote = String(form.get('quote') || '').trim();
  const avatarFile = form.get('avatar');

  if (!name || !role || !quote) {
    return { ok: false, error: 'Please fill in the name, role, and quote.', status: 400 };
  }

  let avatar: string | undefined = currentAvatar;
  if (avatarFile instanceof File && avatarFile.size > 0) {
    if (!avatarFile.type.startsWith('image/')) {
      return { ok: false, error: 'That file doesn’t look like an image.', status: 400 };
    }
    if (avatarFile.size > 8 * 1024 * 1024) {
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
      const blob = await put(`testimonials/${Date.now()}-${avatarFile.name}`, avatarFile, {
        access: 'public',
        addRandomSuffix: true,
      });
      avatar = blob.url;
    } catch {
      return { ok: false, error: 'Could not upload the photo. Please try again.', status: 500 };
    }
  }

  return { ok: true, fields: { name, role, quote, avatar } };
}
