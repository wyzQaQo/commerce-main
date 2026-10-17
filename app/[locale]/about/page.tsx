import { getTranslations, setRequestLocale } from 'next-intl/server';
import { buildMetadata, buildWebPageJsonLd, buildBreadcrumbJsonLd } from '@/lib/metadata';
import { JsonLd } from '@/components/seo/json-ld';
import { SITE_URL } from '@/lib/constants';
import { AboutHero } from '@/components/about/about-hero';
import { AboutPageContent } from '@/components/about/about-page-content';
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
  const t = await getTranslations({ locale, namespace: 'about' });
  return buildMetadata({
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
    path: '/about',
    locale
  });
}

export default async function AboutPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('about');
  const aboutLd = buildWebPageJsonLd({
    type: 'AboutPage',
    name: t('title'),
    description: t('description'),
    url: `${SITE_URL}/${locale}/about`,
    locale
  });
  const breadcrumbLd = buildBreadcrumbJsonLd([
    { name: 'Home', url: `${SITE_URL}/${locale}` },
    { name: t('title'), url: `${SITE_URL}/${locale}/about` }
  ]);

  return (
    <>
      <JsonLd data={aboutLd} />
      <JsonLd data={breadcrumbLd} />
      <AboutHero
        founded={t('founded')}
        legalName={t('legalName')}
        title={t('heading')}
        description={t('description')}
      />
      <AboutPageContent locale={locale as Locale} />
    </>
  );
}
