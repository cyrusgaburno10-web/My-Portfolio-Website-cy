'use client';

import { useChat } from '@ai-sdk/react';
import { MessageCircle } from 'lucide-react';
import { useMemo, useState } from 'react';
import { PortalBackground, type PortalPhase } from '@/components/PortalBackground';
import { useTheme } from '@/lib/use-theme';
import { ChatSidebar } from './ChatSidebar';
import { Footer } from './Footer';
import { Header } from './Header';

const ENGAGEMENT_CEILING = 12;

export function AppShell({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const { messages, sendMessage, status, error } = useChat();
  const [input, setInput] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const busy = status === 'submitted' || status === 'streaming';
  const engagement = useMemo(() => Math.min(1, messages.length / ENGAGEMENT_CEILING), [messages.length]);
  const phase: PortalPhase = status === 'submitted' ? 'thinking' : status === 'streaming' ? 'streaming' : 'idle';

  function handleSend(text: string) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    sendMessage({ text: trimmed });
    setInput('');
    setMobileOpen(true);
  }

  return (
    <>
      <PortalBackground engagement={engagement} phase={phase} theme={theme} />

      <div className="relative z-0 flex min-h-[100dvh] flex-col lg:flex-row">
        <div className="flex min-w-0 flex-1 flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>

        <ChatSidebar
          messages={messages}
          input={input}
          onInputChange={setInput}
          onSend={handleSend}
          busy={busy}
          phase={phase}
          error={error}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
          collapsed={collapsed}
          onToggleCollapsed={() => setCollapsed((v) => !v)}
        />
      </div>

      {!mobileOpen && (
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open chat with Cyrus's AI"
          className="fixed bottom-5 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-indigo text-white-fleck shadow-[0_8px_30px_-6px_var(--indigo)] transition-transform hover:-translate-y-0.5 active:scale-95 lg:hidden"
        >
          <MessageCircle size={22} strokeWidth={1.5} />
        </button>
      )}
    </>
  );
}
