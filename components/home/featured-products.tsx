import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product-card';
import { getFeaturedProducts } from '@/lib/data';
import type { Locale } from '@/lib/types';

interface FeaturedProductsProps {
  locale: Locale;
}

export async function FeaturedProducts({ locale }: FeaturedProductsProps) {
  const t = await getTranslations('home');
  const products = getFeaturedProducts(12);

  return (
    <section className="section-padding">
      <div className="container">
        <div className="mb-12 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            <h2 className="mb-3 text-3xl font-bold md:text-4xl">{t('featuredTitle')}</h2>
            <p className="text-muted-foreground">{t('featuredSubtitle')}</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/products">{t('viewAllProducts')}</Link>
          </Button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  );
}
