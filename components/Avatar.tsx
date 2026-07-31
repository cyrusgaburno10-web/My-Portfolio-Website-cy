import { useId } from 'react';
import Image from 'next/image';
import type { LucideIcon } from 'lucide-react';

interface AvatarProps {
  src: string;
  alt: string;
  /** 'lg' (~200-300px, hero/about) shows the tilted orbit rings. 'sm' (~40-48px, nav/chat scale) simplifies to a glow and gradient border only. */
  tier?: 'sm' | 'lg';
  priority?: boolean;
  className?: string;
  /** Icons distributed across the 3 orbit rings, riding their rim as they spin. Falls back to a plain glowing node per ring if omitted. */
  orbitIcons?: LucideIcon[];
}

const ORBITS = [
  { tilt: 18, rx: 48, ry: 24, duration: '22s', direction: 'normal' as const, color: 'var(--indigo)' },
  { tilt: -32, rx: 47, ry: 27, duration: '28s', direction: 'reverse' as const, color: 'var(--periwinkle)' },
  { tilt: 82, rx: 46, ry: 22, duration: '34s', direction: 'normal' as const, color: 'var(--sky)' },
];

export function Avatar({ src, alt, tier = 'lg', priority, className = '', orbitIcons }: AvatarProps) {
  const isLarge = tier === 'lg';
  const uid = useId();
  const glowFilterId = `avatar-glow-${uid}`;

  const iconsByOrbit: LucideIcon[][] = [[], [], []];
  orbitIcons?.forEach((Icon, i) => {
    iconsByOrbit[i % ORBITS.length].push(Icon);
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
            </defs>
          </svg>

          {/* Orbit rings: tilted ellipses, each spinning at its own speed, carrying either tool-icon nodes or a plain glowing node on its rim */}
          {ORBITS.map((orbit, i) => {
            const icons = iconsByOrbit[i];
            const angleOffset = i * 25;
            return (
              <svg
                key={i}
                className="hero-avatar-ring-spin absolute inset-0 h-full w-full overflow-visible"
                viewBox="0 0 100 100"
                style={{ animationDuration: orbit.duration, animationDirection: orbit.direction }}
                aria-hidden="true"
              >
                <ellipse
                  cx="50"
                  cy="50"
                  rx={orbit.rx}
                  ry={orbit.ry}
                  transform={`rotate(${orbit.tilt} 50 50)`}
                  fill="none"
                  stroke={orbit.color}
                  strokeOpacity="0.5"
                  strokeWidth="0.8"
                  filter={`url(#${glowFilterId})`}
                />
                <g transform={`rotate(${orbit.tilt} 50 50)`}>
                  {icons.length > 0 ? (
                    icons.map((Icon, idx) => {
                      const angle = (360 / icons.length) * idx + angleOffset;
                      const rad = (angle * Math.PI) / 180;
                      const cx = 50 + orbit.rx * Math.cos(rad);
                      const cy = 50 + orbit.ry * Math.sin(rad);
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
                    <circle cx={50 + orbit.rx} cy="50" r="2.3" fill={orbit.color} filter={`url(#${glowFilterId})`} />
                  )}
                </g>
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
