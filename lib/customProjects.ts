import { get } from '@vercel/global-config';
import { PROJECTS, type Project } from './projects';

const CUSTOM_PROJECTS_KEY = 'customProjects';

/** Projects added through /admin, stored as a single JSON array in Global Config. */
export async function getCustomProjects(): Promise<Project[]> {
  if (!process.env.GLOBAL_CONFIG) return [];

  try {
    const value = await get<Project[]>(CUSTOM_PROJECTS_KEY);
    return Array.isArray(value) ? value.map((p) => ({ ...p, isCustom: true })) : [];
  } catch {
    return [];
  }
}

/** Custom (admin-added) projects first, then the original hardcoded lineup. */
export async function getAllProjects(): Promise<Project[]> {
  const custom = await getCustomProjects();
  return [...custom, ...PROJECTS];
}

/** Plain-text summary of admin-added projects, for appending to the AI chat's system prompt. */
export function describeCustomProjectsForPrompt(projects: Project[]): string {
  return projects
    .map(
      (p, i) =>
        `${i + 1}. ${p.title} (${p.stack}) — ${p.description} Result: ${p.outcome} ${p.metric.value} ${p.metric.label}.`,
    )
    .join('\n');
}
