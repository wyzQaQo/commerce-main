'use client';

import { QuoteButton } from '@/components/rfq/quote-button';
import { useTranslations } from 'next-intl';

interface ProductDetailActionsProps {
  productName: string;
  sku: string;
  priceLabel: string;
}

export function ProductDetailActions({
  productName,
  sku,
  priceLabel
}: ProductDetailActionsProps) {
  const t = useTranslations('nav');

  return (
    <div className="flex flex-wrap items-center gap-4">
      <p className="text-2xl font-bold text-brand-ocean">{priceLabel}</p>
      <QuoteButton
        productName={productName}
        sku={sku}
        label={t('getQuote')}
        variant="gold"
        size="lg"
      />
    </div>
  );
}
