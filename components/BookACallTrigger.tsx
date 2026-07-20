'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowLeft, ArrowRight, Phone } from 'lucide-react';
import { CalendlyEmbed } from '@/components/CalendlyEmbed';

export function BookACallTrigger() {
  const [expanded, setExpanded] = useState(false);
  const reduceMotion = useReducedMotion();

  if (expanded) {
    return (
      <motion.div
        initial={reduceMotion ? undefined : { opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-2xl border border-line bg-void-deep/40 p-2 sm:p-4"
      >
        <button
          type="button"
          onClick={() => setExpanded(false)}
          aria-label="Back to booking prompt"
          className="absolute left-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-void-deep/80 text-ash backdrop-blur-md transition-colors hover:text-text"
        >
          <ArrowLeft size={15} strokeWidth={1.75} />
        </button>
        <CalendlyEmbed />
      </motion.div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setExpanded(true)}
      className="flex h-full w-full flex-col items-center justify-center gap-4 rounded-2xl border border-line bg-void-deep/40 p-10 text-center transition-colors hover:border-periwinkle/40 sm:p-14"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-periwinkle/40 bg-periwinkle/10">
        <Phone size={24} color="var(--periwinkle)" strokeWidth={1.5} />
      </div>
      <div>
        <p className="font-display text-xl font-semibold text-text">Book a Discovery Call</p>
        <p className="mt-1.5 text-[14px] text-ash">Pick a time that works for you. Opens the live calendar.</p>
      </div>
      <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo px-5 py-2.5 font-mono text-[12px] uppercase tracking-[0.14em] text-white-fleck transition-transform">
        Open Calendar
        <ArrowRight size={14} strokeWidth={1.75} />
      </span>
    </button>
  );
}
