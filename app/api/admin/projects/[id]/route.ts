import { isAdminAuthenticated } from '@/lib/adminAuth';
import { getCustomProjects } from '@/lib/customProjects';
import { writeGlobalConfigItems } from '@/lib/globalConfigWrite';

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
