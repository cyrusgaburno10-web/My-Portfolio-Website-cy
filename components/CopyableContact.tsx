'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export function CopyableContact({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard API unavailable — the value is still visible and selectable
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? 'Copied to clipboard' : `Copy ${value}`}
      className="mx-0.5 inline-flex max-w-full items-center gap-1 rounded-md border border-line bg-void-deep/60 px-1.5 py-0.5 align-middle font-mono text-[0.92em] text-periwinkle transition-colors hover:border-periwinkle hover:text-text"
    >
      <span className="break-all">{value}</span>
      {copied ? <Check size={12} strokeWidth={1.75} className="shrink-0" /> : <Copy size={12} strokeWidth={1.75} className="shrink-0" />}
    </button>
  );
}
