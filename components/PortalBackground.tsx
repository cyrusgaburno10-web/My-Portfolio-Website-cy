'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import {
  Bot,
  Boxes,
  Cpu,
  Database,
  Folder,
  GitBranch,
  Link2,
  Mail,
  MessageSquare,
  Network,
  Server,
  Terminal,
  Waypoints,
  Webhook,
  Workflow,
  Zap,
} from 'lucide-react';
import { lerp, round3, seededRandom } from '@/lib/portal-math';
import type { Theme } from '@/lib/use-theme';

export type PortalPhase = 'idle' | 'thinking' | 'streaming';

interface PortalBackgroundProps {
  engagement: number;
  phase: PortalPhase;
  theme: Theme;
}

interface Palette {
  head: string;
  fade1: string;
  fade2: string;
  fade3: string;
  opacityScale: number;
}

const PALETTES: Record<Theme, Palette> = {
  dark: { head: '#F5F7FF', fade1: '#91C1DE', fade2: '#7882E3', fade3: '#624CDA', opacityScale: 1 },
  light: { head: '#14162B', fade1: '#5FA0C9', fade2: '#6C77D6', fade3: '#5540C4', opacityScale: 0.6 },
};

const ICON_POOL = [
  Workflow,
  GitBranch,
  Webhook,
  Database,
  Mail,
  Folder,
  Zap,
  Network,
  Boxes,
  Bot,
  Cpu,
  Terminal,
  Link2,
  Server,
  MessageSquare,
  Waypoints,
];

const COLUMN_COUNT = 18;
const TRAIL_LENGTH = 5;
const CELL_HEIGHT = 60;
const SLOT_OPACITY = [1, 0.72, 0.48, 0.28, 0.12];

interface ColumnSpec {
  cells: ((typeof ICON_POOL)[number] | null)[];
  slotCount: number;
  duration: number;
  delay: number;
  xPercent: number;
}

function buildColumn(index: number): ColumnSpec {
  // Gap count is padded so slotCount * CELL_HEIGHT comfortably exceeds any
  // real viewport height, keeping the 2-copy / -50% loop below seamless
  // regardless of how tall the browser window is.
  const gapCount = 10 + Math.floor(seededRandom(index + 500) * 6);
  const slotCount = TRAIL_LENGTH + gapCount;
  const cells = Array.from({ length: slotCount }, (_, slot) => {
    if (slot >= TRAIL_LENGTH) return null;
    const iconIdx = Math.floor(seededRandom(index * 97 + slot * 13) * ICON_POOL.length);
    return ICON_POOL[iconIdx];
  });
  const duration = round3(9 + seededRandom(index + 200) * 10);
  const delay = round3(-seededRandom(index + 300) * duration);
  const spacing = 100 / COLUMN_COUNT;
  const jitter = round3((seededRandom(index + 400) - 0.5) * spacing * 0.5);
  const xPercent = round3((index + 0.5) * spacing + jitter);
  return { cells, slotCount, duration, delay, xPercent };
}

export function PortalBackground({ engagement, phase, theme }: PortalBackgroundProps) {
  const reduceMotion = useReducedMotion();
  const palette = PALETTES[theme];

  const columns = useMemo(() => Array.from({ length: COLUMN_COUNT }, (_, i) => buildColumn(i)), []);

  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const rippleId = useRef(0);

  useEffect(() => {
    if (reduceMotion) return;
    function handleClick(e: MouseEvent) {
      const id = rippleId.current++;
      setRipples((prev) => [...prev.slice(-4), { id, x: e.clientX, y: e.clientY }]);
      window.setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 1100);
    }
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [reduceMotion]);

  const thinking = phase === 'thinking';
  const streaming = phase === 'streaming';
  const speedBoost = streaming ? 0.55 : thinking ? 0.7 : 1;
  const engagementSpeed = lerp(1.15, 0.6, engagement);
  const opacityScale = palette.opacityScale * lerp(0.45, 1, engagement);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-void">
      <div
        className={`rain-field-mask absolute inset-0 ${thinking ? 'rain-thinking-flicker' : ''}`}
        style={{
          opacity: opacityScale,
          animation: thinking ? 'portal-thinking-flicker 1.1s ease-in-out infinite' : undefined,
        }}
      >
        {columns.map((col, i) => {
          const finalDuration = col.duration * speedBoost * engagementSpeed;
          const unitHeight = col.slotCount * CELL_HEIGHT;
          return (
            <div key={i} className="absolute inset-y-0" style={{ left: `${col.xPercent}%`, width: 28 }}>
              <div
                className="rain-column-strip absolute inset-x-0 top-0"
                style={{
                  height: unitHeight * 2,
                  animation: `rain-fall ${finalDuration}s linear ${col.delay}s infinite`,
                }}
              >
                {[0, 1].flatMap((copy) =>
                  col.cells.map((Icon, slot) => (
                    <div
                      key={`${copy}-${slot}`}
                      className="flex items-center justify-center"
                      style={{ height: CELL_HEIGHT }}
                    >
                      {Icon && (
                        <Icon
                          size={16}
                          strokeWidth={1.5}
                          color={
                            slot === 0
                              ? palette.head
                              : slot === 1
                                ? palette.fade1
                                : slot === 2
                                  ? palette.fade2
                                  : palette.fade3
                          }
                          style={{
                            opacity: SLOT_OPACITY[slot],
                            filter: slot === 0 ? `drop-shadow(0 0 6px ${palette.fade2})` : undefined,
                          }}
                        />
                      )}
                    </div>
                  )),
                )}
              </div>
            </div>
          );
        })}
      </div>

      {!reduceMotion &&
        ripples.map((r) => (
          <span key={r.id} className="portal-ripple" style={{ left: r.x, top: r.y, borderColor: palette.fade2 }} />
        ))}
    </div>
  );
}
