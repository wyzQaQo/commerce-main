'use client';

import { useEffect, useRef, type RefObject } from 'react';
import { gsap, registerGsapPlugins } from '@/lib/gsap/register';
import { cn } from '@/lib/utils';

interface ScatterLine {
  text: string;
  as?: 'h1' | 'p' | 'span';
  className?: string;
}

interface ScatterTextGroupProps {
  lines: ScatterLine[];
  magnetRef?: RefObject<HTMLElement | null>;
  disableAutoScatter?: boolean;
  scatterIntensity?: number;
}

export function ScatterTextGroup({
  lines,
  magnetRef,
  disableAutoScatter = false,
  scatterIntensity = 0.4
}: ScatterTextGroupProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsapPlugins();
    const root = rootRef.current;
    if (!root) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const chars = root.querySelectorAll<HTMLElement>('[data-char]');
    if (!chars.length || reduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        chars,
        {
          opacity: 0,
          x: () => gsap.utils.random(-120, 120) * scatterIntensity,
          y: () => gsap.utils.random(-80, 80) * scatterIntensity,
          z: () => gsap.utils.random(-200, 200) * scatterIntensity,
          rotateX: () => gsap.utils.random(-90, 90),
          rotateY: () => gsap.utils.random(-90, 90)
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          z: 0,
          rotateX: 0,
          rotateY: 0,
          duration: 1.2,
          stagger: 0.02,
          ease: 'power3.out'
        }
      );

      const scatter = () => {
        gsap.to(chars, {
          x: () => gsap.utils.random(-60, 60) * scatterIntensity,
          y: () => gsap.utils.random(-40, 40) * scatterIntensity,
          z: () => gsap.utils.random(-80, 80) * scatterIntensity,
          rotateX: () => gsap.utils.random(-25, 25),
          rotateY: () => gsap.utils.random(-25, 25),
          duration: 1.4,
          stagger: 0.01,
          ease: 'power2.inOut'
        });
      };

      const gather = () => {
        gsap.to(chars, {
          x: 0,
          y: 0,
          z: 0,
          rotateX: 0,
          rotateY: 0,
          duration: 0.6,
          stagger: 0.008,
          ease: 'back.out(2)'
        });
      };

      let scatterTimer: ReturnType<typeof setTimeout> | undefined;
      if (!disableAutoScatter) {
        scatterTimer = setTimeout(scatter, 3000);
      }

      const magnet = magnetRef?.current;
      if (magnet) {
        magnet.addEventListener('mouseenter', gather);
        magnet.addEventListener('mouseleave', () => {
          if (!disableAutoScatter) scatterTimer = setTimeout(scatter, 800);
        });
      }

      return () => {
        if (scatterTimer) clearTimeout(scatterTimer);
        if (magnet) {
          magnet.removeEventListener('mouseenter', gather);
        }
      };
    }, root);

    return () => ctx.revert();
  }, [lines, magnetRef, disableAutoScatter, scatterIntensity]);

  return (
    <div ref={rootRef} className="[perspective:600px] [transform-style:preserve-3d]">
      {lines.map((line, li) => {
        const Tag = line.as ?? 'p';
        return (
          <Tag key={`${line.text}-${li}`} className={cn(line.className)}>
            {line.text.split('').map((char, ci) => (
              <span
                key={`${li}-${ci}`}
                data-char
                className="inline-block"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </Tag>
        );
      })}
    </div>
  );
}
