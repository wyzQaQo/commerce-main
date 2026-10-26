import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { JsonLd } from '@/components/seo/json-ld';
import { getPillarBySlug, getAllPillarSlugs, type PillarPage } from '@/lib/pillars';
import { getProductBySlug, getLocalized } from '@/lib/data';
import { buildBreadcrumbJsonLd } from '@/lib/metadata';
import { SITE_URL } from '@/lib/constants';
import type { Locale } from '@/lib/types';

export function generateStaticParams() {
  const locales: Locale[] = ['en', 'ru', 'es', 'it', 'id', 'ja', 'fr', 'de'];
  return locales.flatMap((locale) =>
    getAllPillarSlugs().map((slug) => ({ locale, slug }))
  );
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const pillar = getPillarBySlug(slug);
  if (!pillar) return {};
  return {
    title: pillar.title,
    description: pillar.description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/guides/${slug}`
    }
  };
}

function PillarBody({ pillar, loc }: { pillar: PillarPage; loc: Locale }) {
  const products = pillar.productSlugs
    .map((s) => getProductBySlug(s))
    .filter(Boolean);
  const langLabel: Record<Locale, string> = {
    en: 'Enquire',
    ru: 'Запросить',
    es: 'Solicitar',
    it: 'Richiedi',
    id: 'Minta Penawaran',
    ja: '見積もり依頼',
    fr: 'Demander un devis',
    de: 'Angebot anfordern'
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: pillar.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a }
    }))
  };
  const graph: Record<string, unknown>[] = [faqLd];
  if (pillar.howTo) {
    graph.push({
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: pillar.howTo.name,
      step: pillar.howTo.steps.map((s, i) => ({
        '@type': 'HowToStep',
        position: i + 1,
        name: `Step ${i + 1}`,
        text: s
      }))
    });
  }

  const pageUrl = `${SITE_URL}/${loc}/guides/${pillar.slug}`;
  const breadcrumbLd = buildBreadcrumbJsonLd([
    { name: 'Home', url: `${SITE_URL}/${loc}` },
    { name: 'Guides', url: `${SITE_URL}/${loc}/guides` },
    { name: pillar.h1, url: pageUrl }
  ]);

  return (
    <>
      <JsonLd data={breadcrumbLd} />
      {graph.map((g, i) => (
        <JsonLd key={i} data={g} />
      ))}
      <div className="section-padding">
        <div className="container max-w-screen-lg">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="hover:text-brand-ocean">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/guides" className="hover:text-brand-ocean">
                  Guides
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>{pillar.h1}</li>
            </ol>
          </nav>

          <h1 className="mb-4 text-3xl font-bold md:text-4xl">{pillar.h1}</h1>
          <p className="mb-8 text-lg text-muted-foreground">{pillar.description}</p>

          <article className="space-y-4 text-sm leading-relaxed text-muted-foreground">
            {pillar.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </article>

          {pillar.tables.map((tbl, ti) => (
            <section key={ti} className="mt-10">
              <h2 className="mb-3 text-2xl font-bold">{tbl.caption}</h2>
              <table className="w-full text-sm">
                <caption className="sr-only">{tbl.caption}</caption>
                <thead>
                  <tr className="border-b border-border text-left">
                    {tbl.head.map((h) => (
                      <th key={h} className="py-2 pr-4 font-semibold text-foreground">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tbl.rows.map((row, ri) => (
                    <tr key={ri} className="border-b border-border last:border-0">
                      {row.map((cell, ci) => (
                        <td key={ci} className="py-2 pr-4 align-top">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          ))}

          {pillar.howTo && (
            <section className="mt-10">
              <h2 className="mb-3 text-2xl font-bold">{pillar.howTo.name}</h2>
              <ol className="list-decimal space-y-2 pl-6 text-sm text-muted-foreground">
                {pillar.howTo.steps.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ol>
            </section>
          )}

          {products.length > 0 && (
            <section className="mt-10">
              <h2 className="mb-3 text-2xl font-bold">Related products</h2>
              <ul className="space-y-2 text-sm" data-geo="pillar-product-links">
                {products.map((p) => (
                  <li key={p!.id}>
                    <Link
                      href={`/products/${p!.slug}`}
                      className="font-semibold text-brand-navy hover:text-brand-ocean hover:underline"
                    >
                      {getLocalized(p!.name, loc)}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="mt-10">
            <h2 className="mb-3 text-2xl font-bold">FAQ</h2>
            <div className="space-y-6">
              {pillar.faqs.map((f, i) => (
                <div key={i}>
                  <h3 className="mb-1 font-semibold text-foreground">{f.q}</h3>
                  <p className="text-sm text-muted-foreground">{f.a}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="mt-10">
            <Link
              href={pillar.cta.href}
              className="inline-block rounded-md bg-brand-ocean px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              {langLabel[loc]} →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default async function GuidePage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const pillar = getPillarBySlug(slug);
  if (!pillar) notFound();
  const loc = locale as Locale;
  return <PillarBody pillar={pillar} loc={loc} />;
}
