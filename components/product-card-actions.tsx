'use client';

import { QuoteButton } from '@/components/rfq/quote-button';

interface ProductCardActionsProps {
  priceLabel: string;
  inquireLabel: string;
  productName: string;
  sku: string;
}

export function ProductCardActions({
  priceLabel,
  inquireLabel,
  productName,
  sku
}: ProductCardActionsProps) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-sm font-semibold text-brand-ocean">{priceLabel}</span>
      <QuoteButton
        productName={productName}
        sku={sku}
        label={inquireLabel}
        variant="outline"
        size="sm"
      />
    </div>
  );
}
