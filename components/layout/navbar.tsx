'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Menu, X } from 'lucide-react';
import { Link, usePathname } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { QuoteButton } from '@/components/rfq/quote-button';
import { SITE_NAME } from '@/lib/constants';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/', key: 'home' },
  { href: '/products', key: 'products' },
  { href: '/projects', key: 'projects' },
  { href: '/blog', key: 'blog' },
  { href: '/about', key: 'about' },
  { href: '/contact', key: 'contact' }
] as const;

const LOCALES = ['en', 'ru', 'es'] as const;

export function Navbar() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-brand-navy/95 text-white backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <span className="text-lg text-brand-ocean">{SITE_NAME}</span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-brand-ocean',
                pathname === link.href && 'text-brand-ocean'
              )}
            >
              {t(link.key)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <div className="flex gap-1 text-xs uppercase">
            {LOCALES.map((loc) => (
              <Link
                key={loc}
                href={pathname}
                locale={loc}
                className="rounded px-2 py-1 hover:bg-white/10"
              >
                {loc}
              </Link>
            ))}
          </div>
          <QuoteButton variant="gold" size="sm" label={t('getQuote')} />
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="text-white lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-brand-navy px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium"
              >
                {t(link.key)}
              </Link>
            ))}
            <QuoteButton variant="gold" size="sm" label={t('getQuote')} className="mt-2 w-full" />
          </nav>
        </div>
      )}
    </header>
  );
}
