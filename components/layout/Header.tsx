'use client';

import Image from 'next/image';
import { Handshake } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useActiveSection } from '@/lib/use-active-section';

const NAV_ITEMS = [
  { id: 'services', label: 'Services' },
  { id: 'tools', label: 'Tools' },
  { id: 'projects', label: 'Projects' },
  { id: 'credentials', label: 'Credentials' },
  { id: 'contact', label: 'Contact' },
];

const SECTION_IDS = NAV_ITEMS.map((item) => item.id);

function NavLinks({
  activeId,
  className,
  linkClassName,
}: {
  activeId: string;
  className: string;
  linkClassName: string;
}) {
  const refs = useRef<Record<string, HTMLAnchorElement | null>>({});

  useEffect(() => {
    refs.current[activeId]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [activeId]);

  return (
    <nav className={className}>
      {NAV_ITEMS.map((item) => {
        const active = activeId === item.id;
        return (
          <a
            key={item.id}
            ref={(el) => {
              refs.current[item.id] = el;
            }}
            href={`#${item.id}`}
            className={`whitespace-nowrap rounded-full font-mono uppercase transition-colors ${linkClassName} ${
              active ? 'bg-void-deep text-text' : 'text-ash hover:text-text'
            }`}
          >
            {item.label}
          </a>
        );
      })}
    </nav>
  );
}

export function Header() {
  const activeId = useActiveSection(SECTION_IDS);

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-void/85 backdrop-blur-md">
      <div className="grid h-16 grid-cols-[auto_1fr_auto] items-center gap-3 px-5 sm:px-8">
        <a href="#process" className="shrink-0 justify-self-start" aria-label="Cyrus Gaburno, home">
          <Image
            src="/logo.png"
            alt="Cyrus Gaburno"
            width={926}
            height={386}
            priority
            className="h-8 w-auto rounded-lg border border-line sm:h-9"
          />
        </a>

        <NavLinks
          activeId={activeId}
          className="hidden items-center justify-self-center gap-1 xl:flex"
          linkClassName="px-3 py-1.5 text-[11px] tracking-[0.13em]"
        />

        <div className="flex shrink-0 items-center justify-self-end gap-2 sm:gap-3">
          <a
            href="#book-a-call"
            className="inline-flex items-center gap-1.5 rounded-full bg-indigo px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-white-fleck transition-transform hover:-translate-y-0.5 active:scale-[0.97] sm:px-5"
          >
            <Handshake size={14} strokeWidth={1.75} />
            Hire Me
          </a>
          <ThemeToggle />
        </div>
      </div>

      <div className="border-t border-line px-5 py-2.5 sm:px-8 xl:hidden">
        <NavLinks
          activeId={activeId}
          className="nav-scroll flex items-center gap-1.5 overflow-x-auto"
          linkClassName="px-3 py-1.5 text-[11px] tracking-[0.13em] shrink-0"
        />
      </div>
    </header>
  );
}
