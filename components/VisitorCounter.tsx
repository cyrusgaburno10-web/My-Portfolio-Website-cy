'use client';

import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';

type Status = 'loading' | 'done' | 'error';

export function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);
  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    let cancelled = false;

    fetch('/api/visitor-count')
      .then((res) => res.json())
      .then((data: { count: number | null }) => {
        if (cancelled) return;
        if (typeof data.count === 'number') {
          setCount(data.count);
          setStatus('done');
        } else {
          setStatus('error');
        }
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (status === 'error') return null;

  return (
    <p className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-ash-dim">
      <Eye size={12} strokeWidth={1.75} />
      {status === 'loading' ? (
        <span className="inline-block h-3 w-14 animate-pulse rounded bg-line" aria-hidden="true" />
      ) : (
        <span>{count!.toLocaleString()} views</span>
      )}
    </p>
  );
}
