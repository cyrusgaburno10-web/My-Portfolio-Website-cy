import { isAdminAuthenticated } from '@/lib/adminAuth';
import { getCustomProjects, getProjectOverrides } from '@/lib/customProjects';
import { writeGlobalConfigItems } from '@/lib/globalConfigWrite';
import { parseProjectForm } from '@/lib/parseProjectForm';
import { PROJECTS, type Project } from '@/lib/projects';

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

  const currentImage = String(form.get('currentImage') || '') || undefined;
  const result = await parseProjectForm(form, currentImage);
  if (!result.ok) {
    return Response.json({ error: result.error }, { status: result.status });
  }

  const editedProject: Project = { id, ...result.fields };
  const isHardcoded = PROJECTS.some((p) => p.id === id);

  if (isHardcoded) {
    const overrides = await getProjectOverrides();
    const updatedOverrides = { ...overrides, [id]: editedProject };
    const writeResult = await writeGlobalConfigItems([
      { operation: 'upsert', key: 'projectOverrides', value: updatedOverrides },
    ]);
    if (!writeResult.ok) {
      return Response.json({ error: writeResult.error }, { status: 502 });
    }
    return Response.json({ ok: true, project: { ...editedProject, isCustom: false } });
  }

  const existing = await getCustomProjects();
  if (!existing.some((p) => p.id === id)) {
    return Response.json({ error: 'That project could not be found.' }, { status: 404 });
  }
  const updated = existing.map((p) => (p.id === id ? editedProject : p));
  const writeResult = await writeGlobalConfigItems([{ operation: 'upsert', key: 'customProjects', value: updated }]);
  if (!writeResult.ok) {
    return Response.json({ error: writeResult.error }, { status: 502 });
  }
  return Response.json({ ok: true, project: { ...editedProject, isCustom: true } });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: 'Not signed in.' }, { status: 401 });
  }

  const { id } = await params;
  const existing = await getCustomProjects();
  const updated = existing.filter((p) => p.id !== id);

  const result = await writeGlobalConfigItems([{ operation: 'upsert', key: 'customProjects', value: updated }]);
  if (!result.ok) {
    return Response.json({ error: result.error }, { status: 502 });
  }
  return Response.json({ ok: true });
}
