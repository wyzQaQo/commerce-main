'use client';

import { cn } from '@/lib/utils';

interface SparklesTextProps {
  children: React.ReactNode;
  className?: string;
}

export function SparklesText({ children, className }: SparklesTextProps) {
  return <span className={cn('relative inline-block', className)}>{children}</span>;
}
