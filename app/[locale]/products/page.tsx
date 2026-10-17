import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ProductsHero } from '@/components/products/products-hero';
import { ProductsListPanel } from '@/components/products/products-list-panel';
import { ProductsSidebar } from '@/components/products/products-sidebar';
import { products, getLocalized } from '@/lib/data';
import {
  buildMetadata,
  buildCollectionPageJsonLd,
  buildBreadcrumbJsonLd
} from '@/lib/metadata';
import { JsonLd } from '@/components/seo/json-ld';
import { SITE_URL } from '@/lib/constants';
import type { Locale } from '@/lib/types';

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ru' }, { locale: 'es' }];
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'products' });
  return buildMetadata({
    title: t('title'),
    description: t('description'),
    path: '/products',
    locale
  });
}

export default async function ProductsPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('products');
  const loc = locale as Locale;
  const collectionLd = buildCollectionPageJsonLd({
    name: t('title'),
    description: t('description'),
    url: `${SITE_URL}/${locale}/products`,
    locale,
    items: products.map((p) => ({
      name: getLocalized(p.name, loc),
      url: `${SITE_URL}/${locale}/products/${p.slug}`
    }))
  });
  const breadcrumbLd = buildBreadcrumbJsonLd([
    { name: 'Home', url: `${SITE_URL}/${locale}` },
    { name: t('title'), url: `${SITE_URL}/${locale}/products` }
  ]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-sky-50/40 to-white">
      <JsonLd data={collectionLd} />
      <JsonLd data={breadcrumbLd} />
      <ProductsHero title={t('heading')} description={t('description')} />

      <div className="container w-full max-w-screen-2xl py-10 md:py-14">
        <div className="flex w-full flex-col gap-8 xl:flex-row xl:items-start">
          <div className="min-w-0 flex-1">
            <h2 className="mb-6 text-2xl font-bold text-brand-navy">
              {t('listHeading')}
            </h2>
            <ProductsListPanel items={products} locale={loc} />
          </div>
          <ProductsSidebar />
        </div>
      </div>
    </div>
  );
}
