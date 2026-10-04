'use client';

import { useEffect, useRef } from 'react';
import { stats, getLocalized } from '@/lib/data';
import { AnimatedStat } from '@/components/motion/animated-stat';
import { gsap, registerGsapPlugins } from '@/lib/gsap/register';
import type { Locale } from '@/lib/types';

interface StatsSectionProps {
  locale: Locale;
}

export function StatsSection({ locale }: StatsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    registerGsapPlugins();
    const section = sectionRef.current;
    const items = itemRefs.current.filter(Boolean);
    if (!section || !items.length) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      gsap.set(items, { opacity: 1, y: 0, rotateX: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        items,
        {
          y: 100,
          opacity: 0,
          rotateX: -55,
          scale: 0.85,
          transformOrigin: 'center bottom'
        },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          scale: 1,
          duration: 0.9,
          stagger: 0.12,
          ease: 'back.out(1.6)',
          scrollTrigger: {
            trigger: section,
            start: 'top 82%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }, section);

    return () => ctx.revert();
  }, [locale]);

  return (
    <section ref={sectionRef} className="overflow-hidden bg-brand-navy py-14 [perspective:900px]">
      <div className="container">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={stat.id}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              className="opacity-0"
            >
              <AnimatedStat
                value={stat.value}
                label={getLocalized(stat.label, locale)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
