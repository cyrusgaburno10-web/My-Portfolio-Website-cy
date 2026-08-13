'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, CheckCircle2, Loader2, LogOut, Save } from 'lucide-react';
import type { SiteSettings } from '@/lib/settings';

type Status = 'idle' | 'saving' | 'success' | 'error';

const inputClass =
  'w-full rounded-xl border border-line bg-void-deep/60 p-3 text-[14px] text-text placeholder:text-ash-dim focus:border-periwinkle focus:outline-none';
const labelClass = 'font-mono text-[11px] uppercase tracking-[0.14em] text-periwinkle';

const FIELDS = [
  {
    key: 'calendlyUrl' as const,
    label: 'Calendar booking link',
    help: 'Where the "Book a Call" button sends people to schedule.',
    placeholder: 'https://calendly.com/your-name/new-meeting',
    type: 'url',
  },
  {
    key: 'contactDestinationEmail' as const,
    label: 'Contact form email',
    help: 'Messages sent through your contact form land here.',
    placeholder: 'you@example.com',
    type: 'email',
  },
];

const CONTACT_FIELDS = [
  {
    key: 'contactEmail' as const,
    label: 'Public email',
    help: 'Shown on the Contact section with a click-to-copy button and QR code.',
    placeholder: 'you@example.com',
    type: 'email',
  },
  {
    key: 'contactPhone' as const,
    label: 'Phone / WhatsApp',
    help: 'Include the country code. Used to generate the WhatsApp link and QR code.',
    placeholder: '+1 555 123 4567',
    type: 'text',
  },
  {
    key: 'contactLinkedinUrl' as const,
    label: 'LinkedIn profile link',
    help: 'Paste the full URL — the site displays a shortened version automatically.',
    placeholder: 'https://www.linkedin.com/in/your-name',
    type: 'url',
  },
  {
    key: 'contactUpworkUrl' as const,
    label: 'Upwork profile link',
    help: 'Paste the full URL — the site displays a shortened version automatically.',
    placeholder: 'https://www.upwork.com/freelancers/~your-id',
    type: 'url',
  },
];

