'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { QuoteButton } from '@/components/rfq/quote-button';
import { Badge } from '@/components/ui/badge';
import { SpotlightCard } from '@/components/effects/spotlight-card';
import { getLocalized } from '@/lib/data';
import { formatPrice } from '@/lib/utils';
import type { Locale, Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
  locale: Locale;
}

export function ProductCard({ product, locale }: ProductCardProps) {
  const t = useTranslations('products');
  const name = getLocalized(product.name, locale);
  const image = product.images[0] ?? '/images/hero/hero-1.jpg';

  return (
    <SpotlightCard className="product-card-hover flex h-full flex-col">
      <Link href={`/products/${product.slug}`} className="group relative aspect-[4/3] overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 25vw"
        />
        {product.featured && (
          <Badge className="absolute left-3 top-3 bg-brand-ocean text-white">Featured</Badge>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <p className="mb-1 text-xs text-muted-foreground">{product.sku}</p>
        <h3 className="mb-2 line-clamp-2 text-sm font-semibold">
          <Link href={`/products/${product.slug}`} className="hover:text-brand-ocean">
            {name}
          </Link>
        </h3>
        <p className="mb-4 text-sm font-bold text-brand-navy">
          {formatPrice(product.priceMin, product.priceMax)}
        </p>
        <QuoteButton
          productName={name}
          sku={product.sku}
          label={t('inquire')}
          className="mt-auto w-full"
        />
      </div>
    </SpotlightCard>
  );
}
