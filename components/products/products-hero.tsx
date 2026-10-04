'use client';

import { CoastalHorizon } from '@/components/effects/coastal-horizon';

interface ProductsHeroProps {
  title: string;
  description: string;
}

export function ProductsHero({ title, description }: ProductsHeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-navy via-[#0c3d5c] to-sky-900 py-16 md:py-20">
      <CoastalHorizon />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgba(56,189,248,0.15),transparent_55%)]" />
      <div className="container relative z-10 max-w-screen-2xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-sky-300/80">
          B2B Export Catalog
        </p>
        <h1 className="mb-4 max-w-3xl text-3xl font-bold text-white md:text-5xl">{title}</h1>
        <p className="max-w-2xl text-base text-white/75 md:text-lg">{description}</p>
      </div>
    </section>
  );
}
