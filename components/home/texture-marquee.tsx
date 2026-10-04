'use client';

import { Marquee } from '@/components/motion/marquee';

const TEXTURES = [
  'Palm Thatch · UV Class A',
  'Nipa Panel · B1 Fire Rated',
  'Cadjan Layer · Maldives Style',
  'Reed Profile · Spa & Pergola',
  'Straw / Cogon · Theme Parks',
  'Makuti · Safari Lodges',
  '500×500 mm OEM',
  'Salt-Spray Tested',
  '20ft / 40HC Container Ready'
];

export function TextureMarquee() {
  return (
    <section className="border-y border-white/10 bg-brand-navy py-8">
      <Marquee items={TEXTURES} speed={35} />
      <div className="mt-4">
        <Marquee items={[...TEXTURES].reverse()} reverse speed={42} />
      </div>
    </section>
  );
}
