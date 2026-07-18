import { Target, TrendingUp, type LucideIcon } from 'lucide-react';
import { PageContainer, PageHeader } from '@/components/layout/PageContainer';

interface ToolIcon {
  name: string;
  slug?: string;
  special?: 'openai' | 'slack';
  fallbackIcon?: LucideIcon;
}

const ROW_1: ToolIcon[] = [
  { name: 'n8n', slug: 'n8n' },
  { name: 'Zapier', slug: 'zapier' },
  { name: 'Make', slug: 'make' },
  { name: 'GoHighLevel', fallbackIcon: TrendingUp },
  { name: 'OpenAI', special: 'openai' },
  { name: 'Claude', slug: 'anthropic' },
  { name: 'Gemini', slug: 'googlegemini' },
  { name: 'HubSpot CRM', slug: 'hubspot' },
];

const ROW_2: ToolIcon[] = [
  { name: 'Asana', slug: 'asana' },
  { name: 'Airtable', slug: 'airtable' },
  { name: 'Notion', slug: 'notion' },
  { name: 'Google Workspace', slug: 'google' },
  { name: 'Slack', special: 'slack' },
  { name: 'Apollo.io', fallbackIcon: Target },
  { name: 'Telegram', slug: 'telegram' },
];

function ToolBadge({ tool }: { tool: ToolIcon }) {
  const maskSlug = tool.special === 'slack' ? 'slack' : tool.special === 'openai' ? 'openai' : null;

  return (
    <div className="flex shrink-0 items-center gap-2.5 px-4">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center">
        {tool.slug && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`https://cdn.simpleicons.org/${tool.slug}`}
            alt=""
            className="h-full w-full object-contain"
            loading="lazy"
          />
        )}
        {maskSlug && (
          <span
            aria-hidden="true"
            className="block h-full w-full"
            style={{
              backgroundColor: tool.special === 'slack' ? '#4A154B' : 'var(--text)',
              maskImage: `url(https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/${maskSlug}.svg)`,
              WebkitMaskImage: `url(https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/${maskSlug}.svg)`,
              maskSize: 'contain',
              WebkitMaskSize: 'contain',
              maskRepeat: 'no-repeat',
              WebkitMaskRepeat: 'no-repeat',
              maskPosition: 'center',
              WebkitMaskPosition: 'center',
            }}
          />
        )}
        {tool.fallbackIcon && <tool.fallbackIcon size={20} color="var(--periwinkle)" strokeWidth={1.5} />}
      </span>
      <span className="whitespace-nowrap font-display text-[15px] font-medium text-text">{tool.name}</span>
    </div>
  );
}

function MarqueeRow({ tools, direction, duration }: { tools: ToolIcon[]; direction: 'left' | 'right'; duration: number }) {
  const doubled = [...tools, ...tools];
  return (
    <div className="marquee-fade-mask overflow-hidden">
      <div
        className="marquee-track flex w-max items-center"
        style={{ animation: `marquee-${direction} ${duration}s linear infinite` }}
      >
        {doubled.map((tool, i) => (
          <div key={i} className="flex items-center">
            <ToolBadge tool={tool} />
            {i < doubled.length - 1 && <span className="text-line">&middot;</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ToolsSection() {
  return (
    <PageContainer id="tools">
      <PageHeader as="h2" title="Tools" subtitle="The platforms, models, and integrations behind every workflow." />

      <div className="rounded-2xl border border-line bg-void-deep/40 py-8">
        <p className="mb-6 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-ash-dim">
          Powered by These Tools
        </p>
        <div className="flex flex-col gap-6">
          <MarqueeRow tools={ROW_1} direction="left" duration={32} />
          <MarqueeRow tools={ROW_2} direction="right" duration={28} />
        </div>
      </div>

      <p className="mt-4 text-center text-[12.5px] text-ash-dim">
        Plus sentiment analysis, lead scoring, structured output parsing, webhooks, and REST APIs.
      </p>
    </PageContainer>
  );
}
