'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { CheckCircle2, Play, RotateCcw, Zap } from 'lucide-react';
import { PROJECTS } from '@/lib/projects';

const STEP_DURATION_MS = 1600;

const SHORT_LABELS: Record<string, string> = {
  'lead-management': 'Lead Automation',
  'finance-tracker': 'Finance Tracker',
  'asana-crm': 'Asana CRM (Zapier)',
  'asana-crm-n8n': 'Asana CRM (n8n)',
  'voice-receptionist': 'Voice Receptionist',
  'doc-auto-sorter': 'Doc Auto-Sorter',
};

export function AutomationSimulator() {
  const [activeId, setActiveId] = useState(PROJECTS[0].id);
  const [running, setRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const reduceMotion = useReducedMotion();

  const project = PROJECTS.find((p) => p.id === activeId)!;
  const steps = project.howItsBuilt;
  const isComplete = currentStep === steps.length - 1 && !running;

  useEffect(() => {
    if (!running) return;
    if (currentStep >= steps.length - 1) {
      const t = setTimeout(() => setRunning(false), 300);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setCurrentStep((s) => s + 1), STEP_DURATION_MS);
    return () => clearTimeout(t);
  }, [running, currentStep, steps.length]);

  function handleSelect(id: string) {
    setActiveId(id);
    setRunning(false);
    setCurrentStep(-1);
  }

  function handleRun() {
    setCurrentStep(0);
    setRunning(true);
  }

  function handleReset() {
    setRunning(false);
    setCurrentStep(-1);
  }

  const progressPercent = currentStep < 0 ? 0 : (currentStep / (steps.length - 1)) * 100;

  return (
    <div>
      <div className="nav-scroll flex gap-2 overflow-x-auto pb-1">
        {PROJECTS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => handleSelect(p.id)}
            className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors ${
              activeId === p.id
                ? 'border-periwinkle/40 bg-periwinkle/10 text-periwinkle'
                : 'border-line text-ash hover:text-text'
            }`}
          >
            {SHORT_LABELS[p.id] ?? p.title}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-line bg-void-deep/40 p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-xl font-semibold text-text">{project.title}</h3>
            <p className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ash-dim">{project.stack}</p>
          </div>

          <div className="flex shrink-0 gap-2">
            {!running && (
              <button
                type="button"
                onClick={handleRun}
                className="inline-flex items-center gap-1.5 rounded-full bg-indigo px-5 py-2.5 font-mono text-[12px] uppercase tracking-[0.14em] text-white-fleck transition-transform hover:-translate-y-0.5"
              >
                <Play size={14} strokeWidth={1.75} />
                {currentStep < 0 ? 'Run Simulation' : 'Run Again'}
              </button>
            )}
            {currentStep >= 0 && !running && (
              <button
                type="button"
                onClick={handleReset}
                aria-label="Reset simulation"
                className="inline-flex items-center justify-center rounded-full border border-line px-3 py-2.5 text-ash transition-colors hover:border-periwinkle hover:text-text"
              >
                <RotateCcw size={14} strokeWidth={1.75} />
              </button>
            )}
          </div>
        </div>

        {/* Node flow */}
        <div className="relative mt-8">
          <div className="absolute left-0 right-0 top-5 hidden h-[2px] bg-line sm:block" />
          <motion.div
            className="absolute left-0 top-5 hidden h-[2px] bg-periwinkle sm:block"
            animate={{ width: `${progressPercent}%` }}
            transition={reduceMotion ? { duration: 0 } : { duration: STEP_DURATION_MS / 1000, ease: 'linear' }}
          />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-5 sm:gap-3">
            {steps.map((step, i) => {
              const reached = i <= currentStep;
              const active = i === currentStep && running;
              return (
                <div key={step.title} className="relative flex flex-col items-center gap-2 text-center">
                  <motion.div
                    className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 font-mono text-[12px] transition-colors ${
                      reached
                        ? 'border-periwinkle bg-periwinkle text-void-deep'
                        : 'border-line bg-void-deep text-ash-dim'
                    }`}
                    animate={active && !reduceMotion ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                    transition={{ duration: 0.9, repeat: active && !reduceMotion ? Infinity : 0 }}
                  >
                    {reached ? <CheckCircle2 size={18} strokeWidth={2} /> : i + 1}
                  </motion.div>
                  <p className={`text-[12.5px] font-medium leading-tight ${reached ? 'text-text' : 'text-ash-dim'}`}>
                    {step.title}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live status readout */}
        <div className="mt-8 rounded-xl border border-line bg-void-deep/60 p-4 sm:p-5">
          <div className="mb-2 flex items-center gap-2">
            <Zap size={14} color="var(--periwinkle)" strokeWidth={1.75} />
            <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ash-dim">
              {isComplete ? 'Simulation Complete' : running ? `Step ${currentStep + 1} of ${steps.length}` : 'Ready'}
            </span>
          </div>

          {currentStep < 0 && !running && (
            <p className="text-[14px] leading-relaxed text-ash">
              Press Run Simulation to step through exactly how this workflow processes a real trigger, node by node.
            </p>
          )}

          {currentStep >= 0 && (
            <div>
              <h4 className="font-display text-[15px] font-semibold text-text">{steps[currentStep].title}</h4>
              <p className="mt-1 text-[14px] leading-relaxed text-ash">{steps[currentStep].body}</p>
            </div>
          )}

          {isComplete && (
            <p className="mt-4 border-t border-line pt-4 text-[14px] font-medium text-text">{project.outcome}</p>
          )}
        </div>
      </div>
    </div>
  );
}
