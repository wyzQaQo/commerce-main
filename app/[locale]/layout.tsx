import localFont from 'next/font/local';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { WhatsAppFloat } from '@/components/layout/whatsapp-float';
import { RfqProvider } from '@/components/rfq/rfq-provider';
import { ScrollProgressBar } from '@/components/motion/scroll-progress-bar';
import { TranslateGuard } from '@/components/layout/translate-guard';
import { JsonLd } from '@/components/seo/json-ld';
import { buildOrganizationJsonLd, buildWebSiteJsonLd } from '@/lib/metadata';
import '@/app/globals.css';

const inter = localFont({
  src: [
    { path: '../../fonts/inter-latin-400.woff2', weight: '400', style: 'normal' },
    { path: '../../fonts/inter-latin-500.woff2', weight: '500', style: 'normal' },
    { path: '../../fonts/inter-latin-600.woff2', weight: '600', style: 'normal' },
    { path: '../../fonts/inter-latin-700.woff2', weight: '700', style: 'normal' },
    { path: '../../fonts/inter-cyrillic-400.woff2', weight: '400', style: 'normal' },
    { path: '../../fonts/inter-cyrillic-500.woff2', weight: '500', style: 'normal' },
    { path: '../../fonts/inter-cyrillic-600.woff2', weight: '600', style: 'normal' },
    { path: '../../fonts/inter-cyrillic-700.woff2', weight: '700', style: 'normal' }
  ],
  variable: '--font-inter',
  display: 'swap'
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={inter.variable} suppressHydrationWarning translate="no">
      <body className="min-h-screen font-sans antialiased" suppressHydrationWarning>
        {/* locale is explicit: the client provider otherwise falls back to the
            default locale, which is how a Russian visitor got an English nav. */}
        <NextIntlClientProvider messages={messages} locale={locale}>
          {/* Site-wide entity graph: one Organization + one WebSite node. */}
          <JsonLd data={buildOrganizationJsonLd()} />
          <JsonLd data={buildWebSiteJsonLd(locale)} />
          <RfqProvider>
            <ScrollProgressBar />
            <Navbar />
            <main>{children}</main>
            <Footer />
            <WhatsAppFloat />
            <TranslateGuard />
          </RfqProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
