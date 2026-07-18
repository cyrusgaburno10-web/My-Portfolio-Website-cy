'use client';

import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { UIMessage } from 'ai';
import { linkifyContacts } from '@/lib/linkify-contacts';
import { ProjectMiniList } from './ProjectCard';

const markdownComponents: Components = {
  p: ({ children }) => <p className="mb-2 last:mb-0">{linkifyContacts(children, 'p')}</p>,
  li: ({ children }) => <li>{linkifyContacts(children, 'li')}</li>,
  strong: ({ children }) => <strong className="font-semibold text-text">{children}</strong>,
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noreferrer" className="text-periwinkle underline underline-offset-2 hover:text-sky">
      {children}
    </a>
  ),
  ul: ({ children }) => <ul className="mb-2 ml-4 list-disc space-y-1 last:mb-0">{children}</ul>,
  ol: ({ children }) => <ol className="mb-2 ml-4 list-decimal space-y-1 last:mb-0">{children}</ol>,
  code: ({ className, children, ...props }) => {
    const isBlock = Boolean(className);
    if (isBlock) {
      return (
        <code className={`font-mono text-[0.85em] leading-relaxed ${className ?? ''}`} {...props}>
          {children}
        </code>
      );
    }
    return (
      <code className="rounded bg-void-deep/80 px-1 py-0.5 font-mono text-[0.9em] text-sky" {...props}>
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="mb-2 overflow-x-auto rounded-lg border border-line bg-void-deep p-3 text-sky last:mb-0">
      {children}
    </pre>
  ),
};

export function MessageBubble({ message }: { message: UIMessage }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full ${isUser ? 'justify-start' : 'justify-end'}`}>
      <div className={`flex max-w-[85%] flex-col gap-3 sm:max-w-[75%] ${isUser ? 'items-start' : 'items-end'}`}>
        {message.parts.map((part, i) => {
          if (part.type === 'text') {
            return (
              <div
                key={i}
                className={
                  isUser
                    ? 'rounded-2xl rounded-tl-sm bg-void-deep/50 px-4 py-3 text-[15px] leading-relaxed text-text'
                    : 'rounded-2xl rounded-tr-sm border border-periwinkle/30 bg-void-deep/60 px-4 py-3 text-[15px] leading-relaxed text-text shadow-[0_0_24px_-8px_var(--periwinkle)]'
                }
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                  {part.text}
                </ReactMarkdown>
              </div>
            );
          }
          if (part.type === 'tool-showProjects') {
            return (
              <div key={i} className="w-full">
                <ProjectMiniList />
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}
