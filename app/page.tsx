import { BookACallSection } from '@/components/sections/BookACallSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { CredentialsSection } from '@/components/sections/CredentialsSection';
import { ProcessSection } from '@/components/sections/ProcessSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { SimulatorSection } from '@/components/sections/SimulatorSection';
import { ToolsSection } from '@/components/sections/ToolsSection';

export default function HomePage() {
  return (
    <>
      <ProcessSection />
      <ServicesSection />
      <ToolsSection />
      <ProjectsSection />
      <SimulatorSection />
      <CredentialsSection />
      <ContactSection />
      <BookACallSection />
    </>
  );
}
