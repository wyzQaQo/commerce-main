import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { getPillarBySlug, getAllPillarSlugs } from '@/lib/pillars';
import type { Locale } from '@/lib/types';

export function generateStaticParams() {
  return (['en', 'ru', 'es', 'it'] as Locale[]).map((locale) => ({ locale }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return {
    title: 'Guides — Palm Grass Pro',
    description:
      'Buyer guides for synthetic thatch: fire ratings, South Africa pricing, and installation.',
    alternates: { canonical: `https://100tiki.com/${locale}/guides` }
  };
}

export default async function GuidesIndex({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;
  const slugs = getAllPillarSlugs();

  return (
    <div className="section-padding">
      <div className="container max-w-screen-lg">
        <h1 className="mb-4 text-3xl font-bold md:text-4xl">Guides</h1>
        <p className="mb-8 text-lg text-muted-foreground">
          Buyer guides for synthetic thatch roofing — fire ratings, South Africa
          import pricing, and installation.
        </p>
        <ul className="space-y-4">
          {slugs.map((slug) => {
            const p = getPillarBySlug(slug)!;
            return (
              <li key={slug}>
                <Link
                  href={`/guides/${slug}`}
                  className="font-semibold text-brand-navy hover:text-brand-ocean hover:underline"
                >
                  {p.h1}
                </Link>
                <p className="text-sm text-muted-foreground">{p.description}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
