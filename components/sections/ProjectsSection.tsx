import { PageContainer, PageHeader } from '@/components/layout/PageContainer';
import { ProjectGrid } from '@/components/ProjectCard';

export function ProjectsSection() {
  return (
    <PageContainer id="projects">
      <PageHeader
        as="h2"
        title="Featured Integrations & Automations"
        subtitle="Six live workflows, each solving a real bottleneck: a lead that went cold, a call that got missed, a document that never got filed. Click any card to see how it's built, step by step."
      />
      <ProjectGrid />
    </PageContainer>
  );
}
