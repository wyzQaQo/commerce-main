import { Link } from '@/i18n/routing';
import { PILLARS } from '@/lib/pillars';
import type { Locale } from '@/lib/types';

const LABELS: Record<Locale, Record<string, string>> = {
  en: {
    'fire-retardant-thatch-treatment': 'Fire retardant thatch (B1 / Class A)',
    'thatch-roofing-price-south-africa': 'Thatch roofing prices'
  },
  ru: {
    'fire-retardant-thatch-treatment': 'Огнезащитная солома (B1 / Class A)',
    'thatch-roofing-price-south-africa': 'Цены на соломенные кровли'
  },
  es: {
    'fire-retardant-thatch-treatment': 'Paja ignífuga (B1 / Clase A)',
    'thatch-roofing-price-south-africa': 'Precios de cubierta de paja'
  },
  it: {
    'fire-retardant-thatch-treatment': 'Paglia ignifuga (B1 / Classe A)',
    'thatch-roofing-price-south-africa': 'Prezzi copertura in paglia'
  }
};

/**
 * Reusable pillar (conversion-hub) link block. Sits in the homepage hero area
 * and at the bottom of every product page so the two high-opportunity hub pages
 * receive site-wide internal links (blueprint internal-link matrix #2/#11/#29).
 */
export function PillarLinks({ locale }: { locale: Locale }) {
  const loc = locale as Locale;
  return (
    <ul className="flex flex-wrap gap-3" data-geo="pillar-hub-links">
      {PILLARS.map((p) => (
        <li key={p.slug}>
          <Link
            href={`/guides/${p.slug}`}
            className="text-sm font-semibold text-brand-navy hover:text-brand-ocean hover:underline"
          >
            {LABELS[loc][p.slug] ?? p.h1}
          </Link>
        </li>
      ))}
    </ul>
  );
}
