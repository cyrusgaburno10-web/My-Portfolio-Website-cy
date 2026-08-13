import { put } from '@vercel/blob';
import { isAdminAuthenticated } from '@/lib/adminAuth';
import { getCustomProjects } from '@/lib/customProjects';
import { writeGlobalConfigItems } from '@/lib/globalConfigWrite';
import type { Project, WorkflowStep } from '@/lib/projects';

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
    return Response.json({ error: 'Please fill in every field except the video link and image.' }, { status: 400 });
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
    return Response.json({ error: 'Add at least one step, with both a title and description.' }, { status: 400 });
  }

  if (videoUrl) {
    try {
      new URL(videoUrl);
    } catch {
      return Response.json({ error: 'That video link doesn’t look like a valid URL.' }, { status: 400 });
    }
  }

  const badges = badgesRaw
    .split(',')
    .map((b) => b.trim().toUpperCase())
    .filter(Boolean);

  let image: string | undefined;
  if (imageFile instanceof File && imageFile.size > 0) {
    if (!imageFile.type.startsWith('image/')) {
      return Response.json({ error: 'That file doesn’t look like an image.' }, { status: 400 });
    }
    if (imageFile.size > 8 * 1024 * 1024) {
      return Response.json({ error: 'Please use an image smaller than 8MB.' }, { status: 400 });
    }
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return Response.json(
        { error: 'Image uploads aren’t set up yet. Add a Blob store and its token to your environment.' },
        { status: 500 },
      );
    }
    try {
      const blob = await put(`projects/${Date.now()}-${imageFile.name}`, imageFile, {
        access: 'public',
        addRandomSuffix: true,
      });
      image = blob.url;
    } catch {
      return Response.json({ error: 'Could not upload the image. Please try again.' }, { status: 500 });
    }
  }

  const id = `${slugify(title)}-${Date.now().toString(36)}`;

  const newProject: Project = {
    id,
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
  };

  const existing = await getCustomProjects();
  const updated = [newProject, ...existing];

  const result = await writeGlobalConfigItems([{ operation: 'upsert', key: 'customProjects', value: updated }]);
  if (!result.ok) {
    return Response.json({ error: result.error }, { status: 502 });
  }

  return Response.json({ ok: true, project: { ...newProject, isCustom: true } });
}
