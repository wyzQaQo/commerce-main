import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ProductsHero } from '@/components/products/products-hero';
import { ProductsListPanel } from '@/components/products/products-list-panel';
import { ProductsSidebar } from '@/components/products/products-sidebar';
import { products } from '@/lib/data';
import { buildMetadata } from '@/lib/metadata';
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

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-sky-50/40 to-white">
      <ProductsHero title={t('title')} description={t('description')} />

      <div className="container w-full max-w-screen-2xl py-10 md:py-14">
        <div className="flex w-full flex-col gap-8 xl:flex-row xl:items-start">
          <div className="min-w-0 flex-1">
            <ProductsListPanel items={products} locale={loc} />
          </div>
          <ProductsSidebar />
        </div>
      </div>
    </div>
  );
}
