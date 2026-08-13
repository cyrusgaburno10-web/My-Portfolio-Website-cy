import { isAdminAuthenticated } from '@/lib/adminAuth';
import { getCustomTestimonials } from '@/lib/customTestimonials';
import { writeGlobalConfigItems } from '@/lib/globalConfigWrite';
import { parseTestimonialForm } from '@/lib/parseTestimonialForm';
import type { Testimonial } from '@/lib/testimonials';

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

  const result = await parseTestimonialForm(form);
  if (!result.ok) {
    return Response.json({ error: result.error }, { status: result.status });
  }

  const id = `${slugify(result.fields.name)}-${Date.now().toString(36)}`;
  const newTestimonial: Testimonial = { id, ...result.fields };

  const existing = await getCustomTestimonials();
  const updated = [newTestimonial, ...existing];

  const writeResult = await writeGlobalConfigItems([
    { operation: 'upsert', key: 'customTestimonials', value: updated },
  ]);
  if (!writeResult.ok) {
    return Response.json({ error: writeResult.error }, { status: 502 });
  }

  return Response.json({ ok: true, testimonial: { ...newTestimonial, isCustom: true } });
}
