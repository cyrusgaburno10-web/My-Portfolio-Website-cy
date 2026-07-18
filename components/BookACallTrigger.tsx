'use client';

import { useState } from 'react';
import { ArrowRight, Phone } from 'lucide-react';
import { BookACallModal } from '@/components/BookACallModal';

export function BookACallTrigger() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
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

      {open && <BookACallModal onClose={() => setOpen(false)} />}
    </>
  );
}
