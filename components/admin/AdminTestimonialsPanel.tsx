'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AlertCircle, Loader2, Pencil, Quote, Save, Trash2, Upload, X } from 'lucide-react';
import type { Testimonial } from '@/lib/testimonials';

type Status = 'idle' | 'saving' | 'error';

const inputClass =
  'w-full rounded-xl border border-line bg-void-deep/60 p-3 text-[14px] text-text placeholder:text-ash-dim focus:border-periwinkle focus:outline-none';
const labelClass = 'font-mono text-[11px] uppercase tracking-[0.14em] text-periwinkle';

function emptyForm() {
  return { name: '', role: '', quote: '' };
}

function formFromTestimonial(testimonial: Testimonial): ReturnType<typeof emptyForm> {
  return { name: testimonial.name, role: testimonial.role, quote: testimonial.quote };
}

export function AdminTestimonialsPanel({ initialTestimonials }: { initialTestimonials: Testimonial[] }) {
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const [form, setForm] = useState(emptyForm());
  const [avatar, setAvatar] = useState<File | null>(null);
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string | undefined>(undefined);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function updateField(key: keyof ReturnType<typeof emptyForm>, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function startEdit(testimonial: Testimonial) {
    setEditingId(testimonial.id);
    setForm(formFromTestimonial(testimonial));
    setAvatar(null);
    setCurrentAvatarUrl(testimonial.avatar);
    setStatus('idle');
    setErrorMessage('');
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm());
    setAvatar(null);
    setCurrentAvatarUrl(undefined);
    setStatus('idle');
    setErrorMessage('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('saving');
    setErrorMessage('');

    const data = new FormData();
    data.set('name', form.name);
    data.set('role', form.role);
    data.set('quote', form.quote);
    if (avatar) data.set('avatar', avatar);
    if (editingId && currentAvatarUrl) data.set('currentAvatar', currentAvatarUrl);

    try {
      const res = await fetch(editingId ? `/api/admin/testimonials/${editingId}` : '/api/admin/testimonials', {
        method: editingId ? 'PUT' : 'POST',
        body: data,
      });
      const result: { ok?: boolean; error?: string; testimonial?: Testimonial } = await res.json();

      if (!res.ok || !result.ok || !result.testimonial) {
        setErrorMessage(result.error || 'Something went wrong. Please try again.');
        setStatus('error');
        return;
      }

      if (editingId) {
        setTestimonials((t) =>
          t.map((item) => (item.id === editingId ? (result.testimonial as Testimonial) : item))
        );
      } else {
        setTestimonials((t) => [result.testimonial as Testimonial, ...t]);
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
      const res = await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setTestimonials((t) => t.filter((item) => item.id !== id));
        if (editingId === id) cancelEdit();
      }
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-lg font-semibold text-text">Your Testimonials</h2>
        <p className="mt-1 text-[13px] text-ash">
          Client and collaborator feedback shown on your Testimonials section. Add, edit, or remove any of them.
        </p>
      </div>

      {testimonials.length === 0 && (
        <p className="rounded-xl border border-line bg-void-deep/40 p-4 text-[13px] text-ash-dim">
          No testimonials yet. The section stays hidden on your live site until you add at least one.
        </p>
      )}

      <div className="flex flex-col gap-2">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className={`flex items-center gap-3 rounded-xl border p-3 transition-colors ${
              editingId === testimonial.id ? 'border-periwinkle/60 bg-periwinkle/5' : 'border-line bg-void-deep/40'
            }`}
          >
            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-line bg-void-deep">
              {testimonial.avatar ? (
                <Image src={testimonial.avatar} alt="" fill className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-display text-[13px] font-semibold text-periwinkle">
                  {testimonial.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-text">{testimonial.name}</p>
              <p className="truncate text-[12px] text-ash-dim">{testimonial.role}</p>
            </div>
            <button
              type="button"
              onClick={() => startEdit(testimonial)}
              aria-label={`Edit ${testimonial.name}`}
              className="shrink-0 rounded-full p-2 text-ash-dim transition-colors hover:text-periwinkle"
            >
              <Pencil size={15} strokeWidth={1.75} />
            </button>
            <button
              type="button"
              onClick={() => handleDelete(testimonial.id)}
              disabled={deletingId === testimonial.id}
              aria-label={`Remove ${testimonial.name}`}
              className="shrink-0 rounded-full p-2 text-ash-dim transition-colors hover:text-rose-300 disabled:opacity-50"
            >
              {deletingId === testimonial.id ? (
                <Loader2 size={15} strokeWidth={1.75} className="animate-spin" />
              ) : (
                <Trash2 size={15} strokeWidth={1.75} />
              )}
            </button>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 rounded-2xl border border-line bg-void-deep/40 p-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-display text-base font-semibold text-text">
            {editingId ? 'Edit Testimonial' : 'Add a New Testimonial'}
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

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="e.g. Jordan Reyes"
              disabled={status === 'saving'}
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Role / Company</label>
            <input
              type="text"
              required
              value={form.role}
              onChange={(e) => updateField('role', e.target.value)}
              placeholder="e.g. Founder, Reyes Realty Group"
              disabled={status === 'saving'}
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Quote</label>
          <textarea
            required
            rows={4}
            value={form.quote}
            onChange={(e) => updateField('quote', e.target.value)}
            placeholder="What they said about working with you."
            disabled={status === 'saving'}
            className={`${inputClass} resize-none`}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>
            Photo <span className="text-ash-dim">(optional)</span>
          </label>
          {currentAvatarUrl && !avatar && (
            <div className="flex items-center gap-3 rounded-xl border border-line p-2">
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-line bg-void-deep">
                <Image src={currentAvatarUrl} alt="" fill className="object-cover" />
              </div>
              <p className="text-[12px] text-ash-dim">Current photo — choose a new file below to replace it.</p>
            </div>
          )}
          <label
            className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed p-5 text-center transition-colors ${
              avatar ? 'border-periwinkle/40' : 'border-line hover:border-periwinkle/40'
            }`}
          >
            <Upload size={16} color="var(--periwinkle)" strokeWidth={1.75} />
            <span className="text-[14px] text-ash">
              {avatar ? avatar.name : 'Choose a photo, or leave blank to show an initial'}
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={status === 'saving'}
              onChange={(e) => setAvatar(e.target.files?.[0] || null)}
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
              {editingId ? 'Saving' : 'Adding Testimonial'}
            </>
          ) : editingId ? (
            <>
              <Save size={14} strokeWidth={1.75} />
              Save Changes
            </>
          ) : (
            <>
              <Quote size={14} strokeWidth={1.75} />
              Add Testimonial
            </>
          )}
        </button>
      </form>
    </div>
  );
}
