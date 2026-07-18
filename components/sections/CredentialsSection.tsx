import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import { PageContainer, PageHeader } from '@/components/layout/PageContainer';

interface Credential {
  id: string;
  title: string;
  program: string;
  issuer: string;
  date: string;
  file: string;
}

const CREDENTIALS: Credential[] = [
  {
    id: 'zapier',
    title: 'Zapier Certified',
    program: 'No Code Automation with Zapier',
    issuer: 'Technical Virtual Assistants PH',
    date: 'April 14, 2026',
    file: '/credentials/zapier-certificate.png',
  },
  {
    id: 'n8n',
    title: 'n8n Workflow Professional',
    program: 'AI Automation with n8n',
    issuer: 'Technical Virtual Assistants PH',
    date: 'May 6, 2026',
    file: '/credentials/n8n-certificate.png',
  },
  {
    id: 'make',
    title: 'Make Advanced Scenarios',
    program: 'No Code Automation with Make.com',
    issuer: 'Technical Virtual Assistants PH',
    date: 'April 16, 2026',
    file: '/credentials/make-certificate.png',
  },
  {
    id: 'prompt-engineering',
    title: 'Prompt Engineering & AI Automation',
    program: 'Prompt Engineering',
    issuer: 'Technical Virtual Assistants PH',
    date: 'May 6, 2026',
    file: '/credentials/prompt-engineering-certificate.png',
  },
  {
    id: 'gohighlevel',
    title: 'GoHighLevel CRM Training',
    program: 'HighLevel CRM',
    issuer: 'Technical Virtual Assistants PH',
    date: 'May 13, 2026',
    file: '/credentials/gohighlevel-certificate.png',
  },
];

export function CredentialsSection() {
  return (
    <PageContainer id="credentials">
      <PageHeader
        as="h2"
        title="Credentials"
        subtitle="Formal training across the platforms behind every workflow, each verifiable by the certificate behind it."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {CREDENTIALS.map((credential) => (
          <a
            key={credential.id}
            href={credential.file}
            target="_blank"
            rel="noreferrer"
            className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-void-deep/40 transition-colors hover:border-periwinkle/50"
          >
            <div className="relative aspect-[2246/1588] w-full overflow-hidden border-b border-line bg-void-deep">
              <Image
                src={credential.file}
                alt={`${credential.title} certificate`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                sizes="(min-width: 640px) 50vw, 100vw"
              />
            </div>
            <div className="flex flex-1 items-start justify-between gap-3 p-5">
              <div>
                <h3 className="font-display text-[15px] font-semibold text-text">{credential.title}</h3>
                <p className="mt-1 text-[13px] text-ash">{credential.program}</p>
                <p className="mt-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ash-dim">
                  {credential.issuer} &middot; {credential.date}
                </p>
              </div>
              <ExternalLink
                size={16}
                strokeWidth={1.5}
                className="mt-1 shrink-0 text-ash-dim transition-colors group-hover:text-periwinkle"
              />
            </div>
          </a>
        ))}
      </div>
    </PageContainer>
  );
}
