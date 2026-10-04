'use client';

import { ShineBorder } from '@/components/motion/shine-border';
import { QuoteButton } from '@/components/rfq/quote-button';

interface HeroScatterBlockProps {
  title: string;
  subtitle: string;
  ctaLabel: string;
}

export function HeroScatterBlock({ title, subtitle, ctaLabel }: HeroScatterBlockProps) {
  return (
    <div className="relative z-10 max-w-2xl">
      <h1 className="mb-4 text-3xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
        {title}
      </h1>
      <p className="mb-8 text-lg text-white/85 md:text-xl">{subtitle}</p>

      <ShineBorder className="relative inline-block">
        <QuoteButton variant="gold" size="lg" label={ctaLabel} className="relative z-10 shadow-lg" />
      </ShineBorder>
    </div>
  );
}
