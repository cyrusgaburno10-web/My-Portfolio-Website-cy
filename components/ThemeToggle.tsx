'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/lib/use-theme';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line text-ash transition-all hover:border-periwinkle hover:text-periwinkle hover:shadow-[0_0_16px_-6px_var(--periwinkle)] active:scale-[0.94]"
    >
      {isDark ? <Sun size={16} strokeWidth={1.5} /> : <Moon size={16} strokeWidth={1.5} />}
    </button>
  );
}
