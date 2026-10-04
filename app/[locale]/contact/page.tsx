import { getTranslations, setRequestLocale } from 'next-intl/server';
import { InquiryForm } from '@/components/inquiry-form';
import { CONTACT_ADDRESS, CONTACT_EMAIL, CONTACT_PHONE } from '@/lib/constants';
import { buildMetadata } from '@/lib/metadata';

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ru' }, { locale: 'es' }];
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });
  return buildMetadata({
    title: t('title'),
    description: t('description'),
    path: '/contact',
    locale
  });
}

export default async function ContactPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('contact');

  return (
    <div className="section-padding">
      <div className="container grid gap-12 lg:grid-cols-2">
        <div>
          <h1 className="mb-3 text-3xl font-bold md:text-4xl">{t('title')}</h1>
          <p className="mb-8 text-muted-foreground">{t('description')}</p>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li>{CONTACT_ADDRESS}</li>
            <li>{CONTACT_EMAIL}</li>
            <li>{CONTACT_PHONE}</li>
          </ul>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-card">
          <InquiryForm />
        </div>
      </div>
    </div>
  );
}
