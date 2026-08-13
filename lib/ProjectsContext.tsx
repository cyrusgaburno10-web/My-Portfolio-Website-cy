'use client';

import { createContext, useContext } from 'react';
import { PROJECTS, type Project } from './projects';

const ProjectsContext = createContext<Project[]>(PROJECTS);

export function ProjectsProvider({ projects, children }: { projects: Project[]; children: React.ReactNode }) {
  return <ProjectsContext.Provider value={projects}>{children}</ProjectsContext.Provider>;
}

/** Full merged project list (custom + hardcoded), for client components too deep for a server prop. */
export function useProjects(): Project[] {
  return useContext(ProjectsContext);
}
