import { useId } from 'react';
import Image from 'next/image';
import type { LucideIcon } from 'lucide-react';

interface AvatarProps {
  src: string;
  alt: string;
  /** 'lg' (~200-300px, hero/about) shows the frequency-ring hollows with icons circling them. 'sm' (~40-48px, nav/chat scale) simplifies to a glow and gradient border only. */
  tier?: 'sm' | 'lg';
  priority?: boolean;
  className?: string;
  /** Icons distributed across 3 circling rings around the photo. Falls back to a plain glowing node per ring if omitted. */
  orbitIcons?: LucideIcon[];
}

const ICON_RINGS = [
  { radius: 34, duration: '14s', direction: 'normal' as const },
  { radius: 42, duration: '19s', direction: 'reverse' as const },
  { radius: 49, duration: '24s', direction: 'normal' as const },
];

/** Builds a closed ring path with radius modulated by overlapping sine waves, so it reads as a frequency/waveform hollow. */
function buildFrequencyRingPath(baseRadius: number, harmonics: [number, number, number]) {
  const steps = 140;
  const points: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const theta = (i / steps) * Math.PI * 2;
    const r =
      baseRadius +
      1.3 * Math.sin(theta * harmonics[0] + 0.6) +
      0.8 * Math.sin(theta * harmonics[1] + 2.1) +
      1.6 * Math.sin(theta * harmonics[2] + 1.2);
    const x = (50 + r * Math.cos(theta)).toFixed(2);
    const y = (50 + r * Math.sin(theta)).toFixed(2);
    points.push(`${i === 0 ? 'M' : 'L'} ${x} ${y}`);
  }
  return `${points.join(' ')} Z`;
}

const FREQUENCY_RINGS = [
  { path: buildFrequencyRingPath(33, [9, 17, 4]), duration: '40s', direction: 'normal' as const },
  { path: buildFrequencyRingPath(39, [6, 14, 3]), duration: '46s', direction: 'reverse' as const },
  { path: buildFrequencyRingPath(45, [11, 5, 19]), duration: '52s', direction: 'normal' as const },
];

export function Avatar({ src, alt, tier = 'lg', priority, className = '', orbitIcons }: AvatarProps) {
  const isLarge = tier === 'lg';
  const uid = useId();
  const glowFilterId = `avatar-glow-${uid}`;
  const freqGradientId = `avatar-freq-${uid}`;

  const iconsByRing: LucideIcon[][] = [[], [], []];
  orbitIcons?.forEach((Icon, i) => {
    iconsByRing[i % ICON_RINGS.length].push(Icon);
  });

  return (
    <div className={`relative aspect-square w-full ${className}`}>
      <div
        className="hero-avatar-glow-pulse absolute inset-0 rounded-full"
        style={{
          background: isLarge
            ? 'radial-gradient(circle, color-mix(in srgb, var(--periwinkle) 40%, transparent) 0%, color-mix(in srgb, var(--indigo) 60%, transparent) 45%, transparent 75%)'
            : 'radial-gradient(circle, var(--white-fleck) 0%, var(--indigo) 55%, transparent 75%)',
          opacity: isLarge ? 0.55 : 0.35,
          filter: isLarge ? 'blur(30px)' : 'blur(8px)',
        }}
      />

      {isLarge && (
        <>
          <svg width="0" height="0" aria-hidden="true">
            <defs>
              <filter id={glowFilterId} x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient id={freqGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--indigo)" />
                <stop offset="50%" stopColor="var(--periwinkle)" />
                <stop offset="100%" stopColor="var(--sky)" />
              </linearGradient>
            </defs>
          </svg>

          {/* Frequency hollows: 3 waveform rings at different radii, each slowly spinning at its own speed */}
          {FREQUENCY_RINGS.map((ring, i) => (
            <svg
              key={i}
              className="hero-avatar-ring-spin absolute inset-0 h-full w-full overflow-visible"
              viewBox="0 0 100 100"
              style={{ animationDuration: ring.duration, animationDirection: ring.direction }}
              aria-hidden="true"
            >
              <path
                d={ring.path}
                fill="none"
                stroke={`url(#${freqGradientId})`}
                strokeOpacity="0.75"
                strokeWidth="0.8"
                strokeLinejoin="round"
                filter={`url(#${glowFilterId})`}
              />
            </svg>
          ))}

          {/* Icon rings: each spins independently, carrying its icons in a circular path around the static guides */}
          {ICON_RINGS.map((ring, i) => {
            const icons = iconsByRing[i];
            return (
              <svg
                key={i}
                className="hero-avatar-ring-spin absolute inset-0 h-full w-full overflow-visible"
                viewBox="0 0 100 100"
                style={{ animationDuration: ring.duration, animationDirection: ring.direction }}
                aria-hidden="true"
              >
                {icons.length > 0 ? (
                  icons.map((Icon, idx) => {
                    const angle = (360 / icons.length) * idx;
                    const rad = (angle * Math.PI) / 180;
                    const cx = 50 + ring.radius * Math.cos(rad);
                    const cy = 50 + ring.radius * Math.sin(rad);
                    const s = 11;
                    return (
                      <foreignObject key={idx} x={cx - s / 2} y={cy - s / 2} width={s} height={s} style={{ overflow: 'visible' }}>
                        <div className="flex h-full w-full items-center justify-center rounded-full border border-line bg-void-deep/85 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.3)] backdrop-blur-sm">
                          <Icon size={14} color="var(--periwinkle)" strokeWidth={1.5} />
                        </div>
                      </foreignObject>
                    );
                  })
                ) : (
                  <circle cx={50 + ring.radius} cy="50" r="2.3" fill="var(--periwinkle)" filter={`url(#${glowFilterId})`} />
                )}
              </svg>
            );
          })}
        </>
      )}

      <div
        className="absolute rounded-full"
        style={{
          inset: isLarge ? '18%' : '4%',
          padding: isLarge ? 2 : 1.5,
          background: 'linear-gradient(135deg, var(--indigo), var(--periwinkle), var(--sky))',
        }}
      >
        <div
          className={`relative h-full w-full overflow-hidden rounded-full border border-void bg-void-deep ${
            isLarge ? 'shadow-[0_20px_60px_-20px_var(--indigo)]' : ''
          }`}
        >
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            className="object-cover object-top"
            sizes={isLarge ? '(min-width: 1280px) 262px, (min-width: 640px) 236px, 197px' : '48px'}
          />
        </div>
      </div>
    </div>
  );
}
