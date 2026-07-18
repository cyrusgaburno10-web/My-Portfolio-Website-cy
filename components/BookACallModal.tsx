'use client';

import { useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { X } from 'lucide-react';
import { CalendlyEmbed } from '@/components/CalendlyEmbed';

export function BookACallModal({ onClose }: { onClose: () => void }) {
  const reduceMotion = useReducedMotion();

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
      aria-label="Book a meeting"
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
          aria-label="Close"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-void-deep/80 text-ash backdrop-blur-md transition-colors hover:text-text"
        >
          <X size={16} strokeWidth={1.5} />
        </button>

        <div className="chat-scroll max-h-[85vh] overflow-y-auto p-2 sm:p-4">
          <CalendlyEmbed />
        </div>
      </motion.div>
    </motion.div>
  );
}
