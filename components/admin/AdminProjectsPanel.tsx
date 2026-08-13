'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AlertCircle, CheckCircle2, Loader2, Pencil, Plus, Save, Trash2, Upload, X } from 'lucide-react';
import type { Project, WorkflowStep } from '@/lib/projects';

type Status = 'idle' | 'saving' | 'error';

const inputClass =
  'w-full rounded-xl border border-line bg-void-deep/60 p-3 text-[14px] text-text placeholder:text-ash-dim focus:border-periwinkle focus:outline-none';
const labelClass = 'font-mono text-[11px] uppercase tracking-[0.14em] text-periwinkle';

const EMPTY_STEP: WorkflowStep = { title: '', body: '' };

function emptyForm() {
  return {
    title: '',
    stack: '',
    description: '',
    challenge: '',
    outcome: '',
    metricValue: '',
    metricLabel: '',
    badges: '',
    videoUrl: '',
  };
}

function formFromProject(project: Project): ReturnType<typeof emptyForm> {
  return {
    title: project.title,
    stack: project.stack,
    description: project.description,
    challenge: project.challenge,
    outcome: project.outcome,
    metricValue: project.metric.value,
    metricLabel: project.metric.label,
    badges: project.badges.join(', '),
    videoUrl: project.videoUrl || '',
  };
}

