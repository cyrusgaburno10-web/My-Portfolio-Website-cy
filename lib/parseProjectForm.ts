import { put } from '@vercel/blob';
import type { Project, WorkflowStep } from './projects';

export type ParsedProjectFields = Omit<Project, 'id' | 'isCustom'>;
export type ParseProjectFormResult =
  | { ok: true; fields: ParsedProjectFields }
  | { ok: false; error: string; status: number };

/** Extracts, validates, and uploads-the-image-for a project form submission. Shared by create and edit routes. */
export async function parseProjectForm(form: FormData, currentImage?: string): Promise<ParseProjectFormResult> {
  const title = String(form.get('title') || '').trim();
  const stack = String(form.get('stack') || '').trim();
  const description = String(form.get('description') || '').trim();
  const outcome = String(form.get('outcome') || '').trim();
  const challenge = String(form.get('challenge') || '').trim();
  const metricValue = String(form.get('metricValue') || '').trim();
  const metricLabel = String(form.get('metricLabel') || '').trim();
  const badgesRaw = String(form.get('badges') || '').trim();
  const videoUrl = String(form.get('videoUrl') || '').trim();
  const howItsBuiltRaw = String(form.get('howItsBuilt') || '[]');
  const imageFile = form.get('image');

  if (!title || !stack || !description || !outcome || !challenge || !metricValue || !metricLabel) {
    return { ok: false, error: 'Please fill in every field except the video link and image.', status: 400 };
  }

  let howItsBuilt: WorkflowStep[];
  try {
    const parsed = JSON.parse(howItsBuiltRaw);
    if (!Array.isArray(parsed) || parsed.length === 0) throw new Error('empty');
    howItsBuilt = parsed.map((s: { title?: unknown; body?: unknown }) => ({
      title: String(s.title || '').trim(),
      body: String(s.body || '').trim(),
    }));
    if (howItsBuilt.some((s) => !s.title || !s.body)) throw new Error('incomplete');
  } catch {
    return { ok: false, error: 'Add at least one step, with both a title and description.', status: 400 };
  }

  if (videoUrl) {
    try {
      new URL(videoUrl);
    } catch {
      return { ok: false, error: 'That video link doesn’t look like a valid URL.', status: 400 };
    }
  }

  const badges = badgesRaw
    .split(',')
    .map((b) => b.trim().toUpperCase())
    .filter(Boolean);

  let image: string | undefined = currentImage;
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
      const blob = await put(`projects/${Date.now()}-${imageFile.name}`, imageFile, {
        access: 'public',
        addRandomSuffix: true,
      });
      image = blob.url;
    } catch {
      return { ok: false, error: 'Could not upload the image. Please try again.', status: 500 };
    }
  }

  return {
    ok: true,
    fields: {
      title,
      stack,
      description,
      outcome,
      challenge,
      badges,
      metric: { value: metricValue, label: metricLabel },
      howItsBuilt,
      image,
      videoUrl: videoUrl || undefined,
    },
  };
}
