import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { ProductGallery } from '@/components/products/product-gallery';
import { ProductCard } from '@/components/product-card';
import { ProductDetailTabs } from '@/components/products/product-detail-tabs';
import { ProductDetailActions } from '@/components/products/product-detail-client';
import { CbmCalculator } from '@/components/products/cbm-calculator';
import { FaqSectionServer } from '@/components/faq/faq-section-server';
import { PillarLinks } from '@/components/layout/pillar-links';
import { Badge } from '@/components/ui/badge';
import {
  GeoAnswerLead,
  GeoComparison,
  GeoSpecTable,
  GeoUseCases
} from '@/components/geo/GeoBlocks';
import {
  getProductBySlug,
  getLocalized,
  getCategoryById,
  getSiblingProducts,
  getRelatedProducts,
  getAllProductSlugs
} from '@/lib/data';
import {
  buildMetadata,
  buildProductJsonLd,
  buildBreadcrumbJsonLd,
  generateProductFAQSchema
} from '@/lib/metadata';
import { JsonLd } from '@/components/seo/json-ld';
import { SITE_URL } from '@/lib/constants';
import { cartonCbm } from '@/lib/shipping';
import { formatPrice } from '@/lib/utils';
import type { Locale } from '@/lib/types';

export function generateStaticParams() {
  const locales: Locale[] = ['en', 'ru', 'es', 'it', 'id', 'ja', 'fr', 'de'];
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

/**
 * Look a spec value up by its English label, so the match does not depend on
 * the active locale (translated labels are "Материал", "Material", …).
 */
function rawSpecValue(
  product: { specs: { label: Record<Locale, string>; value: Record<Locale, string> }[] },
  needle: string,
  loc: Locale
) {
  const spec = product.specs.find((s) =>
    (s.label.en ?? '').toLowerCase().includes(needle)
  );
  return spec ? getLocalized(spec.value, loc) : undefined;
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
  const category = getCategoryById(product.categoryId);
  const categoryName = category ? getLocalized(category.name, loc) : '';
  const categoryUrl = category
    ? `/products?category=${category.slug}`
    : '/products';

  const specs = product.specs.map((s) => ({
    label: getLocalized(s.label, loc),
    value: getLocalized(s.value, loc)
  }));

  const certifications = product.certifications.map((c) => ({
    title: getLocalized(c.title, loc),
    description: getLocalized(c.description, loc)
  }));

  // GEO fields — every product carries all three (see _audit/enrich_palmgrass_products.py).
  const answerLead = product.answer_lead
    ? getLocalized(product.answer_lead, loc)
    : description;
  const useCases = (product.use_cases ?? []).map((uc) => ({
    scenario: getLocalized(uc.scenario, loc),
    detail: getLocalized(uc.detail, loc)
  }));
  const comparison = product.comparison
    ? {
        oursLabel: getLocalized(product.comparison.ours_label, loc),
        alternativeLabel: getLocalized(product.comparison.alternative_label, loc),
        rows: product.comparison.rows.map((row) => ({
          dimension: getLocalized(row.dimension, loc),
          ours: getLocalized(row.ours, loc),
          alternative: getLocalized(row.alternative, loc)
        }))
      }
    : null;

  // H1 = product name + core category word, unless the name already carries it.
  const categoryInName =
    categoryName.length > 0 &&
    name.toLowerCase().includes(categoryName.toLowerCase());
  const h1 = categoryName && !categoryInName ? `${name} — ${categoryName}` : name;

  // The spec table mirrors the specs field and adds the packaging data the
  // page already computes for the CBM calculator.
  const specRows = [
    ...specs,
    {
      label: t('specCartonSize'),
      value: `${product.packaging.lengthCm} × ${product.packaging.widthCm} × ${product.packaging.heightCm} mm`
    },
    { label: t('specCartonWeight'), value: `${product.packaging.weightKg} kg` },
    {
      label: t('specPanelsPerCarton'),
      value: `${product.packaging.piecesPerCarton}`
    },
    {
      label: t('specCartonVolume'),
      value: `${cartonCbm(product.packaging).toFixed(3)} m³`
    },
    {
      label: t('specPriceBand'),
      value: `${formatPrice(product.priceMin, product.priceMax)} ${t('priceUnit')}`
    }
  ];

  const material = rawSpecValue(product, 'material', loc);
  const fireRating = rawSpecValue(product, 'fire', loc);
  const serviceLife = product.comparison?.rows.find((r) =>
    r.dimension.en.toLowerCase().includes('life')
  )?.ours;

  const keywords = [
    name,
    categoryName,
    ...(product.seoKeywords
      ? getLocalized(product.seoKeywords, loc)
          .split(',')
          .map((k) => k.trim())
          .filter(Boolean)
      : []),
    material ?? '',
    fireRating ?? ''
  ].filter(Boolean);

  const pageUrl = `${SITE_URL}/${locale}/products/${slug}`;
  const productLd = buildProductJsonLd({
    name,
    description: answerLead,
    url: pageUrl,
    offerUrl: pageUrl,
    image: product.images[0]!,
    images: product.images,
    sku: product.sku,
    brand: product.brand,
    category: categoryName,
    material,
    keywords,
    audience:
      'Resort developers, hospitality contractors, theme parks and wholesale thatch importers',
    priceMin: product.priceMin,
    priceMax: product.priceMax,
    properties: specRows
  });
  const breadcrumbLd = buildBreadcrumbJsonLd([
    { name: t('breadcrumbHome'), url: `${SITE_URL}/${locale}` },
    { name: t('breadcrumbProducts'), url: `${SITE_URL}/${locale}/products` },
    ...(category
      ? [
          {
            name: categoryName,
            url: `${SITE_URL}/${locale}${categoryUrl}`
          }
        ]
      : []),
    { name, url: pageUrl }
  ]);
  // Only questions answered by the use-case and comparison blocks rendered below.
  const faqLd = generateProductFAQSchema({
    name,
    useCases,
    comparison,
    fireRating,
    serviceLife: serviceLife ? getLocalized(serviceLife, loc) : undefined,
    questions: {
      whereUsed: t('faqWhereUsed'),
      fireRating: t('faqFireRating'),
      lifespan: t('faqLifespan'),
      maintenance: t('faqMaintenance')
    }
  });

  // Text links first (descriptive anchors for crawlers and answer engines),
  // then product cards, without repeating the same product twice.
  const related = getRelatedProducts(product);
  const siblings = getSiblingProducts(
    product,
    3,
    related.map((p) => p.id)
  );

  return (
    <div className="section-padding">
      <JsonLd data={productLd} />
      <JsonLd data={breadcrumbLd} />
      {faqLd && <JsonLd data={faqLd} />}
      <div className="container">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-brand-ocean">
                {t('breadcrumbHome')}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/products" className="hover:text-brand-ocean">
                {t('breadcrumbProducts')}
              </Link>
            </li>
            {category && (
              <>
                <li aria-hidden="true">/</li>
                <li>
                  <Link href={categoryUrl} className="hover:text-brand-ocean">
                    {categoryName}
                  </Link>
                </li>
              </>
            )}
          </ol>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-8">
            <ProductGallery images={product.images} alt={name} />
          </div>

          <div>
            <Badge variant="gold" className="mb-3">
              {product.brand}
            </Badge>
            <h1 className="mb-4 text-3xl font-bold">{h1}</h1>
            <GeoAnswerLead>{answerLead}</GeoAnswerLead>
            <p className="mb-6 mt-4 text-sm text-muted-foreground">
              {t('sku')}: {product.sku}
              {category && (
                <>
                  {' · '}
                  <Link
                    href={categoryUrl}
                    className="font-medium text-brand-ocean hover:underline"
                  >
                    {categoryName}
                  </Link>
                </>
              )}
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

        {useCases.length > 0 && (
          <section className="mt-14">
            <h2 className="mb-4 text-2xl font-bold">{t('whereUsed')}</h2>
            <p className="mb-4 max-w-3xl text-sm text-muted-foreground">
              {t('environmentsLead', { name })}
            </p>
            <ul className="mb-6 flex flex-wrap gap-2" data-geo="environments">
              {useCases.map((uc) => (
                <li
                  key={uc.scenario}
                  className="rounded-full border border-brand-ocean/30 bg-brand-ocean/5 px-3 py-1 text-sm text-brand-navy"
                >
                  {uc.scenario}
                </li>
              ))}
            </ul>
            <GeoUseCases items={useCases} />
          </section>
        )}

        <section className="mt-14">
          <h2 className="mb-4 text-2xl font-bold">{t('coreParameters')}</h2>
          <GeoSpecTable
            caption={`${name} — ${t('coreParameters')}`}
            rows={specRows}
          />
        </section>

        {comparison && (
          <section className="mt-14">
            <h2 className="mb-2 text-2xl font-bold">{t('comparisonTitle')}</h2>
            <p className="mb-4 max-w-3xl text-sm text-muted-foreground">
              {t('comparisonLead', {
                ours: comparison.oursLabel,
                alternative: comparison.alternativeLabel
              })}
            </p>
            <GeoComparison
              caption={`${comparison.oursLabel} vs ${comparison.alternativeLabel}`}
              rows={comparison.rows}
              oursLabel={comparison.oursLabel}
              alternativeLabel={comparison.alternativeLabel}
            />
          </section>
        )}

        <section className="mt-14">
          <h2 className="mb-6 text-2xl font-bold">{t('descriptionTitle')}</h2>
          <ProductDetailTabs
            description={description}
            specs={specs}
            installationGuide={installationGuide}
            certifications={certifications}
          />
        </section>

        <section className="mt-14">
          <h2 className="mb-6 text-2xl font-bold">{t('containerTitle')}</h2>
          <CbmCalculator packaging={product.packaging} />
        </section>

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 text-2xl font-bold">{t('related')}</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} locale={loc} />
              ))}
            </div>
          </section>
        )}

        {siblings.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-3 text-2xl font-bold">
              {t('relatedInCategory', {
                category: categoryName || t('breadcrumbProducts')
              })}
            </h2>
            {category && (
              <p className="mb-6 text-sm text-muted-foreground">
                <Link
                  href={categoryUrl}
                  className="font-semibold text-brand-ocean hover:underline"
                >
                  {t('browseCategory', { category: categoryName })}
                </Link>
              </p>
            )}
            <ul className="space-y-2 text-sm" data-geo="sibling-links">
              {siblings.map((sibling) => {
                const siblingName = getLocalized(sibling.name, loc);
                const siblingMaterial = rawSpecValue(sibling, 'material', loc);
                return (
                  <li key={sibling.id}>
                    <Link
                      href={`/products/${sibling.slug}`}
                      className="font-semibold text-brand-navy hover:text-brand-ocean hover:underline"
                    >
                      {siblingName}
                    </Link>
                    {siblingMaterial && (
                      <span className="text-muted-foreground">
                        {' — '}
                        {siblingMaterial}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </div>

      <section className="mt-12">
        <h2 className="mb-3 text-2xl font-bold">Buyer guides</h2>
        <PillarLinks locale={loc} />
      </section>

      <div className="mt-16">
        <FaqSectionServer locale={loc} />
      </div>
    </div>
  );
}
