import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { blogPosts, getLocalized } from '@/lib/data';
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
  const t = await getTranslations({ locale, namespace: 'blog' });
  return buildMetadata({
    title: t('title'),
    description: t('description'),
    path: '/blog',
    locale
  });
}

export default async function BlogPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('blog');
  const loc = locale as Locale;

  return (
    <div className="section-padding">
      <div className="container">
        <div className="mb-10">
          <h1 className="mb-3 text-3xl font-bold md:text-4xl">{t('title')}</h1>
          <p className="text-muted-foreground">{t('description')}</p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group overflow-hidden rounded-lg border bg-white shadow-card transition-shadow hover:shadow-card-hover"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={post.coverImage}
                  alt={getLocalized(post.title, loc)}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-4">
                <h2 className="mb-2 font-semibold group-hover:text-brand-ocean">
                  {getLocalized(post.title, loc)}
                </h2>
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {getLocalized(post.excerpt, loc)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
