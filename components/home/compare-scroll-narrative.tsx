'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { gsap, ScrollTrigger, registerGsapPlugins } from '@/lib/gsap/register';
import { CoastalHorizon } from '@/components/effects/coastal-horizon';
import { ShineBorder } from '@/components/motion/shine-border';
import { Shield, Sun, Waves, Wind } from 'lucide-react';

const NATURAL_IMAGE = '/images/compare/natural-thatch.jpg';
const SYNTHETIC_IMAGE = '/images/compare/synthetic-thatch.jpg';

const FEATURES = [
  { icon: Sun, label: 'UV Resistant', side: 'left' as const },
  { icon: Shield, label: 'Class B1 Fire Rated', side: 'right' as const },
  { icon: Wind, label: 'Hurricane Tested', side: 'left' as const },
  { icon: Waves, label: 'Salt-Spray Ready', side: 'right' as const }
];

/** Apple-style pinned scroll narrative: natural dissolves into synthetic + chips fly in */
export function CompareScrollNarrative() {
  const t = useTranslations('thatchCompare');
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const naturalRef = useRef<HTMLDivElement>(null);
  const syntheticRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const chipRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    registerGsapPlugins();
    const section = sectionRef.current;
    const pin = pinRef.current;
    if (!section || !pin) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=90%',
          pin: pin,
          scrub: 1.1,
          anticipatePin: 1
        }
      });

      tl.fromTo(
          naturalRef.current,
          { scale: 1.08, opacity: 1, filter: 'blur(0px)' },
          { scale: 1, opacity: 0, filter: 'blur(8px)', duration: 0.35, ease: 'power2.inOut' },
          0
        )
        .fromTo(
          syntheticRef.current,
          { scale: 0.92, opacity: 0, filter: 'blur(12px)' },
          { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.35, ease: 'power2.inOut' },
          0
        );

      chipRefs.current.forEach((chip, i) => {
        if (!chip) return;
        const fromLeft = FEATURES[i]?.side === 'left';
        tl.fromTo(
          chip,
          {
            x: fromLeft ? -120 : 120,
            y: gsap.utils.random(-30, 30),
            opacity: 0,
            rotate: fromLeft ? -12 : 12,
            scale: 0.6
          },
          {
            x: 0,
            y: 0,
            opacity: 1,
            rotate: 0,
            scale: 1,
            duration: 0.12,
            ease: 'back.out(2)'
          },
          0.15 + i * 0.08
        );
      });

      tl.to(
        pin,
        { rotateY: -4, scale: 0.97, duration: 0.25, ease: 'none' },
        0.35
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-b from-brand-navy via-slate-900 to-brand-navy"
    >
      <CoastalHorizon />
      <div ref={pinRef} className="relative z-10 flex min-h-screen items-center overflow-hidden py-16">
        <div className="container">
          <div className="mb-10 text-center [perspective:1200px]">
            <h2
              ref={titleRef}
              className="mb-3 text-3xl font-bold text-white drop-shadow-md md:text-4xl"
            >
              {t('title')}
            </h2>
            <p ref={subtitleRef} className="mx-auto max-w-2xl text-white/70">
              {t('subtitle')}
            </p>
          </div>

          <div className="relative mx-auto max-w-4xl">
            <div className="pointer-events-none absolute inset-0 hidden md:block">
              {FEATURES.map((f, i) => (
                <div
                  key={f.label}
                  ref={(el) => {
                    chipRefs.current[i] = el;
                  }}
                  className={`absolute top-1/2 opacity-0 ${
                    f.side === 'left' ? '-left-2 lg:left-0' : '-right-2 lg:right-0'
                  } -translate-y-1/2`}
                  style={{ marginTop: `${(i - 1.5) * 58}px` }}
                >
                  <div className="flex items-center gap-2 rounded-full border border-brand-ocean/40 bg-brand-navy/95 px-4 py-2 text-sm font-medium text-white shadow-xl backdrop-blur-md">
                    <f.icon className="h-4 w-4 text-brand-ocean-light" />
                    {f.label}
                  </div>
                </div>
              ))}
            </div>

            <ShineBorder className="bg-brand-navy" borderClassName="rounded-xl">
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl shadow-2xl">
                <div ref={naturalRef} className="absolute inset-0">
                  <Image
                    src={NATURAL_IMAGE}
                    alt={t('naturalLabel')}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 896px"
                  />
                </div>
                <div ref={syntheticRef} className="absolute inset-0 opacity-0">
                  <Image
                    src={SYNTHETIC_IMAGE}
                    alt={t('syntheticLabel')}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 896px"
                  />
                </div>
                <div className="pointer-events-none absolute bottom-4 left-4 rounded-md bg-black/60 px-3 py-1.5 text-sm font-semibold text-white">
                  {t('naturalLabel')}
                </div>
                <div className="pointer-events-none absolute bottom-4 right-4 rounded-md bg-brand-ocean px-3 py-1.5 text-sm font-semibold text-white">
                  {t('syntheticLabel')}
                </div>
              </div>
            </ShineBorder>
          </div>

          <p className="mt-6 text-center text-sm text-white/50">{t('dragHint')}</p>
        </div>
      </div>
    </section>
  );
}
