'use client';

const SUGGESTIONS = ['Show me your best projects', 'What tools do you use?', 'How can we collaborate?', 'Tell me a fun fact'];

interface SuggestionChipsProps {
  onSelect: (text: string) => void;
  disabled: boolean;
}

export function SuggestionChips({ onSelect, disabled }: SuggestionChipsProps) {
  return (
    <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-center">
      {SUGGESTIONS.map((s) => (
        <button
          key={s}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(s)}
          className="rounded-full border border-line px-4 py-2 text-left font-mono text-[12px] text-ash transition-colors hover:border-periwinkle hover:text-text disabled:opacity-40 sm:text-center"
        >
          {s}
        </button>
      ))}
    </div>
  );
}
