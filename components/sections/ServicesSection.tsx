import { Calculator, FolderSearch, PhoneCall, Sparkles, Target, Workflow } from 'lucide-react';
import { PageContainer, PageHeader } from '@/components/layout/PageContainer';

const SERVICES = [
  {
    icon: Workflow,
    title: 'Workflow Automation Design & Build',
    body: 'End-to-end automations built in n8n, Zapier, or Make, connecting the tools already in use rather than replacing them.',
  },
  {
    icon: Sparkles,
    title: 'AI Agent Integration',
    body: 'Wiring OpenAI, Claude, or Gemini reasoning into CRMs, inboxes, and documents, so the workflow makes judgment calls, not just moves data.',
  },
  {
    icon: Target,
    title: 'Lead & CRM Automation',
    body: 'Lead scoring, enrichment, and multi-stage outreach sequences that route themselves through a CRM based on real status changes.',
  },
  {
    icon: PhoneCall,
    title: 'Voice & Conversational AI',
    body: 'AI receptionists and booking assistants that handle real phone calls and chats: scheduling, rescheduling, and cancellations.',
  },
  {
    icon: FolderSearch,
    title: 'Document & Data Intelligence',
    body: "AI agents that read a document's actual content and file it correctly, no manual sorting or filename guessing.",
  },
  {
    icon: Calculator,
    title: 'Financial & Ops Automation',
    body: 'Expense tracking, reconciliation, and back-office workflows built with an accounting background, so the numbers hold up.',
  },
];

export function ServicesSection() {
  return (
    <PageContainer id="services">
      <PageHeader
        as="h2"
        title="Services I Can Offer"
        subtitle="Six automation services that eliminate manual work and free your business to scale."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {SERVICES.map((service) => (
          <div
            key={service.title}
            className="flex flex-col gap-3 rounded-2xl border border-line bg-void-deep/40 p-6 transition-colors hover:border-periwinkle/40"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-void-deep/60">
              <service.icon size={18} color="var(--periwinkle)" strokeWidth={1.5} />
            </div>
            <h3 className="font-display text-lg font-semibold text-text">{service.title}</h3>
            <p className="text-[14px] leading-relaxed text-ash">{service.body}</p>
          </div>
        ))}
      </div>
    </PageContainer>
  );
}
