'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import { CircleCheck, CircleX, PlayCircle, X } from 'lucide-react';
import type { Project } from '@/lib/projects';
import { VideoLightbox } from './VideoLightbox';

interface CaseStudyModalProps {
  project: Project;
  onClose: () => void;
}

export function CaseStudyModal({ project, onClose }: CaseStudyModalProps) {
  const reduceMotion = useReducedMotion();
  const [videoOpen, setVideoOpen] = useState(false);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} case study`}
      initial={reduceMotion ? undefined : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-void-deep/80 p-4 backdrop-blur-sm sm:items-center sm:p-8"
      onClick={onClose}
    >
      <motion.div
        initial={reduceMotion ? undefined : { opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-line bg-void shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close case study"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-void-deep/80 text-ash backdrop-blur-md transition-colors hover:text-text"
        >
          <X size={16} strokeWidth={1.5} />
        </button>

        <div className="chat-scroll max-h-[85vh] overflow-y-auto">
          {project.image && (
            <div className="relative aspect-[2246/1188] w-full border-b border-line">
              <Image
                src={project.image}
                alt={`${project.title} workflow screenshot`}
                fill
                className="object-cover saturate-[1.15] contrast-[1.05]"
                sizes="672px"
              />
            </div>
          )}

          <div className="p-6 sm:p-8">
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ash-dim">Case Study</p>
            <h2 className="font-display text-2xl font-semibold text-text">{project.title}</h2>
            <p className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ash-dim">{project.stack}</p>

            <div className="mt-5 flex items-center gap-3 rounded-xl border border-periwinkle/30 bg-periwinkle/5 px-4 py-3">
              <span className="font-display text-2xl font-semibold text-periwinkle">{project.metric.value}</span>
              <span className="text-[13px] leading-snug text-ash">{project.metric.label}</span>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-line p-4">
                <div className="mb-2 flex items-center gap-2">
                  <CircleX size={16} color="var(--ash-dim)" strokeWidth={1.5} />
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ash-dim">
                    The Challenge
                  </span>
                </div>
                <p className="text-[14px] leading-relaxed text-ash">{project.challenge}</p>
              </div>
              <div className="rounded-xl border border-line p-4">
                <div className="mb-2 flex items-center gap-2">
                  <CircleCheck size={16} color="var(--periwinkle)" strokeWidth={1.5} />
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ash-dim">
                    The Solution
                  </span>
                </div>
                <p className="text-[14px] leading-relaxed text-ash">{project.description}</p>
              </div>
            </div>

            <p className="mt-5 text-[14px] font-medium text-text">{project.outcome}</p>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {project.badges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-periwinkle/40 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-periwinkle"
                >
                  {badge}
                </span>
              ))}
            </div>

            <div className="mt-8 border-t border-line pt-6">
              <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-ash-dim">How It&rsquo;s Built</p>
              <ol className="flex flex-col gap-4">
                {project.howItsBuilt.map((step, i) => (
                  <li key={step.title} className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-periwinkle/40 font-mono text-[11px] text-periwinkle">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="font-display text-[14px] font-semibold text-text">{step.title}</h3>
                      <p className="mt-0.5 text-[13px] leading-relaxed text-ash">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {project.videoUrl && (
              <div className="mt-8 border-t border-line pt-6">
                <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-ash-dim">Video Walkthrough</p>
                <button
                  type="button"
                  onClick={() => setVideoOpen(true)}
                  aria-label={`Play video walkthrough: ${project.title}`}
                  className="group relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl border border-line bg-void-deep transition-transform active:scale-[0.98]"
                >
                  {project.image && (
                    <Image
                      src={project.image}
                      alt=""
                      fill
                      className="object-cover opacity-30 transition-opacity duration-200 group-hover:opacity-40"
                    />
                  )}
                  <span className="relative flex items-center gap-2 rounded-full bg-indigo px-5 py-2.5 font-mono text-[12px] uppercase tracking-[0.14em] text-white-fleck transition-transform duration-200 group-hover:scale-105">
                    <PlayCircle size={16} strokeWidth={1.75} />
                    Watch Video Walkthrough
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {videoOpen && project.videoUrl && (
        <VideoLightbox videoUrl={project.videoUrl} title={project.title} onClose={() => setVideoOpen(false)} />
      )}
    </motion.div>
  );
}
