import { Bot, Brain, Database, Globe, Link2, Mic, Sparkles, Zap, type LucideIcon } from 'lucide-react';
import { Avatar } from '@/components/Avatar';

const NODE_ICONS: LucideIcon[] = [Sparkles, Mic, Bot, Link2, Zap, Brain, Database, Globe];

export function HeroAvatar() {
  return (
    <div className="relative aspect-square w-full max-w-[240px] sm:max-w-[288px] lg:max-w-[320px] xl:max-w-[360px]">
      <Avatar src="/avatar/cyrus-avatar.jpg" alt="Cyrus Gaburno" tier="lg" priority orbitIcons={NODE_ICONS} />

      <div
        role="status"
        aria-label="Currently online"
        className="absolute flex h-5 w-5 items-center justify-center"
        style={{ left: 'calc(50% + 22.6% - 10px)', top: 'calc(50% + 22.6% - 10px)' }}
      >
        <span className="absolute h-5 w-5 animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative h-5 w-5 rounded-full border-[3px] border-void bg-emerald-400" />
      </div>
    </div>
  );
}
