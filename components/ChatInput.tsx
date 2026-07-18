'use client';

import { ArrowUp, Loader2 } from 'lucide-react';
import { useEffect, useRef, type FormEvent, type KeyboardEvent } from 'react';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled: boolean;
  isStreaming: boolean;
}

export function ChatInput({ value, onChange, onSubmit, disabled, isStreaming }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (value === '' && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [value]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!value.trim() || disabled) return;
    onSubmit();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !disabled) onSubmit();
    }
  }

  function handleInput(e: FormEvent<HTMLTextAreaElement>) {
    const el = e.currentTarget;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        rows={1}
        placeholder="Ask me anything about my projects, skills, experience, or how I can automate your business…"
        disabled={disabled}
        className="w-full resize-none rounded-2xl border border-line bg-void-deep/60 py-4 pl-5 pr-14 text-[15px] leading-relaxed text-text placeholder:text-ash-dim outline-none backdrop-blur-md transition-colors focus:border-periwinkle disabled:opacity-60"
        style={{ maxHeight: '160px' }}
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        aria-label={isStreaming ? 'Generating reply' : 'Send message'}
        className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-indigo text-white-fleck transition-all enabled:hover:-translate-y-0.5 enabled:hover:shadow-[0_0_20px_-4px_var(--periwinkle)] disabled:cursor-not-allowed disabled:opacity-40 enabled:active:scale-[0.96]"
      >
        {isStreaming ? (
          <Loader2 size={16} className="animate-spin" strokeWidth={1.5} />
        ) : (
          <ArrowUp size={16} strokeWidth={1.5} />
        )}
      </button>
    </form>
  );
}
