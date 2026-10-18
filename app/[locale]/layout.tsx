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
import '@/app/globals.css';

const inter = {
  variable: '--font-inter',
};

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
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={inter.variable} suppressHydrationWarning={true}>
      <body className="min-h-screen font-sans antialiased" suppressHydrationWarning={true}>
        <NextIntlClientProvider messages={messages}>
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
