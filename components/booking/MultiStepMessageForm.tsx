'use client';

import { useState } from 'react';

const TOTAL_STEPS = 3;

const SERVICE_OPTIONS = [
  { id: 'automation', label: 'automation' },
  { id: 'ai-chatbot', label: 'ai chatbot' },
  { id: 'website', label: 'website' },
  { id: 'not-sure', label: 'not sure' },
];

interface StepOneData {
  name: string;
  email: string;
  company: string;
  website: string;
  service: string | null;
}

const INITIAL_STEP_ONE: StepOneData = {
  name: '',
  email: '',
  company: '',
  website: '',
  service: null,
};

export function MultiStepMessageForm() {
  const [step, setStep] = useState(1);
  const [stepOne, setStepOne] = useState<StepOneData>(INITIAL_STEP_ONE);

  function updateStepOne<K extends keyof StepOneData>(key: K, value: StepOneData[K]) {
    setStepOne((prev) => ({ ...prev, [key]: value }));
  }

  function goNext() {
    setStep((s) => Math.min(TOTAL_STEPS, s + 1));
  }

  function goBack() {
    setStep((s) => Math.max(1, s - 1));
  }

  return (
    <div data-component="multi-step-message-form" className="flex w-full flex-col gap-5">
      <div className="flex items-center justify-between">
        <span data-role="section-label">or send a message</span>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1" data-role="step-dots">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => (
              <span
                key={i}
                data-role="step-dot"
                data-state={i + 1 === step ? 'active' : 'inactive'}
                className="block h-1.5 w-1.5 rounded-full"
              />
            ))}
          </div>
          <span data-role="step-text">
            step {step} of {TOTAL_STEPS}
          </span>
        </div>
      </div>

      {step === 1 && (
        <div data-role="step-panel" data-step="1" className="flex flex-col gap-4">
          <span data-role="sub-heading">about you</span>

          <div className="flex flex-col gap-3">
            <input
              type="text"
              value={stepOne.name}
              onChange={(e) => updateStepOne('name', e.target.value)}
              placeholder="name"
              data-field="name"
              className="w-full"
            />
            <input
              type="email"
              value={stepOne.email}
              onChange={(e) => updateStepOne('email', e.target.value)}
              placeholder="email"
              data-field="email"
              className="w-full"
            />
            <input
              type="text"
              value={stepOne.company}
              onChange={(e) => updateStepOne('company', e.target.value)}
              placeholder="company (optional)"
              data-field="company"
              className="w-full"
            />
            <input
              type="text"
              value={stepOne.website}
              onChange={(e) => updateStepOne('website', e.target.value)}
              placeholder="website (optional)"
              data-field="website"
              className="w-full"
            />
          </div>

          <span data-role="field-label">which service are you interested in?</span>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Which service are you interested in?">
            {SERVICE_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                data-role="service-option"
                data-state={stepOne.service === option.id ? 'selected' : 'default'}
                aria-pressed={stepOne.service === option.id}
                onClick={() => updateStepOne('service', option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>

          <button type="button" onClick={goNext} data-role="next-button" className="self-start">
            next &rarr;
          </button>
        </div>
      )}

      {step === 2 && (
        <div data-role="step-panel" data-step="2" className="flex flex-col gap-4">
          <p data-role="placeholder-note">Step 2 content goes here.</p>
          <div className="flex gap-2">
            <button type="button" onClick={goBack} data-role="back-button">
              back
            </button>
            <button type="button" onClick={goNext} data-role="next-button">
              next &rarr;
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div data-role="step-panel" data-step="3" className="flex flex-col gap-4">
          <p data-role="placeholder-note">Step 3 content goes here.</p>
          <div className="flex gap-2">
            <button type="button" onClick={goBack} data-role="back-button">
              back
            </button>
            <button type="button" data-role="submit-button">
              submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