export function AdminSettingsPanel({ initialSettings }: { initialSettings: SiteSettings }) {
  const router = useRouter();
  const [calendlyUrl, setCalendlyUrl] = useState(initialSettings.calendlyUrl);
  const [contactDestinationEmail, setContactDestinationEmail] = useState(initialSettings.contactDestinationEmail);
  const [aiProvider, setAiProvider] = useState(initialSettings.aiProvider || '');
  const [aiModel, setAiModel] = useState(initialSettings.aiModel || '');
  const [contactEmail, setContactEmail] = useState(initialSettings.contactEmail);
  const [contactPhone, setContactPhone] = useState(initialSettings.contactPhone);
  const [contactLinkedinUrl, setContactLinkedinUrl] = useState(initialSettings.contactLinkedinUrl);
  const [contactUpworkUrl, setContactUpworkUrl] = useState(initialSettings.contactUpworkUrl);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [loggingOut, setLoggingOut] = useState(false);

  const values: Record<(typeof FIELDS)[number]['key'], string> = {
    calendlyUrl,
    contactDestinationEmail,
  };
  const setters: Record<(typeof FIELDS)[number]['key'], (v: string) => void> = {
    calendlyUrl: setCalendlyUrl,
    contactDestinationEmail: setContactDestinationEmail,
  };

  const contactValues: Record<(typeof CONTACT_FIELDS)[number]['key'], string> = {
    contactEmail,
    contactPhone,
    contactLinkedinUrl,
    contactUpworkUrl,
  };
  const contactSetters: Record<(typeof CONTACT_FIELDS)[number]['key'], (v: string) => void> = {
    contactEmail: setContactEmail,
    contactPhone: setContactPhone,
    contactLinkedinUrl: setContactLinkedinUrl,
    contactUpworkUrl: setContactUpworkUrl,
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('saving');
    setErrorMessage('');

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          calendlyUrl,
          contactDestinationEmail,
          aiProvider,
          aiModel,
          contactEmail,
          contactPhone,
          contactLinkedinUrl,
          contactUpworkUrl,
        }),
      });
      const data: { ok?: boolean; error?: string } = await res.json();

      if (!res.ok || !data.ok) {
        setErrorMessage(data.error || 'Something went wrong. Please try again.');
        setStatus('error');
        return;
      }

      setStatus('success');
    } catch {
      setErrorMessage('Could not reach the server. Please check your connection and try again.');
      setStatus('error');
    }
  }

  async function handleLogout() {
    setLoggingOut(true);
    await fetch('/api/admin/logout', { method: 'POST' });
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-semibold text-text">Site Settings</h1>
          <p className="mt-1 text-[13px] text-ash">
            Changes here go live within about a minute, no redeploy needed.
          </p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ash transition-colors hover:border-periwinkle hover:text-text disabled:opacity-60"
        >
          <LogOut size={13} strokeWidth={1.75} />
          Log Out
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 rounded-2xl border border-line bg-void-deep/40 p-6">
        {FIELDS.map((field) => (
          <div key={field.key} className="flex flex-col gap-1.5">
            <label className={labelClass}>{field.label}</label>
            <input
              type={field.type}
              value={values[field.key]}
              onChange={(e) => setters[field.key](e.target.value)}
              placeholder={field.placeholder}
              disabled={status === 'saving'}
              className={inputClass}
            />
            <p className="text-[12px] leading-relaxed text-ash-dim">{field.help}</p>
          </div>
        ))}

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>AI chat provider</label>
          <select
            value={aiProvider}
            onChange={(e) => setAiProvider(e.target.value)}
            disabled={status === 'saving'}
            className={`${inputClass} appearance-none`}
          >
            <option value="">Automatic (recommended)</option>
            <option value="groq">Groq</option>
            <option value="openai">OpenAI</option>
          </select>
          <p className="text-[12px] leading-relaxed text-ash-dim">
            Which AI service powers your site&rsquo;s chat assistant. Leave on Automatic unless you have a
            reason to force one.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>
            AI model <span className="text-ash-dim">(advanced, optional)</span>
          </label>
          <input
            type="text"
            value={aiModel}
            onChange={(e) => setAiModel(e.target.value)}
            placeholder="Leave blank to use the default"
            disabled={status === 'saving'}
            className={inputClass}
          />
          <p className="text-[12px] leading-relaxed text-ash-dim">
            Only change this if you know the exact model name for your chosen provider.
          </p>
        </div>

        <div className="border-t border-line pt-5">
          <h2 className="font-display text-[15px] font-semibold text-text">Contact Info</h2>
          <p className="mt-1 text-[12px] text-ash-dim">
            Shown on your Contact section and known by your AI chat assistant.
          </p>
        </div>

        {CONTACT_FIELDS.map((field) => (
          <div key={field.key} className="flex flex-col gap-1.5">
            <label className={labelClass}>{field.label}</label>
            <input
              type={field.type}
              value={contactValues[field.key]}
              onChange={(e) => contactSetters[field.key](e.target.value)}
              placeholder={field.placeholder}
              disabled={status === 'saving'}
              className={inputClass}
            />
            <p className="text-[12px] leading-relaxed text-ash-dim">{field.help}</p>
          </div>
        ))}

        {status === 'error' && (
          <div className="flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-[12px] text-rose-300">
            <AlertCircle size={14} strokeWidth={1.75} className="mt-0.5 shrink-0" />
            <p>{errorMessage}</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex items-start gap-2 rounded-xl border border-periwinkle/30 bg-periwinkle/10 px-3 py-2 text-[12px] text-periwinkle">
            <CheckCircle2 size={14} strokeWidth={1.75} className="mt-0.5 shrink-0" />
            <p>Saved. Your site will pick this up within about a minute.</p>
          </div>
        )}

        <button
          type="submit"
          disabled={status === 'saving'}
          className="inline-flex items-center justify-center gap-1.5 rounded-full bg-indigo px-5 py-2.5 font-mono text-[12px] uppercase tracking-[0.14em] text-white-fleck transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {status === 'saving' ? (
            <>
              <Loader2 size={14} strokeWidth={1.75} className="animate-spin" />
              Saving
            </>
          ) : (
            <>
              Save Changes
              <Save size={14} strokeWidth={1.75} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
