'use client';

import { Suspense } from 'react';
import { useTranslations } from 'next-intl';
import { CategoryTabs } from '@/components/products/category-tabs';
import { ProductGridLayout } from '@/components/products/product-grid-layout';
import type { Locale, Product } from '@/lib/types';

interface ProductsListPanelProps {
  items: Product[];
  locale: Locale;
}

function ProductsListPanelInner({ items, locale }: ProductsListPanelProps) {
  const t = useTranslations('products');

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-gradient-to-r from-sky-50/80 to-white p-4 shadow-sm">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t('filterCategory')}
        </p>
        <CategoryTabs locale={locale} />
      </div>

      {items.length === 0 ? (
        <p className="py-20 text-center text-muted-foreground">{t('noResults')}</p>
      ) : (
        <ProductGridLayout items={items} locale={locale} />
      )}
    </div>
  );
}

export function ProductsListPanel(props: ProductsListPanelProps) {
  return (
    <Suspense fallback={<div className="h-96 animate-pulse rounded-lg bg-secondary" />}>
      <ProductsListPanelInner {...props} />
    </Suspense>
  );
}
