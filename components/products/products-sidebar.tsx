'use client';

import Image from 'next/image';
import { Anchor, Shield, Sun, Waves } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { QuoteButton } from '@/components/rfq/quote-button';
import { getWhatsAppUrl } from '@/lib/constants';

const TRUST_ITEMS = [
  { icon: Waves, label: 'Salt-spray & coastal tested' },
  { icon: Sun, label: 'UV-stabilized tropical profiles' },
  { icon: Shield, label: 'Class B1 fire-retardant options' },
  { icon: Anchor, label: 'FOB Guangzhou · global export' }
];

export function ProductsSidebar() {
  return (
    <aside className="hidden w-full shrink-0 xl:block xl:w-[340px]">
      <div className="sticky top-24 space-y-5">
        <div className="overflow-hidden rounded-2xl border border-sky-200/30 bg-gradient-to-b from-brand-navy to-slate-900 p-5 text-white shadow-xl">
          <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-xl">
            <Image
              src="/images/projects/project-1.jpg"
              alt="Resort with synthetic thatch"
              fill
              className="object-cover"
              sizes="340px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 to-transparent" />
            <p className="absolute bottom-3 left-3 right-3 text-sm font-medium text-white/90">
              Overwater villas · palapas · eco-lodges
            </p>
          </div>
          <h3 className="mb-2 text-lg font-bold text-sky-200">Resort-Grade Supply</h3>
          <p className="mb-4 text-sm leading-relaxed text-white/70">
            Factory-direct panels for hospitality developers — sample panels, CBM data and 24h
            quotations for tender packs.
          </p>
          <QuoteButton variant="gold" size="sm" label="Get A Quote" className="mb-3 w-full" />
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full rounded-md border border-white/20 py-2 text-center text-sm text-white/90 transition-colors hover:bg-white/10"
          >
            WhatsApp Export Team
          </a>
        </div>

        <div className="rounded-2xl border bg-white/80 p-5 shadow-card backdrop-blur-sm">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Why specifiers choose us
          </p>
          <ul className="space-y-3">
            {TRUST_ITEMS.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-start gap-2.5 text-sm text-brand-navy">
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-brand-ocean" />
                {label}
              </li>
            ))}
          </ul>
          <Link
            href="/projects"
            className="mt-4 inline-block text-sm font-semibold text-brand-ocean hover:underline"
          >
            View global project cases →
          </Link>
        </div>
      </div>
    </aside>
  );
}
