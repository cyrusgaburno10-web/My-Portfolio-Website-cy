'use client';

import { useState } from 'react';
import {
  AlertCircle,
  Briefcase,
  CheckCircle2,
  Globe,
  Link2,
  Loader2,
  Mail,
  MessageCircle,
  Pencil,
  Phone,
  Save,
  Send,
  Trash2,
  X,
} from 'lucide-react';
import type { ContactEntry, ContactIconKey } from '@/lib/contacts';

type Status = 'idle' | 'saving' | 'error';

const inputClass =
  'w-full rounded-xl border border-line bg-void-deep/60 p-3 text-[14px] text-text placeholder:text-ash-dim focus:border-periwinkle focus:outline-none';
const labelClass = 'font-mono text-[11px] uppercase tracking-[0.14em] text-periwinkle';

const ICON_MAP: Record<ContactIconKey, typeof Mail> = {
  mail: Mail,
  phone: Phone,
  chat: MessageCircle,
  globe: Globe,
  briefcase: Briefcase,
  send: Send,
  link: Link2,
};

const ICON_OPTIONS: { key: ContactIconKey; label: string }[] = [
  { key: 'mail', label: 'Email' },
  { key: 'phone', label: 'Phone / Call' },
  { key: 'chat', label: 'Chat / WhatsApp' },
  { key: 'globe', label: 'Website / Social Profile' },
  { key: 'briefcase', label: 'Work Platform (e.g. Upwork, Fiverr)' },
  { key: 'send', label: 'Telegram / Direct Message' },
  { key: 'link', label: 'Other / Generic Link' },
];

function emptyForm() {
  return { label: '', value: '', link: '', icon: 'link' as ContactIconKey };
}

function formFromContact(contact: ContactEntry): ReturnType<typeof emptyForm> {
  return { label: contact.label, value: contact.value, link: contact.link, icon: contact.icon };
}

export function AdminContactsPanel({ initialContacts }: { initialContacts: ContactEntry[] }) {
  const [contacts, setContacts] = useState(initialContacts);
  const [form, setForm] = useState(emptyForm());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function updateField(key: keyof ReturnType<typeof emptyForm>, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function startEdit(contact: ContactEntry) {
    setEditingId(contact.id);
    setForm(formFromContact(contact));
    setStatus('idle');
    setErrorMessage('');
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm());
    setStatus('idle');
    setErrorMessage('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('saving');
    setErrorMessage('');

    try {
      const res = await fetch(editingId ? `/api/admin/contacts/${editingId}` : '/api/admin/contacts', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const result: { ok?: boolean; error?: string; contact?: ContactEntry } = await res.json();

      if (!res.ok || !result.ok || !result.contact) {
        setErrorMessage(result.error || 'Something went wrong. Please try again.');
        setStatus('error');
        return;
      }

      if (editingId) {
        setContacts((c) => c.map((contact) => (contact.id === editingId ? (result.contact as ContactEntry) : contact)));
      } else {
        setContacts((c) => [...c, result.contact as ContactEntry]);
      }
      cancelEdit();
    } catch {
      setErrorMessage('Could not reach the server. Please check your connection and try again.');
      setStatus('error');
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/contacts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setContacts((c) => c.filter((contact) => contact.id !== id));
        if (editingId === id) cancelEdit();
      }
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-lg font-semibold text-text">Your Contacts</h2>
        <p className="mt-1 text-[13px] text-ash">
          Every channel on your Contact section and known by your AI chat assistant. Add, edit, or remove any of them.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {contacts.map((contact) => {
          const Icon = ICON_MAP[contact.icon];
          return (
            <div
              key={contact.id}
              className={`flex items-center gap-3 rounded-xl border p-3 transition-colors ${
                editingId === contact.id ? 'border-periwinkle/60 bg-periwinkle/5' : 'border-line bg-void-deep/40'
              }`}
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line bg-void-deep/60">
                <Icon size={18} color="var(--periwinkle)" strokeWidth={1.5} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-text">{contact.label}</p>
                <p className="truncate text-[12px] text-ash-dim">{contact.value}</p>
              </div>
              <button
                type="button"
                onClick={() => startEdit(contact)}
                aria-label={`Edit ${contact.label}`}
                className="shrink-0 rounded-full p-2 text-ash-dim transition-colors hover:text-periwinkle"
              >
                <Pencil size={15} strokeWidth={1.75} />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(contact.id)}
                disabled={deletingId === contact.id}
                aria-label={`Remove ${contact.label}`}
                className="shrink-0 rounded-full p-2 text-ash-dim transition-colors hover:text-rose-300 disabled:opacity-50"
              >
                {deletingId === contact.id ? (
                  <Loader2 size={15} strokeWidth={1.75} className="animate-spin" />
                ) : (
                  <Trash2 size={15} strokeWidth={1.75} />
                )}
              </button>
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 rounded-2xl border border-line bg-void-deep/40 p-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-display text-base font-semibold text-text">
            {editingId ? 'Edit Contact' : 'Add a New Contact'}
          </h3>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-ash-dim transition-colors hover:text-text"
            >
              <X size={13} strokeWidth={1.75} />
              Cancel
            </button>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Label</label>
          <input
            type="text"
            required
            value={form.label}
            onChange={(e) => updateField('label', e.target.value)}
            placeholder="e.g. Instagram"
            disabled={status === 'saving'}
            className={inputClass}
          />
          <p className="text-[12px] text-ash-dim">The heading shown above this contact on your site.</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Display text</label>
          <input
            type="text"
            required
            value={form.value}
            onChange={(e) => updateField('value', e.target.value)}
            placeholder="e.g. @cyrusgaburno"
            disabled={status === 'saving'}
            className={inputClass}
          />
          <p className="text-[12px] text-ash-dim">What visitors see and can click to copy.</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Link</label>
          <input
            type="text"
            required
            value={form.link}
            onChange={(e) => updateField('link', e.target.value)}
            placeholder="e.g. https://instagram.com/cyrusgaburno"
            disabled={status === 'saving'}
            className={inputClass}
          />
          <p className="text-[12px] text-ash-dim">
            What the QR code opens. For email use &ldquo;mailto:you@example.com&rdquo;, for WhatsApp use
            &ldquo;https://wa.me/15551234567&rdquo; (digits only, no plus sign or spaces).
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Icon</label>
          <select
            value={form.icon}
            onChange={(e) => updateField('icon', e.target.value)}
            disabled={status === 'saving'}
            className={`${inputClass} appearance-none`}
          >
            {ICON_OPTIONS.map((opt) => (
              <option key={opt.key} value={opt.key}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {status === 'error' && (
          <div className="flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-[12px] text-rose-300">
            <AlertCircle size={14} strokeWidth={1.75} className="mt-0.5 shrink-0" />
            <p>{errorMessage}</p>
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
              {editingId ? 'Saving' : 'Adding Contact'}
            </>
          ) : editingId ? (
            <>
              <Save size={14} strokeWidth={1.75} />
              Save Changes
            </>
          ) : (
            <>
              <CheckCircle2 size={14} strokeWidth={1.75} />
              Add Contact
            </>
          )}
        </button>
      </form>
    </div>
  );
}
