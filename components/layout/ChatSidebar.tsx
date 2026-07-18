'use client';

import type { UIMessage } from 'ai';
import { ChevronsRight, MessageCircle, X } from 'lucide-react';
import { AvatarSlot } from '@/components/AvatarSlot';
import { ChatInput } from '@/components/ChatInput';
import { MessageBubble } from '@/components/MessageBubble';
import type { PortalPhase } from '@/components/PortalBackground';
import { SuggestionChips } from '@/components/SuggestionChips';

export const SIDEBAR_WIDTH = 400;

interface ChatSidebarProps {
  messages: UIMessage[];
  input: string;
  onInputChange: (value: string) => void;
  onSend: (text: string) => void;
  busy: boolean;
  phase: PortalPhase;
  error?: Error;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  collapsed: boolean;
  onToggleCollapsed: () => void;
}

function ChatPanelContent({
  messages,
  input,
  onInputChange,
  onSend,
  busy,
  phase,
  error,
}: Pick<ChatSidebarProps, 'messages' | 'input' | 'onInputChange' | 'onSend' | 'busy' | 'phase' | 'error'>) {
  const started = messages.length > 0;

  return (
    <>
      {!started ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-5 overflow-y-auto px-5 py-8 text-center">
          <AvatarSlot phase={phase} size="sm" />
          <div className="space-y-1.5">
            <h2 className="font-display text-xl font-semibold text-text">Hey, I&rsquo;m Cyrus&rsquo;s AI 👋</h2>
            <p className="text-[13px] leading-relaxed text-ash">
              Ask about projects, tools, or how I can automate your business.
            </p>
          </div>
          <SuggestionChips onSelect={onSend} disabled={busy} />
        </div>
      ) : (
        <div className="chat-scroll flex flex-1 flex-col gap-4 overflow-y-auto px-5 py-5">
          {messages.map((m) => (
            <MessageBubble key={m.id} message={m} />
          ))}
        </div>
      )}

      <div className="border-t border-line p-4">
        {error && (
          <div className="mb-3 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-[12px] text-rose-300">
            Something went wrong reaching the AI provider. {error.message || 'Please try again.'}
          </div>
        )}
        <ChatInput
          value={input}
          onChange={onInputChange}
          onSubmit={() => onSend(input)}
          disabled={busy}
          isStreaming={busy}
        />
      </div>
    </>
  );
}

export function ChatSidebar(props: ChatSidebarProps) {
  const { mobileOpen, onCloseMobile, collapsed, onToggleCollapsed } = props;

  return (
    <>
      {/* Mobile: full-screen drawer, independent of desktop collapsed state */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-void-deep/70 backdrop-blur-sm lg:hidden" onClick={onCloseMobile} aria-hidden="true" />
      )}
      <aside
        style={{ width: SIDEBAR_WIDTH }}
        className={`fixed inset-y-0 right-0 z-40 flex max-w-full flex-col border-l border-line bg-void/95 backdrop-blur-xl transition-transform duration-300 lg:hidden ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ash-dim">Ask Cyrus&rsquo;s AI</span>
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close chat"
            className="flex h-8 w-8 items-center justify-center rounded-full text-ash-dim transition-colors hover:text-text"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>
        <ChatPanelContent {...props} />
      </aside>

      {/* Desktop: sticky in-flow sidebar, always present, collapsible to an icon rail */}
      {collapsed ? (
        <div className="sticky top-0 z-10 hidden h-[100dvh] w-14 shrink-0 flex-col items-center border-l border-line bg-void/85 py-4 backdrop-blur-md lg:flex">
          <button
            type="button"
            onClick={onToggleCollapsed}
            aria-label="Expand chat with Cyrus's AI"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ash transition-colors hover:border-periwinkle hover:text-periwinkle"
          >
            <MessageCircle size={16} strokeWidth={1.5} />
          </button>
        </div>
      ) : (
        <aside
          style={{ width: SIDEBAR_WIDTH }}
          className="sticky top-0 z-10 hidden h-[100dvh] shrink-0 flex-col border-l border-line bg-void/95 backdrop-blur-xl lg:flex"
        >
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ash-dim">Ask Cyrus&rsquo;s AI</span>
            <button
              type="button"
              onClick={onToggleCollapsed}
              aria-label="Collapse chat"
              className="flex h-8 w-8 items-center justify-center rounded-full text-ash-dim transition-colors hover:text-text"
            >
              <ChevronsRight size={16} strokeWidth={1.5} />
            </button>
          </div>
          <ChatPanelContent {...props} />
        </aside>
      )}
    </>
  );
}
