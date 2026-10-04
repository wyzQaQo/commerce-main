'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { cn } from '@/lib/utils';

const locales = [
  { code: 'en', label: 'EN' },
  { code: 'ru', label: 'RU' },
  { code: 'es', label: 'ES' }
] as const;

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex items-center rounded-md border border-border bg-secondary/50 p-0.5">
      {locales.map((l) => (
        <button
          key={l.code}
          onClick={() => router.replace(pathname, { locale: l.code })}
          className={cn(
            'rounded px-2 py-1 text-xs font-semibold transition-colors',
            locale === l.code
              ? 'bg-brand-navy text-white'
              : 'text-brand-navy hover:text-brand-ocean'
          )}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
