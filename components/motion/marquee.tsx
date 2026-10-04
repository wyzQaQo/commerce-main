'use client';

import { cn } from '@/lib/utils';

interface MarqueeProps {
  items: string[];
  speed?: number;
  reverse?: boolean;
  className?: string;
}

export function Marquee({ items, speed = 30, reverse = false, className }: MarqueeProps) {
  const duration = `${speed}s`;

  return (
    <div className={cn('overflow-hidden', className)}>
      <div
        className={cn('flex w-max gap-10', reverse ? 'animate-marquee-reverse' : 'animate-marquee')}
        style={{ animationDuration: duration }}
      >
        {[...items, ...items].map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="whitespace-nowrap text-sm font-semibold uppercase tracking-widest text-white/50"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
