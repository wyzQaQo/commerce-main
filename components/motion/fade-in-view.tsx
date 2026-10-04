'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FadeInViewProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}

export function FadeInView({
  children,
  className,
  delay = 0,
  y = 24
}: FadeInViewProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-8% 0px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
