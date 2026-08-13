import { PageContainer, PageHeader } from '@/components/layout/PageContainer';
import { ProjectGrid } from '@/components/ProjectCard';
import { getAllProjects } from '@/lib/customProjects';

export async function ProjectsSection() {
  const projects = await getAllProjects();

  return (
    <PageContainer id="projects">
      <PageHeader
        as="h2"
        title="Featured Integrations & Automations"
        subtitle={`${projects.length} live workflows, each solving a real bottleneck: a lead that went cold, a hire that fell through the cracks, a resume that never got read. Click any card to see how it's built, step by step.`}
      />
      <ProjectGrid projects={projects} />
    </PageContainer>
  );
}
