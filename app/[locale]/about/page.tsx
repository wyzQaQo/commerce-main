import { getTranslations, setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/lib/metadata';
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

  return (
    <>
      <AboutHero
        founded={t('founded')}
        legalName={t('legalName')}
        title={t('title')}
        description={t('description')}
      />
      <AboutPageContent locale={locale as Locale} />
    </>
  );
}
