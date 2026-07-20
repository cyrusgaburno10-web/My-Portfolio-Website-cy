'use client';

import { useState } from 'react';
import { AlertCircle, CheckCircle2, Loader2, Send } from 'lucide-react';

type Status = 'idle' | 'submitting' | 'success' | 'error';

const inputClass =
  'w-full rounded-xl border border-line bg-void-deep/60 p-3 text-[14px] text-text placeholder:text-ash-dim focus:border-periwinkle focus:outline-none';

export function ContactMessageForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      const data: { ok?: boolean; error?: string } = await res.json();

      if (!res.ok || !data.ok) {
        setErrorMessage(data.error || 'Something went wrong. Please try again.');
        setStatus('error');
        return;
      }

      setStatus('success');
      setName('');
      setEmail('');
      setMessage('');
    } catch {
      setErrorMessage('Something went wrong. Please check your connection and try again.');
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 rounded-2xl border border-line bg-void-deep/40 p-10 text-center">
        <CheckCircle2 size={28} color="var(--periwinkle)" strokeWidth={1.5} />
        <p className="font-display text-lg font-semibold text-text">Message sent</p>
        <p className="text-[14px] text-ash">Thanks for reaching out. I&rsquo;ll get back to you soon.</p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-periwinkle hover:text-text"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-full flex-col gap-3 rounded-2xl border border-line bg-void-deep/40 p-5"
    >
      <input
        type="text"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        className={inputClass}
        disabled={status === 'submitting'}
      />
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        className={inputClass}
        disabled={status === 'submitting'}
      />
      <textarea
        required
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="What are you looking to automate?"
        rows={5}
        className={`${inputClass} flex-1 resize-none`}
        disabled={status === 'submitting'}
      />

      {status === 'error' && (
        <div className="flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-[12px] text-rose-300">
          <AlertCircle size={14} strokeWidth={1.75} className="mt-0.5 shrink-0" />
          <p>{errorMessage}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="inline-flex items-center justify-center gap-1.5 rounded-full bg-indigo px-5 py-2.5 font-mono text-[12px] uppercase tracking-[0.14em] text-white-fleck transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
      >
        {status === 'submitting' ? (
          <>
            <Loader2 size={14} strokeWidth={1.75} className="animate-spin" />
            Sending
          </>
        ) : (
          <>
            Send Message
            <Send size={14} strokeWidth={1.75} />
          </>
        )}
      </button>
    </form>
  );
}
