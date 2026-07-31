'use client';

import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';

type Status = 'loading' | 'done' | 'error';

const OWNER_STORAGE_KEY = 'cg-portfolio-owner';
const OWNER_QUERY_PARAM = 'owner';
const OWNER_QUERY_VALUE = 'cyrus';
const SESSION_STORAGE_KEY = 'cg-portfolio-visited';

export function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);
  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    let cancelled = false;

    const url = new URL(window.location.href);
    if (url.searchParams.get(OWNER_QUERY_PARAM) === OWNER_QUERY_VALUE) {
      localStorage.setItem(OWNER_STORAGE_KEY, '1');
      url.searchParams.delete(OWNER_QUERY_PARAM);
      window.history.replaceState({}, '', url.toString());
    }

    const isOwner = localStorage.getItem(OWNER_STORAGE_KEY) === '1';
    const isNewVisit = !isOwner && !sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (isNewVisit) sessionStorage.setItem(SESSION_STORAGE_KEY, '1');

    fetch(`/api/visitor-count${isNewVisit ? '?new=true' : ''}`)
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
        <span>{count!.toLocaleString()} visits</span>
      )}
    </p>
  );
}
