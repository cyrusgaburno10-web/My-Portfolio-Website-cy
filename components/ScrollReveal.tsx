'use client';

import { motion } from 'motion/react';

export function ScrollReveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  // Always render the animated version (never branch on useReducedMotion in
  // JS: the server can't know the client's media-query preference, and
  // branching there causes a real SSR/hydration mismatch). The
  // `prefers-reduced-motion` override in globals.css forces the final
  // visible state instead.
  return (
    <motion.div
      className={`scroll-reveal ${className || ''}`}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
