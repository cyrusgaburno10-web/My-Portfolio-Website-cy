import { isAdminAuthenticated } from '@/lib/adminAuth';
import { getCustomProjects } from '@/lib/customProjects';
import { writeGlobalConfigItems } from '@/lib/globalConfigWrite';
import { parseProjectForm } from '@/lib/parseProjectForm';
import type { Project } from '@/lib/projects';

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

  const result = await parseProjectForm(form);
  if (!result.ok) {
    return Response.json({ error: result.error }, { status: result.status });
  }

  const id = `${slugify(result.fields.title)}-${Date.now().toString(36)}`;
  const newProject: Project = { id, ...result.fields };

  const existing = await getCustomProjects();
  const updated = [newProject, ...existing];

  const writeResult = await writeGlobalConfigItems([{ operation: 'upsert', key: 'customProjects', value: updated }]);
  if (!writeResult.ok) {
    return Response.json({ error: writeResult.error }, { status: 502 });
  }

  return Response.json({ ok: true, project: { ...newProject, isCustom: true } });
}
