'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AlertCircle, CheckCircle2, Loader2, Pencil, Save, Trash2, Upload, X } from 'lucide-react';
import type { Credential } from '@/lib/credentials';

type Status = 'idle' | 'saving' | 'error';

const inputClass =
  'w-full rounded-xl border border-line bg-void-deep/60 p-3 text-[14px] text-text placeholder:text-ash-dim focus:border-periwinkle focus:outline-none';
const labelClass = 'font-mono text-[11px] uppercase tracking-[0.14em] text-periwinkle';

function emptyForm() {
  return { title: '', program: '', issuer: '', date: '' };
}

function formFromCredential(credential: Credential): ReturnType<typeof emptyForm> {
  return {
    title: credential.title,
    program: credential.program,
    issuer: credential.issuer,
    date: credential.date,
  };
}

export function AdminCredentialsPanel({ initialCredentials }: { initialCredentials: Credential[] }) {
  const [credentials, setCredentials] = useState(initialCredentials);
  const [form, setForm] = useState(emptyForm());
  const [file, setFile] = useState<File | null>(null);
  const [currentFileUrl, setCurrentFileUrl] = useState<string | undefined>(undefined);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function updateField(key: keyof ReturnType<typeof emptyForm>, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function startEdit(credential: Credential) {
    setEditingId(credential.id);
    setForm(formFromCredential(credential));
    setFile(null);
    setCurrentFileUrl(credential.file);
    setStatus('idle');
    setErrorMessage('');
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm());
    setFile(null);
    setCurrentFileUrl(undefined);
    setStatus('idle');
    setErrorMessage('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('saving');
    setErrorMessage('');

    const data = new FormData();
    data.set('title', form.title);
    data.set('program', form.program);
    data.set('issuer', form.issuer);
    data.set('date', form.date);
    if (file) data.set('file', file);
    if (editingId && currentFileUrl) data.set('currentFile', currentFileUrl);

    try {
      const res = await fetch(editingId ? `/api/admin/credentials/${editingId}` : '/api/admin/credentials', {
        method: editingId ? 'PUT' : 'POST',
        body: data,
      });
      const result: { ok?: boolean; error?: string; credential?: Credential } = await res.json();

      if (!res.ok || !result.ok || !result.credential) {
        setErrorMessage(result.error || 'Something went wrong. Please try again.');
        setStatus('error');
        return;
      }

      if (editingId) {
        setCredentials((c) => c.map((cred) => (cred.id === editingId ? (result.credential as Credential) : cred)));
      } else {
        setCredentials((c) => [result.credential as Credential, ...c]);
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
      const res = await fetch(`/api/admin/credentials/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCredentials((c) => c.filter((cred) => cred.id !== id));
        if (editingId === id) cancelEdit();
      }
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-lg font-semibold text-text">Your Credentials</h2>
        <p className="mt-1 text-[13px] text-ash">Every certificate on your site. Edit any of them, or add a new one below.</p>
      </div>

      <div className="flex flex-col gap-2">
        {credentials.map((credential) => (
          <div
            key={credential.id}
            className={`flex items-center gap-3 rounded-xl border p-3 transition-colors ${
              editingId === credential.id ? 'border-periwinkle/60 bg-periwinkle/5' : 'border-line bg-void-deep/40'
            }`}
          >
            <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg border border-line bg-void-deep">
              {credential.file && <Image src={credential.file} alt="" fill className="object-cover" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] text-text">{credential.title}</p>
              {!credential.isCustom && <p className="text-[11px] text-ash-dim">Original credential</p>}
            </div>
            <button
              type="button"
              onClick={() => startEdit(credential)}
              aria-label={`Edit ${credential.title}`}
              className="shrink-0 rounded-full p-2 text-ash-dim transition-colors hover:text-periwinkle"
            >
              <Pencil size={15} strokeWidth={1.75} />
            </button>
            {credential.isCustom && (
              <button
                type="button"
                onClick={() => handleDelete(credential.id)}
                disabled={deletingId === credential.id}
                aria-label={`Remove ${credential.title}`}
                className="shrink-0 rounded-full p-2 text-ash-dim transition-colors hover:text-rose-300 disabled:opacity-50"
              >
                {deletingId === credential.id ? (
                  <Loader2 size={15} strokeWidth={1.75} className="animate-spin" />
                ) : (
                  <Trash2 size={15} strokeWidth={1.75} />
                )}
              </button>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 rounded-2xl border border-line bg-void-deep/40 p-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-display text-base font-semibold text-text">
            {editingId ? 'Edit Credential' : 'Add a New Credential'}
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
          <label className={labelClass}>Certificate title</label>
          <input
            type="text"
            required
            value={form.title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="e.g. HubSpot CRM Certified"
            disabled={status === 'saving'}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Program name</label>
          <input
            type="text"
            required
            value={form.program}
            onChange={(e) => updateField('program', e.target.value)}
            placeholder="e.g. Inbound Sales Certification"
            disabled={status === 'saving'}
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Issued by</label>
            <input
              type="text"
              required
              value={form.issuer}
              onChange={(e) => updateField('issuer', e.target.value)}
              placeholder="e.g. HubSpot Academy"
              disabled={status === 'saving'}
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Date</label>
            <input
              type="text"
              required
              value={form.date}
              onChange={(e) => updateField('date', e.target.value)}
              placeholder="e.g. August 13, 2026"
              disabled={status === 'saving'}
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Certificate image</label>
          {currentFileUrl && !file && (
            <div className="flex items-center gap-3 rounded-xl border border-line p-2">
              <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg border border-line bg-void-deep">
                <Image src={currentFileUrl} alt="" fill className="object-cover" />
              </div>
              <p className="text-[12px] text-ash-dim">Current image — choose a new file below to replace it.</p>
            </div>
          )}
          <label
            className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed p-5 text-center transition-colors ${
              file ? 'border-periwinkle/40' : 'border-line hover:border-periwinkle/40'
            }`}
          >
            <Upload size={16} color="var(--periwinkle)" strokeWidth={1.75} />
            <span className="text-[14px] text-ash">{file ? file.name : 'Choose an image of the certificate'}</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={status === 'saving'}
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </label>
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
              {editingId ? 'Saving' : 'Adding Credential'}
            </>
          ) : editingId ? (
            <>
              <Save size={14} strokeWidth={1.75} />
              Save Changes
            </>
          ) : (
            <>
              <CheckCircle2 size={14} strokeWidth={1.75} />
              Add Credential
            </>
          )}
        </button>
      </form>
    </div>
  );
}
