import { getTranslations, setRequestLocale } from 'next-intl/server';
import { HeroCarousel } from '@/components/home/hero-carousel';
import { CompareScrollNarrative } from '@/components/home/compare-scroll-narrative';
import { CategoryGrid } from '@/components/home/category-grid';
import { StatsSection } from '@/components/home/stats-section';
import { FeaturedProducts } from '@/components/home/featured-products';
import { ProjectsSection } from '@/components/home/projects-section';
import { AboutSectionClient } from '@/components/home/about-section-client';
import { FaqSectionServer } from '@/components/faq/faq-section-server';
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
  const t = await getTranslations({ locale, namespace: 'metadata' });
  return buildMetadata({
    title: t('title'),
    description: t('description'),
    path: '',
    locale,
    keywords: t('keywords')
  });
}

export default async function HomePage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;

  return (
    <>
      <HeroCarousel locale={loc} />
      <CompareScrollNarrative />
      <CategoryGrid locale={loc} />
      <StatsSection locale={loc} />
      <FeaturedProducts locale={loc} />
      <ProjectsSection locale={loc} />
      <AboutSectionClient />
      <FaqSectionServer locale={loc} />
    </>
  );
}
