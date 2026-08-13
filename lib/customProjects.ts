import { get } from '@vercel/global-config';
import { PROJECTS, type Project } from './projects';

const CUSTOM_PROJECTS_KEY = 'customProjects';
const PROJECT_OVERRIDES_KEY = 'projectOverrides';

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

/** Edits to the original hardcoded projects, keyed by id, stored in Global Config since the source list can't be edited at runtime. */
export async function getProjectOverrides(): Promise<Record<string, Project>> {
  if (!process.env.GLOBAL_CONFIG) return {};

  try {
    const value = await get<Record<string, Project>>(PROJECT_OVERRIDES_KEY);
    return value && typeof value === 'object' ? value : {};
  } catch {
    return {};
  }
}

/** Custom (admin-added) projects first, then the original lineup with any admin edits applied. */
export async function getAllProjects(): Promise<Project[]> {
  const [custom, overrides] = await Promise.all([getCustomProjects(), getProjectOverrides()]);
  const hardcoded = PROJECTS.map((p) => overrides[p.id] || p);
  return [...custom, ...hardcoded];
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
