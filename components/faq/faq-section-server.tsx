import { getTranslations } from 'next-intl/server';
import { FaqSection } from '@/components/faq/faq-section';
import { getFaqItems, buildFaqItems } from '@/lib/data';
import type { Locale } from '@/lib/types';

interface FaqSectionServerProps {
  locale: Locale;
  variant?: 'default' | 'sidebar';
  limit?: number;
}

export async function FaqSectionServer({
  locale,
  variant = 'default',
  limit
}: FaqSectionServerProps) {
  const t = await getTranslations('faq');
  const items = buildFaqItems(getFaqItems(limit), locale);

  return (
    <FaqSection
      title={t('title')}
      subtitle={variant === 'default' ? t('subtitle') : undefined}
      items={items}
      variant={variant}
    />
  );
}
