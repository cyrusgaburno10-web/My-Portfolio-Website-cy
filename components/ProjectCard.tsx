'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowRight, Maximize2, PlayCircle } from 'lucide-react';
import type { Project } from '@/lib/projects';
import { useProjects } from '@/lib/ProjectsContext';
import { ScrollReveal } from '@/components/ScrollReveal';
import { CaseStudyModal } from './CaseStudyModal';
import { VideoLightbox } from './VideoLightbox';

function platformOf(stack: string) {
  return stack.split(' + ')[0];
}

function PlaceholderTile() {
  return (
    <div
      className="flex h-full w-full items-center justify-center opacity-40"
      style={{
        background:
          'radial-gradient(circle at 30% 20%, var(--indigo) 0%, transparent 60%), radial-gradient(circle at 80% 80%, var(--sky) 0%, transparent 55%)',
      }}
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ash-dim">Workflow preview</span>
    </div>
  );
}

function ProjectImage({ src, alt }: { src: string; alt: string }) {
  const [errored, setErrored] = useState(false);
  if (errored) return <PlaceholderTile />;
  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover object-left saturate-[1.15] contrast-[1.05] transition-transform duration-300 group-hover:scale-[1.04]"
      sizes="(min-width: 640px) 50vw, 100vw"
      onError={() => setErrored(true)}
    />
  );
}

function ProjectTile({
  project,
  onOpenCaseStudy,
  onPlayVideo,
}: {
  project: Project;
  onOpenCaseStudy: (project: Project) => void;
  onPlayVideo: (project: Project) => void;
}) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-line bg-void-deep/50 transition-colors hover:border-periwinkle/60">
      <div className="group/image relative aspect-[2/1] w-full overflow-hidden border-b border-line">
        <button
          type="button"
          onClick={() => onOpenCaseStudy(project)}
          aria-label={`View case study: ${project.title}`}
          className="absolute inset-0 block text-left transition-transform active:scale-[0.99]"
        >
          {project.image ? (
            <ProjectImage src={project.image} alt={`${project.title} workflow screenshot`} />
          ) : (
            <PlaceholderTile />
          )}
          <span className="pointer-events-none absolute left-3 top-3 rounded-full border border-line bg-void-deep/80 px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.14em] text-periwinkle backdrop-blur-sm">
            {platformOf(project.stack)}
          </span>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-void-deep/0 opacity-0 transition-all duration-200 group-hover/image:bg-void-deep/60 group-hover/image:opacity-100">
            <span className="flex items-center gap-1.5 rounded-full bg-indigo px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-white-fleck">
              <Maximize2 size={12} strokeWidth={2} />
              View Case Study
            </span>
          </div>
        </button>

        {project.videoUrl && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPlayVideo(project);
            }}
            aria-label={`Play video walkthrough: ${project.title}`}
            className="absolute bottom-3 right-3 z-10 flex h-14 w-14 items-center justify-center rounded-full"
          >
            <span className="animate-ping absolute inset-0 rounded-full bg-indigo opacity-60" />
            <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-indigo text-white-fleck shadow-[0_8px_30px_-6px_var(--indigo)] transition-transform group-hover/image:scale-105 hover:scale-110 active:scale-95">
              <PlayCircle size={26} strokeWidth={1.5} />
            </span>
          </button>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-display text-[15px] font-semibold leading-snug text-text">{project.title}</h3>
        <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ash-dim">{project.stack}</p>
        <p className="text-[13px] leading-relaxed text-ash">{project.description}</p>
        <div className="flex items-baseline gap-2">
          <span className="font-display text-xl font-semibold text-periwinkle">{project.metric.value}</span>
          <span className="text-[12px] leading-snug text-ash-dim">{project.metric.label}</span>
        </div>
        <p className="text-[13px] leading-relaxed text-text">{project.outcome}</p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {project.badges.map((badge) => (
            <span
              key={badge}
              className="rounded-full border border-periwinkle/40 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-periwinkle"
            >
              {badge}
            </span>
          ))}
        </div>
        <button
          type="button"
          onClick={() => onOpenCaseStudy(project)}
          className="mt-auto inline-flex w-fit items-center gap-1.5 pt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-periwinkle transition-colors hover:text-text"
        >
          View Case Study
          <ArrowRight size={12} strokeWidth={1.75} />
        </button>
      </div>
    </article>
  );
}

export function ProjectGrid({ projects }: { projects: Project[] }) {
  const [openProject, setOpenProject] = useState<Project | null>(null);
  const [videoProject, setVideoProject] = useState<Project | null>(null);

  return (
    <>
      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
        {projects.map((project, i) => (
          <ScrollReveal key={project.id} delay={Math.min((i % 2) * 0.08, 0.16)}>
            <ProjectTile project={project} onOpenCaseStudy={setOpenProject} onPlayVideo={setVideoProject} />
          </ScrollReveal>
        ))}
      </div>
      {openProject && <CaseStudyModal project={openProject} onClose={() => setOpenProject(null)} />}
      {videoProject?.videoUrl && (
        <VideoLightbox
          videoUrl={videoProject.videoUrl}
          title={videoProject.title}
          onClose={() => setVideoProject(null)}
        />
      )}
    </>
  );
}

function ProjectMiniCard({ project }: { project: Project }) {
  return (
    <a
      href="#projects"
      className="flex gap-3 rounded-xl border border-line bg-void-deep/50 p-2.5 transition-colors hover:border-periwinkle/60"
    >
      <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border border-line">
        {project.image ? (
          <ProjectImage src={project.image} alt={`${project.title} workflow screenshot`} />
        ) : (
          <PlaceholderTile />
        )}
      </div>
      <div className="flex min-w-0 flex-col justify-center gap-1">
        <h4 className="truncate font-display text-[13px] font-semibold leading-snug text-text">{project.title}</h4>
        <p className="truncate font-mono text-[9.5px] uppercase tracking-[0.12em] text-ash-dim">{project.stack}</p>
      </div>
    </a>
  );
}

export function ProjectMiniList({ limit = 3, featuredId }: { limit?: number; featuredId?: string }) {
  const projects = useProjects();
  const pinned = featuredId ? projects.find((p) => p.id === featuredId) : undefined;
  const rest = projects.filter((p) => p.id !== featuredId);
  const featured = pinned ? [pinned, ...rest].slice(0, limit) : projects.slice(0, limit);
  const remaining = projects.length - featured.length;

  return (
    <div className="flex w-full flex-col gap-2">
      {featured.map((project) => (
        <ProjectMiniCard key={project.id} project={project} />
      ))}
      <a
        href="#projects"
        className="mt-1 inline-flex items-center justify-center gap-1.5 rounded-full border border-line px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ash transition-colors hover:border-periwinkle hover:text-text"
      >
        {remaining > 0 ? `View all ${projects.length} projects` : 'View projects'}
        <ArrowRight size={12} strokeWidth={1.75} />
      </a>
    </div>
  );
}
