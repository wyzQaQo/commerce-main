'use client';

import { useRef, type MouseEvent, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
}

/** Adapted from react-bits SpotlightCard */
export function SpotlightCard({
  children,
  className,
  spotlightColor = 'rgba(56, 189, 248, 0.22)'
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  function onMove(e: MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    el.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    el.style.setProperty('--spotlight-color', spotlightColor);
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-white/10 bg-white/95 shadow-card',
        'before:pointer-events-none before:absolute before:inset-0 before:opacity-0 before:transition-opacity before:duration-500',
        'before:bg-[radial-gradient(circle_at_var(--mouse-x)_var(--mouse-y),var(--spotlight-color),transparent_75%)]',
        'hover:before:opacity-100 focus-within:before:opacity-100',
        className
      )}
      style={
        {
          '--mouse-x': '50%',
          '--mouse-y': '50%',
          '--spotlight-color': spotlightColor
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
