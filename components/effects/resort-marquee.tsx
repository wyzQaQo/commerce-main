'use client';

const DEFAULT_ITEMS = [
  'Ocean View Resorts',
  'Tropical Palapas',
  'Salt-Spray Ready',
  'Fire-Retardant B1',
  '50+ Countries',
  'Factory Direct',
  'UV Tested',
  'Eco-Lodge Ready'
];

interface ResortMarqueeProps {
  items?: string[];
  className?: string;
}

/** Inspired by react-bits ScrollVelocity / LogoLoop — leisure keyword stream */
export function ResortMarquee({ items = DEFAULT_ITEMS, className = '' }: ResortMarqueeProps) {
  const row = items.join('  ·  ');

  return (
    <div className={`overflow-hidden border-y border-white/10 py-4 ${className}`}>
      <div className="flex w-max animate-marquee gap-12 whitespace-nowrap px-4 text-sm font-semibold uppercase tracking-[0.2em] text-sky-200/70 md:text-base">
        <span>{row}</span>
        <span aria-hidden>{row}</span>
      </div>
    </div>
  );
}
