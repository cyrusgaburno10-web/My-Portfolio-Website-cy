import { getAllProjects } from '@/lib/customProjects';

export async function GET() {
  const projects = await getAllProjects();
  return Response.json({ projects });
}
