'use client';

import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ShineBorderProps {
  children: ReactNode;
  className?: string;
  borderClassName?: string;
}

export function ShineBorder({ children, className, borderClassName }: ShineBorderProps) {
  return (
    <div
      className={cn(
        'relative rounded-xl bg-gradient-to-r from-brand-ocean via-sky-300 to-brand-ocean bg-[length:200%_100%] p-[2px] animate-shine-border',
        borderClassName,
        className
      )}
    >
      <div className="rounded-[10px] bg-brand-navy/90">{children}</div>
    </div>
  );
}
