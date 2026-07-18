import { Briefcase, ExternalLink, Eye, Mail, Phone } from 'lucide-react';
import { CopyableContact } from '@/components/CopyableContact';
import { QrThumb } from '@/components/QrThumb';
import { PageContainer, PageHeader } from '@/components/layout/PageContainer';
import { CONTACT_LINKS } from '@/lib/contact-links';
import { generateQrSvg } from '@/lib/qr';

const RESUME_PATH = '/resume/Cyrus-Gaburno-Resume.pdf';

const CHANNELS = [
  { icon: Mail, ...CONTACT_LINKS.email },
  { icon: Phone, ...CONTACT_LINKS.whatsapp },
  { icon: ExternalLink, ...CONTACT_LINKS.linkedin },
  { icon: Briefcase, ...CONTACT_LINKS.upwork },
];

export async function ContactSection() {
  const channelsWithQr = await Promise.all(
    CHANNELS.map(async (channel) => ({ ...channel, svg: await generateQrSvg(channel.qrUrl) }))
  );

  return (
    <PageContainer id="contact">
      <PageHeader
        as="h2"
        title="Contact"
        subtitle="Open to freelance consulting, full-time automation roles, and collaborations. Available to work remotely across US, EU, Asia, and any time zone as needed."
      />

      <div className="flex flex-col gap-3">
        {channelsWithQr.map((channel) => (
          <div
            key={channel.label}
            className="flex flex-col gap-4 rounded-2xl border border-line bg-void-deep/40 p-5 sm:flex-row sm:items-center"
          >
            <div className="flex min-w-0 flex-1 items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line bg-void-deep/60">
                <channel.icon size={18} color="var(--periwinkle)" strokeWidth={1.5} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="mb-1 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ash-dim">{channel.label}</p>
                <CopyableContact value={channel.value} />
              </div>
            </div>
            <QrThumb svg={channel.svg} label={channel.label} />
          </div>
        ))}
      </div>

      <a
        href={RESUME_PATH}
        target="_blank"
        rel="noreferrer"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-indigo px-5 py-2.5 font-mono text-[12px] uppercase tracking-[0.14em] text-white-fleck transition-transform hover:-translate-y-0.5"
      >
        <Eye size={14} strokeWidth={1.75} />
        View Resume
      </a>
    </PageContainer>
  );
}
