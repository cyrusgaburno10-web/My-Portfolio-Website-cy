import { AutomationSimulator } from '@/components/AutomationSimulator';
import { PageContainer, PageHeader } from '@/components/layout/PageContainer';
import { getAllProjects } from '@/lib/customProjects';

export async function SimulatorSection() {
  const projects = await getAllProjects();

  return (
    <PageContainer id="simulation">
      <PageHeader
        as="h2"
        title="Automation Simulator"
        subtitle="Pick a project and run its exact workflow, step by step, to see how the automation behaves in real time."
      />
      <AutomationSimulator projects={projects} />
    </PageContainer>
  );
}
