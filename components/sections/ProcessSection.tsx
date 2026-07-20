import Image from 'next/image';
import {
  ArrowRight,
  CircleCheck,
  CircleX,
  Compass,
  Eye,
  Hammer,
  MapPin,
  Rocket,
  ScanSearch,
  TestTube2,
  Users,
} from 'lucide-react';
import { HeroAvatar } from '@/components/HeroAvatar';
import { VisitorCounter } from '@/components/VisitorCounter';
import { PageContainer, PageHeader } from '@/components/layout/PageContainer';
import { PROJECTS } from '@/lib/projects';

const RESUME_PATH = '/resume/Cyrus-Gaburno-Resume.pdf';

const FEATURED_PROJECT = PROJECTS.find((p) => p.id === 'voice-receptionist')!;

const STAGES = [
  {
    n: '01',
    icon: ScanSearch,
    title: 'Discover',
    body: 'Map the manual process end to end: where time gets lost, where leads go cold, where the numbers stop matching up.',
  },
  {
    n: '02',
    icon: Compass,
    title: 'Design',
    body: 'Architect the triggers, logic branches, and integrations before touching a single node, and decide exactly where AI reasoning adds real judgment instead of just moving data around.',
  },
  {
    n: '03',
    icon: Hammer,
    title: 'Build',
    body: 'Wire it up in n8n, Zapier, or Make, connecting the tools already in use rather than replacing them.',
  },
  {
    n: '04',
    icon: TestTube2,
    title: 'Test & Reconcile',
    body: "Run real data through every branch and edge case. A background in accounting means the workflow doesn't just run, it reconciles.",
  },
  {
    n: '05',
    icon: Rocket,
    title: 'Deploy & Monitor',
    body: 'Publish it live, add logging and alerts, and watch the first real runs closely before stepping back.',
  },
  {
    n: '06',
    icon: Users,
    title: 'Hand Off',
    body: 'Document how it works and hand over ownership, or keep iterating together as the business changes.',
  },
];

export function ProcessSection() {
  return (
    <PageContainer id="process" divider={false}>
      {/* Hero */}
      <div className="mb-14 grid grid-cols-1 items-center gap-10 sm:mb-20 md:grid-cols-[1.1fr_1fr] md:gap-8 lg:gap-12">
        <div className="order-2 max-w-2xl md:order-1">
          <p className="mb-4 inline-flex items-center rounded-full border border-periwinkle/40 bg-periwinkle/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-periwinkle">
            AI Automation Specialist
          </p>
          <h1 className="font-display text-4xl font-semibold leading-tight text-text sm:text-5xl">
            Automate today.{' '}
            <span className="bg-gradient-to-r from-periwinkle to-sky bg-clip-text text-transparent">
              Scale without limits tomorrow.
            </span>
          </h1>
          <p className="mt-5 text-[15px] leading-relaxed text-ash">
            I architect AI-powered workflows that eliminate repetitive manual work at the source. Your tools connect
            into one automated system built for speed, accuracy, and scale.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#projects"
              className="inline-flex items-center gap-1.5 rounded-full bg-indigo px-5 py-2.5 font-mono text-[12px] uppercase tracking-[0.14em] text-white-fleck transition-transform hover:-translate-y-0.5"
            >
              View Projects
              <ArrowRight size={14} strokeWidth={1.75} />
            </a>
            <a
              href={RESUME_PATH}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-line px-5 py-2.5 font-mono text-[12px] uppercase tracking-[0.14em] text-ash transition-colors hover:border-periwinkle hover:text-text"
            >
              <Eye size={14} strokeWidth={1.75} />
              View Resume
            </a>
          </div>
        </div>

        <div className="order-1 flex flex-col items-center gap-3 md:order-2 md:items-end">
          <HeroAvatar />
          <p className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-ash-dim">
            <MapPin size={13} color="var(--periwinkle)" strokeWidth={1.5} />
            Tandag, Caraga, Philippines
          </p>
          <VisitorCounter />
        </div>
      </div>

      {/* Featured case study */}
      <div className="mb-16 sm:mb-24">
        <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-ash-dim">Featured Workflow</p>
        <div className="overflow-hidden rounded-2xl border border-line bg-void-deep/40">
          {FEATURED_PROJECT.image && (
            <div className="relative aspect-[2246/1188] w-full border-b border-line">
              <Image
                src={FEATURED_PROJECT.image}
                alt={`${FEATURED_PROJECT.title} workflow screenshot`}
                fill
                priority
                className="object-cover saturate-[1.15] contrast-[1.05]"
                sizes="(min-width: 768px) 896px, 100vw"
              />
            </div>
          )}
          <div className="p-6 sm:p-8">
            <h2 className="font-display text-xl font-semibold text-text sm:text-2xl">{FEATURED_PROJECT.title}</h2>
            <p className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ash-dim">
              {FEATURED_PROJECT.stack}
            </p>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-line p-4">
                <div className="mb-2 flex items-center gap-2">
                  <CircleX size={16} color="var(--ash-dim)" strokeWidth={1.5} />
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ash-dim">
                    The Challenge
                  </span>
                </div>
                <p className="text-[14px] leading-relaxed text-ash">{FEATURED_PROJECT.challenge}</p>
              </div>
              <div className="rounded-xl border border-line p-4">
                <div className="mb-2 flex items-center gap-2">
                  <CircleCheck size={16} color="var(--periwinkle)" strokeWidth={1.5} />
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ash-dim">
                    The Solution
                  </span>
                </div>
                <p className="text-[14px] leading-relaxed text-ash">{FEATURED_PROJECT.description}</p>
              </div>
            </div>

            <p className="mt-5 text-[14px] font-medium text-text">{FEATURED_PROJECT.outcome}</p>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {FEATURED_PROJECT.badges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-periwinkle/40 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-periwinkle"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Process */}
      <PageHeader
        as="h2"
        title="Stages of Workflow Automation"
        subtitle="Every automation has stages, from the first look at a manual process to a workflow that runs itself."
      />

      <ol className="flex flex-col gap-6">
        {STAGES.map((stage) => (
          <li
            key={stage.n}
            className="flex gap-5 rounded-2xl border border-line bg-void-deep/40 p-5 transition-colors hover:border-periwinkle/40 sm:p-6"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line bg-void-deep/60">
              <stage.icon size={18} color="var(--periwinkle)" strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <div className="mb-1.5 flex items-baseline gap-2">
                <span className="font-mono text-[11px] text-ash-dim">{stage.n}</span>
                <h3 className="font-display text-lg font-semibold text-text">{stage.title}</h3>
              </div>
              <p className="text-[14px] leading-relaxed text-ash">{stage.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-14 flex flex-col items-start gap-4 rounded-2xl border border-line bg-void-deep/40 p-6 sm:mt-16 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-display text-lg font-semibold text-text">See it applied to real workflows</h3>
          <p className="mt-1 text-[14px] text-ash">Six live automations, each built through this exact process.</p>
        </div>
        <a
          href="#projects"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-indigo px-5 py-2.5 font-mono text-[12px] uppercase tracking-[0.14em] text-white-fleck transition-transform hover:-translate-y-0.5"
        >
          View Projects
          <ArrowRight size={14} strokeWidth={1.75} />
        </a>
      </div>
    </PageContainer>
  );
}
