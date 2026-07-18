'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

export function QrThumb({ svg, label }: { svg: string; label: string }) {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', handleKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Enlarge QR code to contact Cyrus via ${label}`}
        className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-white p-1.5 transition-transform hover:scale-105 active:scale-95 sm:h-16 sm:w-16 [&>svg]:block [&>svg]:h-full [&>svg]:w-full"
        dangerouslySetInnerHTML={{ __html: svg }}
      />

      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`QR code to contact Cyrus via ${label}`}
          initial={reduceMotion ? undefined : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-void-deep/80 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={reduceMotion ? undefined : { opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-2xl border border-line bg-void p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-void-deep/80 text-ash transition-colors hover:text-text"
            >
              <X size={15} strokeWidth={1.5} />
            </button>
            <div
              className="h-56 w-56 overflow-hidden rounded-xl bg-white p-4 sm:h-64 sm:w-64 [&>svg]:block [&>svg]:h-full [&>svg]:w-full"
              dangerouslySetInnerHTML={{ __html: svg }}
            />
            <p className="mt-4 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-ash-dim">
              {label}
            </p>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