export function AdminProjectsPanel({ initialProjects }: { initialProjects: Project[] }) {
  const [projects, setProjects] = useState(initialProjects);
  const [form, setForm] = useState(emptyForm());
  const [steps, setSteps] = useState<WorkflowStep[]>([EMPTY_STEP]);
  const [image, setImage] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | undefined>(undefined);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function updateField(key: keyof ReturnType<typeof emptyForm>, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function updateStep(index: number, key: keyof WorkflowStep, value: string) {
    setSteps((s) => s.map((step, i) => (i === index ? { ...step, [key]: value } : step)));
  }

  function addStep() {
    setSteps((s) => [...s, { ...EMPTY_STEP }]);
  }

  function removeStep(index: number) {
    setSteps((s) => (s.length > 1 ? s.filter((_, i) => i !== index) : s));
  }

  function startEdit(project: Project) {
    setEditingId(project.id);
    setForm(formFromProject(project));
    setSteps(project.howItsBuilt.length > 0 ? project.howItsBuilt.map((s) => ({ ...s })) : [{ ...EMPTY_STEP }]);
    setImage(null);
    setCurrentImageUrl(project.image);
    setStatus('idle');
    setErrorMessage('');
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm());
    setSteps([{ ...EMPTY_STEP }]);
    setImage(null);
    setCurrentImageUrl(undefined);
    setStatus('idle');
    setErrorMessage('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('saving');
    setErrorMessage('');

    const data = new FormData();
    data.set('title', form.title);
    data.set('stack', form.stack);
    data.set('description', form.description);
    data.set('challenge', form.challenge);
    data.set('outcome', form.outcome);
    data.set('metricValue', form.metricValue);
    data.set('metricLabel', form.metricLabel);
    data.set('badges', form.badges);
    data.set('videoUrl', form.videoUrl);
    data.set('howItsBuilt', JSON.stringify(steps));
    if (image) data.set('image', image);
    if (editingId && currentImageUrl) data.set('currentImage', currentImageUrl);

    try {
      const res = await fetch(editingId ? `/api/admin/projects/${editingId}` : '/api/admin/projects', {
        method: editingId ? 'PUT' : 'POST',
        body: data,
      });
      const result: { ok?: boolean; error?: string; project?: Project } = await res.json();

      if (!res.ok || !result.ok || !result.project) {
        setErrorMessage(result.error || 'Something went wrong. Please try again.');
        setStatus('error');
        return;
      }

      if (editingId) {
        setProjects((p) => p.map((proj) => (proj.id === editingId ? (result.project as Project) : proj)));
      } else {
        setProjects((p) => [result.project as Project, ...p]);
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
      const res = await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProjects((p) => p.filter((proj) => proj.id !== id));
        if (editingId === id) cancelEdit();
      }
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-lg font-semibold text-text">Your Projects</h2>
        <p className="mt-1 text-[13px] text-ash">Every case study on your site. Edit any of them, or add a new one below.</p>
      </div>

      <div className="flex flex-col gap-2">
        {projects.map((project) => (
          <div
            key={project.id}
            className={`flex items-center gap-3 rounded-xl border p-3 transition-colors ${
              editingId === project.id ? 'border-periwinkle/60 bg-periwinkle/5' : 'border-line bg-void-deep/40'
            }`}
          >
            <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg border border-line bg-void-deep">
              {project.image && <Image src={project.image} alt="" fill className="object-cover" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] text-text">{project.title}</p>
              {!project.isCustom && <p className="text-[11px] text-ash-dim">Original case study</p>}
            </div>
            <button
              type="button"
              onClick={() => startEdit(project)}
              aria-label={`Edit ${project.title}`}
              className="shrink-0 rounded-full p-2 text-ash-dim transition-colors hover:text-periwinkle"
            >
              <Pencil size={15} strokeWidth={1.75} />
            </button>
            {project.isCustom && (
              <button
                type="button"
                onClick={() => handleDelete(project.id)}
                disabled={deletingId === project.id}
                aria-label={`Remove ${project.title}`}
                className="shrink-0 rounded-full p-2 text-ash-dim transition-colors hover:text-rose-300 disabled:opacity-50"
              >
                {deletingId === project.id ? (
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
            {editingId ? 'Edit Project' : 'Add a New Project'}
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
          <label className={labelClass}>Project title</label>
          <input
            type="text"
            required
            value={form.title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="e.g. AI-Powered Support Ticket Router"
            disabled={status === 'saving'}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Tools used</label>
          <input
            type="text"
            required
            value={form.stack}
            onChange={(e) => updateField('stack', e.target.value)}
            placeholder="e.g. n8n + Slack + Gemini"
            disabled={status === 'saving'}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Short description</label>
          <textarea
            required
            rows={2}
            value={form.description}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="One or two sentences on what this workflow does."
            disabled={status === 'saving'}
            className={`${inputClass} resize-none`}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>The challenge</label>
          <textarea
            required
            rows={2}
            value={form.challenge}
            onChange={(e) => updateField('challenge', e.target.value)}
            placeholder="What was broken or manual before this existed?"
            disabled={status === 'saving'}
            className={`${inputClass} resize-none`}
          />
          <p className="text-[12px] text-ash-dim">Shown on the &ldquo;Challenge&rdquo; side of the case study.</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>The outcome</label>
          <textarea
            required
            rows={2}
            value={form.outcome}
            onChange={(e) => updateField('outcome', e.target.value)}
            placeholder="The result, in one confident sentence."
            disabled={status === 'saving'}
            className={`${inputClass} resize-none`}
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Headline number</label>
            <input
              type="text"
              required
              value={form.metricValue}
              onChange={(e) => updateField('metricValue', e.target.value)}
              placeholder="e.g. ~15 min"
              disabled={status === 'saving'}
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>What that number means</label>
            <input
              type="text"
              required
              value={form.metricLabel}
              onChange={(e) => updateField('metricLabel', e.target.value)}
              placeholder="e.g. saved per request (estimated)"
              disabled={status === 'saving'}
              className={inputClass}
            />
          </div>
        </div>
        <p className="-mt-3 text-[12px] text-ash-dim">
          This shows as a bold stat on the project card. Only claim numbers you can explain if someone asks.
        </p>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>
            Badges <span className="text-ash-dim">(comma separated)</span>
          </label>
          <input
            type="text"
            value={form.badges}
            onChange={(e) => updateField('badges', e.target.value)}
            placeholder="e.g. AI ROUTING, ZERO MANUAL TRIAGE"
            disabled={status === 'saving'}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className={labelClass}>How it&rsquo;s built</label>
          <p className="text-[12px] text-ash-dim">Break it into steps — this becomes the numbered walkthrough visitors click through.</p>
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col gap-2 rounded-xl border border-line p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[11px] text-ash-dim">Step {i + 1}</span>
                {steps.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeStep(i)}
                    aria-label={`Remove step ${i + 1}`}
                    className="text-ash-dim transition-colors hover:text-rose-300"
                  >
                    <X size={14} strokeWidth={1.75} />
                  </button>
                )}
              </div>
              <input
                type="text"
                required
                value={step.title}
                onChange={(e) => updateStep(i, 'title', e.target.value)}
                placeholder="Step title, e.g. AI Classification"
                disabled={status === 'saving'}
                className={inputClass}
              />
              <textarea
                required
                rows={2}
                value={step.body}
                onChange={(e) => updateStep(i, 'body', e.target.value)}
                placeholder="What happens in this step."
                disabled={status === 'saving'}
                className={`${inputClass} resize-none`}
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addStep}
            disabled={status === 'saving'}
            className="inline-flex w-fit items-center gap-1.5 rounded-full border border-line px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ash transition-colors hover:border-periwinkle hover:text-text"
          >
            <Plus size={13} strokeWidth={1.75} />
            Add Step
          </button>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>
            Screenshot <span className="text-ash-dim">(optional)</span>
          </label>
          {currentImageUrl && !image && (
            <div className="flex items-center gap-3 rounded-xl border border-line p-2">
              <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg border border-line bg-void-deep">
                <Image src={currentImageUrl} alt="" fill className="object-cover" />
              </div>
              <p className="text-[12px] text-ash-dim">Current image — choose a new file below to replace it.</p>
            </div>
          )}
          <label
            className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed p-5 text-center transition-colors ${
              image ? 'border-periwinkle/40' : 'border-line hover:border-periwinkle/40'
            }`}
          >
            <Upload size={16} color="var(--periwinkle)" strokeWidth={1.75} />
            <span className="text-[14px] text-ash">{image ? image.name : 'Choose an image of the workflow'}</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={status === 'saving'}
              onChange={(e) => setImage(e.target.files?.[0] || null)}
            />
          </label>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>
            Video walkthrough link <span className="text-ash-dim">(optional)</span>
          </label>
          <input
            type="url"
            value={form.videoUrl}
            onChange={(e) => updateField('videoUrl', e.target.value)}
            placeholder="A YouTube, Loom, Vimeo, or Google Drive link"
            disabled={status === 'saving'}
            className={inputClass}
          />
          <p className="text-[12px] text-ash-dim">Record a screen walkthrough on Loom or YouTube, then paste the link here.</p>
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
              {editingId ? 'Saving' : 'Adding Project'}
            </>
          ) : editingId ? (
            <>
              <Save size={14} strokeWidth={1.75} />
              Save Changes
            </>
          ) : (
            <>
              <CheckCircle2 size={14} strokeWidth={1.75} />
              Add Project
            </>
          )}
        </button>
      </form>
    </div>
  );
}
