import { PageContainer, PageHeader } from '@/components/layout/PageContainer';
import { ProjectGrid } from '@/components/ProjectCard';

export function ProjectsSection() {
  return (
    <PageContainer id="projects">
      <PageHeader
        as="h2"
        title="Featured Integrations & Automations"
        subtitle="Nine live workflows, each solving a real bottleneck: a lead that went cold, a hire that fell through the cracks, a resume that never got read. Click any card to see how it's built, step by step."
      />
      <ProjectGrid />
    </PageContainer>
  );
}
