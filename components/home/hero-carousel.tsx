'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import { heroSlides, getLocalized } from '@/lib/data';
import { gsap, ScrollTrigger, registerGsapPlugins } from '@/lib/gsap/register';
import { HeroScatterBlock } from '@/components/home/hero-scatter-block';
import { Hero3DPreview } from '@/components/home/hero-3d-preview';
import type { Locale } from '@/lib/types';

interface HeroCarouselProps {
  locale: Locale;
}

export function HeroCarousel({ locale }: HeroCarouselProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const [slide, setSlide] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    heroSlides.forEach((s) => {
      const img = new window.Image();
      img.src = s.image;
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlide((s) => (s + 1) % heroSlides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    registerGsapPlugins();
    const section = sectionRef.current;
    const preview = previewRef.current;
    const content = contentRef.current;
    const scrollHint = scrollHintRef.current;
    if (!section || !preview) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.to(preview, {
        rotateY: 18,
        rotateX: -4,
        y: 16,
        scale: 0.96,
        transformPerspective: 1200,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6,
          onUpdate: (self) => setScrollProgress(self.progress)
        }
      });

      if (content) {
        gsap.to(content, {
          opacity: 0.15,
          y: -24,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.6
          }
        });
      }

      if (scrollHint) {
        gsap.to(scrollHint, {
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '50% top',
            scrub: 0.6
          }
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  const current = heroSlides[slide] ?? heroSlides[0]!;

  return (
    <section ref={sectionRef} className="relative min-h-screen">
      <div className="relative min-h-screen overflow-hidden bg-brand-navy">
        {heroSlides.map((s, i) => (
          <div
            key={s.id}
            data-hero-bg
            aria-hidden={i !== slide}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              i === slide ? 'z-[2] opacity-100' : 'z-[1] opacity-0'
            }`}
          >
            <Image
              src={s.image}
              alt=""
              fill
              className="object-cover object-center"
              priority
              quality={90}
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/55 via-brand-navy/25 to-brand-navy/45" />
          </div>
        ))}

        <div className="container relative z-10 flex min-h-screen flex-col justify-center py-20">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
            <div ref={contentRef}>
              <HeroScatterBlock
                title={getLocalized(current.title, locale)}
                subtitle={getLocalized(current.subtitle, locale)}
                ctaLabel={getLocalized(current.cta, locale)}
              />
            </div>

            <div
              ref={previewRef}
              className="relative z-20 min-h-[420px] w-full"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <Hero3DPreview
                alt={getLocalized(current.title, locale)}
                scrollProgress={scrollProgress}
              />
            </div>
          </div>

          <div className="absolute bottom-20 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {heroSlides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSlide(i)}
                className={`h-2 rounded-full transition-all ${
                  i === slide ? 'w-8 bg-brand-ocean' : 'w-2 bg-white/40'
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        <div
          ref={scrollHintRef}
          className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-1 text-white/60"
        >
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <ChevronDown className="h-5 w-5 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
