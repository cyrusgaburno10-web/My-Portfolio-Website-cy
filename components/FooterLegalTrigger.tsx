'use client';

import { useState } from 'react';
import { PrivacyModal } from '@/components/PrivacyModal';

export function FooterLegalTrigger() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="font-mono text-[11px] uppercase tracking-[0.12em] text-ash-dim transition-colors hover:text-text"
        >
          Privacy Policy
        </button>
        <span className="text-line">&middot;</span>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="font-mono text-[11px] uppercase tracking-[0.12em] text-ash-dim transition-colors hover:text-text"
        >
          Request Data Deletion
        </button>
      </div>

      {open && <PrivacyModal onClose={() => setOpen(false)} />}
    </>
  );
}
