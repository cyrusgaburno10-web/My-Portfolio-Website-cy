'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, Loader2, Lock } from 'lucide-react';

type Status = 'idle' | 'submitting' | 'error';

export function AdminLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data: { ok?: boolean; error?: string } = await res.json();

      if (!res.ok || !data.ok) {
        setErrorMessage(data.error || 'Incorrect password.');
        setStatus('error');
        return;
      }

      router.refresh();
    } catch {
      setErrorMessage('Something went wrong. Please check your connection and try again.');
      setStatus('error');
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-sm flex-col items-center gap-4 rounded-2xl border border-line bg-void-deep/40 p-8 text-center"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-void-deep/60">
        <Lock size={18} color="var(--periwinkle)" strokeWidth={1.5} />
      </div>
      <div>
        <h1 className="font-display text-lg font-semibold text-text">Site Settings</h1>
        <p className="mt-1 text-[13px] text-ash">Enter the admin password to continue.</p>
      </div>

      <input
        type="password"
        required
        autoFocus
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        disabled={status === 'submitting'}
        className="w-full rounded-xl border border-line bg-void-deep/60 p-3 text-center text-[14px] text-text placeholder:text-ash-dim focus:border-periwinkle focus:outline-none"
      />

      {status === 'error' && (
        <div className="flex w-full items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-left text-[12px] text-rose-300">
          <AlertCircle size={14} strokeWidth={1.75} className="mt-0.5 shrink-0" />
          <p>{errorMessage}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-indigo px-5 py-2.5 font-mono text-[12px] uppercase tracking-[0.14em] text-white-fleck transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
      >
        {status === 'submitting' ? (
          <>
            <Loader2 size={14} strokeWidth={1.75} className="animate-spin" />
            Checking
          </>
        ) : (
          'Log In'
        )}
      </button>
    </form>
  );
}
