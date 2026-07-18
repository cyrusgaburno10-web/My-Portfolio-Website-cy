'use client';

import { useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { CircleCheck, ShieldCheck, Trash2, X } from 'lucide-react';

export function PrivacyModal({ onClose }: { onClose: () => void }) {
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
      aria-label="Privacy and data deletion policy"
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
        className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-void shadow-2xl"
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

        <div className="chat-scroll max-h-[85vh] overflow-y-auto p-6 sm:p-8">
          <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ash-dim">Privacy &amp; Data</p>
          <h2 className="font-display text-2xl font-semibold text-text">How your information is handled</h2>

          <div className="mt-6 rounded-xl border border-line p-4">
            <div className="mb-2 flex items-center gap-2">
              <ShieldCheck size={16} color="var(--periwinkle)" strokeWidth={1.5} />
              <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ash-dim">Privacy</span>
            </div>
            <p className="text-[14px] leading-relaxed text-ash">
              This site does not use tracking cookies or analytics. The AI chat sends your messages to a third-party
              AI provider solely to generate a reply, and conversations are not saved to a database. They exist only
              in your browser and disappear when you refresh or leave the page. If you reach out directly by email
              or phone, that information is used only to respond to you and is never sold or shared with third
              parties.
            </p>
          </div>

          <div className="mt-4 rounded-xl border border-line p-4">
            <div className="mb-2 flex items-center gap-2">
              <Trash2 size={16} color="var(--periwinkle)" strokeWidth={1.5} />
              <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ash-dim">
                Data Deletion
              </span>
            </div>
            <p className="text-[14px] leading-relaxed text-ash">
              Since chat messages and form entries are never stored in a database, there is typically nothing to
              delete beyond direct correspondence, such as an email thread. To request that any correspondence with
              Cyrus be deleted, email{' '}
              <a
                href="mailto:cyrusgaburno10@gmail.com?subject=Data%20Deletion%20Request"
                className="text-periwinkle underline underline-offset-2 hover:text-text"
              >
                cyrusgaburno10@gmail.com
              </a>{' '}
              with the subject &ldquo;Data Deletion Request,&rdquo; and it will be honored within a few business
              days.
            </p>
          </div>

          <div className="mt-5 flex items-start gap-2 text-[13px] text-ash-dim">
            <CircleCheck size={15} color="var(--periwinkle)" strokeWidth={1.5} className="mt-0.5 shrink-0" />
            <p>No hidden trackers, no data resale, no surprise emails. Just a portfolio and an honest inbox.</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
