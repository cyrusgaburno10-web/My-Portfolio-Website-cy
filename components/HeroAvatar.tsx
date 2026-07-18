import { Bot, Brain, Database, Globe, Link2, Mic, Sparkles, Zap, type LucideIcon } from 'lucide-react';
import Image from 'next/image';
import { round3, seededRandom } from '@/lib/portal-math';

const NODE_ICONS: LucideIcon[] = [Sparkles, Mic, Bot, Link2, Zap, Brain, Database, Globe];

const NODES = NODE_ICONS.map((Icon, i) => ({
  Icon,
  angle: (360 / NODE_ICONS.length) * i - 90 + seededRandom(i) * 8,
  duration: 10 + seededRandom(i + 20) * 6,
  delay: seededRandom(i + 30) * 4,
  drift: (i % 3) + 1,
}));

const RADIUS_PERCENT = 40;

export function HeroAvatar() {
  return (
    <div className="relative flex aspect-square w-full max-w-[240px] items-center justify-center sm:max-w-[288px] lg:max-w-[320px] xl:max-w-[360px]">
      <div
        className="hero-avatar-glow-pulse absolute inset-0 rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(circle, var(--white-fleck) 0%, var(--indigo) 55%, transparent 75%)',
          opacity: 0.5,
          animation: 'portal-core-pulse 6s ease-in-out infinite',
        }}
      />

      <div className="absolute inset-0 rounded-full border border-periwinkle/20" />

      <div className="relative h-[64%] w-[64%] overflow-hidden rounded-full border-2 border-line shadow-[0_20px_60px_-20px_var(--indigo)]">
        <Image
          src="/avatar/cyrus-avatar.jpg"
          alt="Cyrus Gaburno"
          fill
          priority
          className="object-cover object-top"
          sizes="(min-width: 1280px) 205px, (min-width: 640px) 184px, 164px"
        />
      </div>

      <div
        role="status"
        aria-label="Currently online"
        className="absolute flex h-5 w-5 items-center justify-center"
        style={{ left: 'calc(50% + 22.6% - 10px)', top: 'calc(50% + 22.6% - 10px)' }}
      >
        <span className="absolute h-5 w-5 animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative h-5 w-5 rounded-full border-[3px] border-void bg-emerald-400" />
      </div>

      {NODES.map(({ Icon, angle, duration, delay, drift }, i) => {
        const rad = (angle * Math.PI) / 180;
        const xPct = round3(Math.cos(rad) * RADIUS_PERCENT);
        const yPct = round3(Math.sin(rad) * RADIUS_PERCENT);
        return (
          <div
            key={i}
            className="avatar-node-drift absolute flex h-9 w-9 items-center justify-center rounded-full border border-line bg-void-deep/85 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.3)] backdrop-blur-sm"
            style={{
              left: `calc(50% + ${xPct}% - 18px)`,
              top: `calc(50% + ${yPct}% - 18px)`,
              animation: `node-drift-${drift} ${duration}s ease-in-out ${delay}s infinite`,
            }}
          >
            <Icon size={16} color="var(--periwinkle)" strokeWidth={1.5} />
          </div>
        );
      })}
    </div>
  );
}
