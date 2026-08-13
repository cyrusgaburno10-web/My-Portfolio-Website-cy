'use client';

import { useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { X } from 'lucide-react';
import { getVideoEmbedUrl } from '@/lib/videoEmbed';

interface VideoLightboxProps {
  videoUrl: string;
  title: string;
  onClose: () => void;
}

export function VideoLightbox({ videoUrl, title, onClose }: VideoLightboxProps) {
  const reduceMotion = useReducedMotion();
  const embedUrl = getVideoEmbedUrl(videoUrl, { autoplay: true });

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
      aria-label={`${title} video walkthrough`}
      initial={reduceMotion ? undefined : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-void-deep/90 p-4 backdrop-blur-sm sm:p-8"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <motion.div
        initial={reduceMotion ? undefined : { opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-line bg-void shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close video"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-void-deep/80 text-ash backdrop-blur-md transition-colors hover:text-text"
        >
          <X size={16} strokeWidth={1.5} />
        </button>

        <div className="relative aspect-video w-full bg-void-deep">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={`${title} video walkthrough`}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-8 text-center">
              <p className="text-[14px] text-ash">This video can&rsquo;t be played here.</p>
              <a
                href={videoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-periwinkle transition-colors hover:border-periwinkle hover:text-text"
              >
                Open in a New Tab
              </a>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
