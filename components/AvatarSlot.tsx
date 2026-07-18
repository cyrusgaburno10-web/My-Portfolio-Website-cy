'use client';

import { ArrowRight, Clock, Folder, GitBranch, Mail, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { round3, seededRandom } from '@/lib/portal-math';
import type { PortalPhase } from './PortalBackground';

const NODE_ICONS = [Folder, Mail, Sparkles, GitBranch, Clock, ArrowRight];

const NODES = NODE_ICONS.map((Icon, i) => ({
  Icon,
  angle: (360 / NODE_ICONS.length) * i + seededRandom(i) * 18,
  radius: 58 + seededRandom(i + 10) * 22,
  duration: 13 + seededRandom(i + 20) * 7,
  delay: seededRandom(i + 30) * 4,
  drift: (i % 3) + 1,
}));

interface AvatarSlotProps {
  phase: PortalPhase;
  size?: 'lg' | 'sm';
}

export function AvatarSlot({ phase, size = 'lg' }: AvatarSlotProps) {
  const active = phase !== 'idle';
  const speed = phase === 'streaming' ? 0.55 : phase === 'thinking' ? 0.75 : 1;
  const dimension = size === 'lg' ? 'h-40 w-40 sm:h-48 sm:w-48' : 'h-20 w-20';

  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`relative mx-auto flex shrink-0 items-center justify-center ${dimension}`}
    >
      <div
        className="absolute inset-0 rounded-full blur-2xl transition-opacity duration-700"
        style={{
          background: 'radial-gradient(circle, var(--white-fleck) 0%, var(--indigo) 55%, transparent 75%)',
          opacity: active ? 0.9 : 0.6,
        }}
      />
      <div
        className="avatar-glow-pulse absolute inset-6 rounded-full sm:inset-8"
        style={{
          background:
            'radial-gradient(circle, color-mix(in srgb, var(--white-fleck) 70%, transparent) 0%, transparent 70%)',
          animation: `portal-core-pulse ${active ? 2.1 : 4.5}s ease-in-out infinite`,
        }}
      />
      {size === 'lg' &&
        NODES.map(({ Icon, angle, radius, duration, delay, drift }, i) => {
          const rad = (angle * Math.PI) / 180;
          const x = round3(Math.cos(rad) * radius);
          const y = round3(Math.sin(rad) * radius);
          return (
            <div
              key={i}
              className="avatar-node-drift absolute flex h-7 w-7 items-center justify-center rounded-md border border-line bg-void-deep/70"
              style={{
                left: `calc(50% + ${x}px - 14px)`,
                top: `calc(50% + ${y}px - 14px)`,
                animation: `node-drift-${drift} ${duration * speed}s ease-in-out ${delay}s infinite`,
                opacity: active ? 0.95 : 0.75,
              }}
            >
              <Icon size={14} color="var(--periwinkle)" strokeWidth={1.5} />
            </div>
          );
        })}
    </motion.div>
  );
}
