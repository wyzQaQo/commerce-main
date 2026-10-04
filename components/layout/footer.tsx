'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { CoastalHorizon } from '@/components/effects/coastal-horizon';
import { ResortMarquee } from '@/components/effects/resort-marquee';
import { QuoteButton } from '@/components/rfq/quote-button';
import {
  CONTACT_ADDRESS,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  SITE_NAME,
  getWhatsAppUrl
} from '@/lib/constants';
import { Anchor, Mail, MapPin, Phone } from 'lucide-react';

export function Footer() {
  const t = useTranslations('nav');

  return (
    <footer className="relative mt-auto overflow-hidden bg-brand-navy text-white">
      <div className="relative border-t border-white/10">
        <CoastalHorizon />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-brand-navy/40 to-brand-navy" />
        <ResortMarquee className="relative z-10 bg-brand-navy/60 backdrop-blur-sm" />
      </div>

      <div className="relative z-10 border-t border-white/10">
        <div className="container max-w-screen-2xl py-14 md:py-16">
          <div className="mb-12 rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md md:flex md:items-center md:justify-between md:gap-8">
            <div className="mb-6 md:mb-0">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">
                Overlooking the ocean, building globally
              </p>
              <h3 className="text-2xl font-bold text-white md:text-3xl">
                Ready for your next resort project?
              </h3>
              <p className="mt-2 max-w-xl text-sm text-white/70">
                Sample panels, fire certificates and container packing data — shipped from Guangzhou
                to 50+ countries.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <QuoteButton variant="gold" size="lg" label={t('getQuote')} />
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center rounded-md border border-white/25 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                WhatsApp Team
              </a>
            </div>
          </div>

          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-2">
              <h3 className="mb-3 flex items-center gap-2 text-xl font-bold text-sky-300">
                <Anchor className="h-5 w-5" />
                {SITE_NAME}
              </h3>
              <p className="max-w-md text-sm leading-relaxed text-white/70">
                Synthetic palm, nipa, cadjan, reed and straw thatch for hotels, resorts, theme parks
                and eco-tourism — engineered for leisure, built for export.
              </p>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-sky-200/80">
                Explore
              </h4>
              <ul className="space-y-2.5 text-sm text-white/70">
                <li>
                  <Link href="/" className="transition-colors hover:text-sky-300">
                    {t('home')}
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="transition-colors hover:text-sky-300">
                    {t('products')}
                  </Link>
                </li>
                <li>
                  <Link href="/projects" className="transition-colors hover:text-sky-300">
                    {t('projects')}
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="transition-colors hover:text-sky-300">
                    {t('about')}
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="transition-colors hover:text-sky-300">
                    {t('contact')}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-sky-200/80">
                Export Desk
              </h4>
              <ul className="space-y-3 text-sm text-white/70">
                <li className="flex gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" />
                  <span>{CONTACT_ADDRESS}</span>
                </li>
                <li className="flex gap-2">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" />
                  <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-sky-300">
                    {CONTACT_EMAIL}
                  </a>
                </li>
                <li className="flex gap-2">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" />
                  <span>{CONTACT_PHONE}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 border-t border-white/10 bg-[#0a1f36] py-5 text-center text-xs text-white/45">
        © {new Date().getFullYear()} {SITE_NAME}. Synthetic thatch roofing for global resort projects.
      </div>
    </footer>
  );
}
