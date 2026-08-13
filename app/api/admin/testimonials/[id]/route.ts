import { isAdminAuthenticated } from '@/lib/adminAuth';
import { getCustomTestimonials } from '@/lib/customTestimonials';
import { writeGlobalConfigItems } from '@/lib/globalConfigWrite';
import { parseTestimonialForm } from '@/lib/parseTestimonialForm';
import type { Testimonial } from '@/lib/testimonials';

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

  const currentAvatar = String(form.get('currentAvatar') || '') || undefined;
  const result = await parseTestimonialForm(form, currentAvatar);
  if (!result.ok) {
    return Response.json({ error: result.error }, { status: result.status });
  }

  const editedTestimonial: Testimonial = { id, ...result.fields };

  const existing = await getCustomTestimonials();
  if (!existing.some((t) => t.id === id)) {
    return Response.json({ error: 'That testimonial could not be found.' }, { status: 404 });
  }
  const updated = existing.map((t) => (t.id === id ? editedTestimonial : t));
  const writeResult = await writeGlobalConfigItems([
    { operation: 'upsert', key: 'customTestimonials', value: updated },
  ]);
  if (!writeResult.ok) {
    return Response.json({ error: writeResult.error }, { status: 502 });
  }
  return Response.json({ ok: true, testimonial: { ...editedTestimonial, isCustom: true } });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: 'Not signed in.' }, { status: 401 });
  }

  const { id } = await params;
  const existing = await getCustomTestimonials();
  const updated = existing.filter((t) => t.id !== id);

  const result = await writeGlobalConfigItems([{ operation: 'upsert', key: 'customTestimonials', value: updated }]);
  if (!result.ok) {
    return Response.json({ error: result.error }, { status: 502 });
  }
  return Response.json({ ok: true });
}
