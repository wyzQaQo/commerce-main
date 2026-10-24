import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ProductsHero } from '@/components/products/products-hero';
import { ProductsListPanel } from '@/components/products/products-list-panel';
import { ProductsSidebar } from '@/components/products/products-sidebar';
import { IndexGuide } from '@/components/sections/index-guide';
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
      {/* The grid below is a client component behind Suspense, so the product
          URLs it renders are not in the server HTML a crawler fetches — the hub
          measured zero crawlable links to its own 36 product pages. This block
          emits the same links server-side, which both gives crawlers the paths
          and carries the ItemList graph saying "this URL indexes the range". */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: t('h1'),
            description: t('description'),
            numberOfItems: products.length,
            itemListElement: products.map((p, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: p.name[loc] ?? p.name.en,
              url: `/${locale}/products/${p.slug}`
            }))
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: `/${locale}` },
              { '@type': 'ListItem', position: 2, name: t('h1'), item: `/${locale}/products` }
            ]
          })
        }}
      />
      <nav aria-label="Product index" className="container w-full max-w-screen-2xl pt-6">
        <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-sky-700">
          {products.map((p) => (
            <li key={p.slug}>
              <a href={`/${locale}/products/${p.slug}`}>
                {p.name[loc] ?? p.name.en}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* The H1 used to be the bare nav label "Products" ("Productos",
              "Продукция"), which gives a crawler no category signal at all. */}
      <ProductsHero title={t('h1')} description={t('description')} />

      <div className="container w-full max-w-screen-2xl py-10 md:py-14">
        <div className="flex w-full flex-col gap-8 xl:flex-row xl:items-start">
          <div className="min-w-0 flex-1">
            <ProductsListPanel items={products} locale={loc} />
          </div>
          <ProductsSidebar />
        </div>
      </div>
      <IndexGuide namespace="products" />
      {/* A second block: the route measured 255 words in en and 228 in ru, the
          shortest index page on the site. */}
      <IndexGuide namespace="products" slot="guide2" />
    </div>
  );
}
