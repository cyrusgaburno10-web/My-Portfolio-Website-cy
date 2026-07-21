import { Clock, ListChecks, MessageSquare } from 'lucide-react';
import { CalendlyEmbed } from '@/components/CalendlyEmbed';
import { ContactMessageForm } from '@/components/ContactMessageForm';
import { PageContainer, PageHeader } from '@/components/layout/PageContainer';

const EXPECTATIONS = [
  { icon: Clock, text: '20 to 30 minutes, over a call or video chat' },
  { icon: ListChecks, text: 'A walkthrough of the manual process costing the most time' },
  { icon: MessageSquare, text: 'A clear next step: what to automate first, and roughly what it takes' },
];

export function BookACallSection() {
  return (
    <PageContainer id="book-a-call">
      <PageHeader
        as="h2"
        title="Your Next Automation Starts Here"
        subtitle="Book a free discovery call, no pressure, no obligation. We'll map your process, find your biggest automation wins, and hand you a clear plan to save hours every week."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {EXPECTATIONS.map((item) => (
          <div
            key={item.text}
            className="flex items-center gap-4 rounded-2xl border border-line bg-void-deep/40 p-5"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line bg-void-deep/60">
              <item.icon size={18} color="var(--periwinkle)" strokeWidth={1.5} />
            </div>
            <p className="text-[14px] text-text">{item.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2 xl:items-stretch xl:gap-8">
        <div className="flex flex-col">
          <p className="mb-3 font-mono text-[13px] font-semibold uppercase tracking-[0.16em] text-periwinkle">
            Pick a Time
          </p>
          <div className="flex-1 overflow-hidden rounded-2xl border border-line bg-void-deep/40 p-2 sm:p-4">
            <CalendlyEmbed />
          </div>
        </div>

        <div className="flex flex-col">
          <p className="mb-3 font-mono text-[13px] font-semibold uppercase tracking-[0.16em] text-periwinkle">
            Or Send a Message
          </p>
          <ContactMessageForm />
        </div>
      </div>
    </PageContainer>
  );
}
