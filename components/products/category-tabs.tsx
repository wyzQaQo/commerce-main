'use client';

import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { categories, getLocalized } from '@/lib/data';
import { cn } from '@/lib/utils';
import type { Locale } from '@/lib/types';

interface CategoryTabsProps {
  locale: Locale;
}

export function CategoryTabs({ locale }: CategoryTabsProps) {
  const t = useTranslations('products');
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = searchParams.get('category') ?? '';

  const tabs = [
    { slug: '', label: t('allCategories') },
    ...categories.map((c) => ({ slug: c.slug, label: getLocalized(c.name, locale) }))
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => {
        const href = tab.slug ? `${pathname}?category=${tab.slug}` : pathname;
        const isActive = active === tab.slug;
        return (
          <Link
            key={tab.slug || 'all'}
            href={href}
            className={cn(
              'relative rounded-full px-4 py-2 text-sm font-medium transition-colors',
              isActive ? 'text-white' : 'text-brand-navy hover:bg-secondary'
            )}
          >
            {isActive && (
              <motion.span
                layoutId="category-tab"
                className="absolute inset-0 rounded-full bg-brand-ocean"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
