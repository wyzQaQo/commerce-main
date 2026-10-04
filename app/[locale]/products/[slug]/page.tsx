import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ProductGallery } from '@/components/products/product-gallery';
import { ProductCard } from '@/components/product-card';
import { ProductDetailTabs } from '@/components/products/product-detail-tabs';
import { ProductDetailActions } from '@/components/products/product-detail-client';
import { CbmCalculator } from '@/components/products/cbm-calculator';
import { Badge } from '@/components/ui/badge';
import {
  getProductBySlug,
  getLocalized,
  getRelatedProducts,
  getAllProductSlugs
} from '@/lib/data';
import { buildMetadata, buildProductJsonLd, buildBreadcrumbJsonLd } from '@/lib/metadata';
import { JsonLd } from '@/components/seo/json-ld';
import { SITE_URL } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';
import type { Locale } from '@/lib/types';

export function generateStaticParams() {
  const locales: Locale[] = ['en', 'ru', 'es'];
  return locales.flatMap((locale) =>
    getAllProductSlugs().map((slug) => ({ locale, slug }))
  );
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  const name = getLocalized(product.name, locale as Locale);
  const description = getLocalized(product.shortDescription, locale as Locale);
  const keywordsRaw = product.seoKeywords
    ? getLocalized(product.seoKeywords, locale as Locale)
    : '';
  const keywords = keywordsRaw
    ? keywordsRaw.split(',').map((k) => k.trim()).filter(Boolean)
    : undefined;

  return buildMetadata({
    title: name,
    description,
    path: `/products/${slug}`,
    locale,
    image: product.images[0],
    keywords
  });
}

export default async function ProductDetailPage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const product = getProductBySlug(slug);
  if (!product) notFound();

  const t = await getTranslations('products');
  const loc = locale as Locale;
  const name = getLocalized(product.name, loc);
  const description = getLocalized(product.description, loc);
  const installationGuide = getLocalized(product.installationGuide, loc);
  const related = getRelatedProducts(product);

  const specs = product.specs.map((s) => ({
    label: getLocalized(s.label, loc),
    value: getLocalized(s.value, loc)
  }));

  const certifications = product.certifications.map((c) => ({
    title: getLocalized(c.title, loc),
    description: getLocalized(c.description, loc)
  }));

  const pageUrl = `${SITE_URL}/${locale}/products/${slug}`;
  const productLd = buildProductJsonLd({
    name,
    description,
    url: pageUrl,
    image: product.images[0]!,
    sku: product.sku,
    brand: product.brand,
    priceMin: product.priceMin,
    priceMax: product.priceMax
  });
  const breadcrumbLd = buildBreadcrumbJsonLd([
    { name: 'Home', url: `${SITE_URL}/${locale}` },
    { name: 'Products', url: `${SITE_URL}/${locale}/products` },
    { name, url: pageUrl }
  ]);

  return (
    <div className="section-padding">
      <JsonLd data={productLd} />
      <JsonLd data={breadcrumbLd} />
      <div className="container">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-8">
            <ProductGallery images={product.images} alt={name} />
            <div className="lg:hidden">
              <ProductDetailTabs
                description={description}
                specs={specs}
                installationGuide={installationGuide}
                certifications={certifications}
              />
            </div>
          </div>

          <div>
            <Badge variant="gold" className="mb-3">
              {product.brand}
            </Badge>
            <h1 className="mb-2 text-3xl font-bold">{name}</h1>
            <p className="mb-6 text-sm text-muted-foreground">
              {t('sku')}: {product.sku}
            </p>
            <ProductDetailActions
              productName={name}
              sku={product.sku}
              priceLabel={formatPrice(product.priceMin, product.priceMax)}
            />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {getLocalized(product.shortDescription, loc)}
            </p>
          </div>
        </div>

        <div className="mt-12 hidden lg:block">
          <ProductDetailTabs
            description={description}
            specs={specs}
            installationGuide={installationGuide}
            certifications={certifications}
          />
        </div>

        <div className="mt-12">
          <CbmCalculator packaging={product.packaging} />
        </div>

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-8 text-2xl font-bold">{t('related')}</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} locale={loc} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
