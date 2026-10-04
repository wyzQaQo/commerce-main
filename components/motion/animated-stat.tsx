'use client';

import { useEffect, useRef, useState } from 'react';

interface AnimatedStatProps {
  value: string;
  label: string;
}

export function AnimatedStat({ value, label }: AnimatedStatProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    const match = value.match(/^(\d+)(.*)$/);
    if (!match) {
      setDisplay(value);
      return;
    }

    const target = Number(match[1]);
    const suffix = match[2] ?? '';
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        let start = 0;
        const duration = 1200;
        const startTime = performance.now();

        const tick = (now: number) => {
          const p = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          start = Math.round(target * eased);
          setDisplay(`${start}${suffix}`);
          if (p < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
        observer.disconnect();
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="text-center text-white">
      <p className="text-3xl font-bold text-brand-ocean md:text-4xl">{display}</p>
      <p className="mt-1 text-sm text-white/70">{label}</p>
    </div>
  );
}
