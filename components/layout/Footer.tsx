import Image from 'next/image';
import { FooterLegalTrigger } from '@/components/FooterLegalTrigger';
import { VisitorCounter } from '@/components/VisitorCounter';

const QUICK_LINKS = [
  { id: 'process', label: 'Home' },
  { id: 'services', label: 'Services' },
  { id: 'tools', label: 'Tools' },
  { id: 'projects', label: 'Projects' },
  { id: 'simulation', label: 'Simulation' },
  { id: 'credentials', label: 'Credentials' },
  { id: 'contact', label: 'Contact' },
  { id: 'book-a-call', label: 'Book a Call' },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer>
      <div className="pulse-divider" aria-hidden="true" />
      <div className="mx-auto w-full max-w-4xl px-5 pb-24 pt-12 sm:px-8 sm:pt-16 lg:pb-16">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
          <div className="max-w-xs">
            <a href="#process" className="inline-flex items-center" aria-label="Cyrus Gaburno, home">
              <Image
                src="/logo.png"
                alt="Cyrus Gaburno"
                width={926}
                height={386}
                className="h-9 w-auto rounded-lg border border-line"
              />
            </a>
            <p className="mt-4 text-[13px] leading-relaxed text-ash">
              AI Automation Specialist helping businesses eliminate manual work with reliable, well-documented
              workflows.
            </p>
          </div>

          <div>
            <p className="mb-3 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ash-dim">Quick Links</p>
            <nav className="grid grid-cols-2 gap-x-8 gap-y-2 sm:grid-cols-1">
              {QUICK_LINKS.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  className="text-[14px] text-ash transition-colors hover:text-text"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-10 flex flex-col-reverse items-center gap-4 border-t border-line pt-6 sm:flex-row sm:justify-between">
          <div className="flex flex-col items-center gap-1.5 sm:items-start">
            <p className="text-[12px] text-ash-dim">&copy; {year} Cyrus Gaburno. All rights reserved.</p>
            <VisitorCounter />
          </div>
          <FooterLegalTrigger />
        </div>
      </div>
    </footer>
  );
}
