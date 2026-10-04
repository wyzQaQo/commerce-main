import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Link } from '@/i18n/routing';
import { getBlogPostBySlug, getLocalized, getAllBlogSlugs } from '@/lib/data';
import { getBlogContent } from '@/lib/blog-content';
import { buildMetadata, buildArticleJsonLd, buildBreadcrumbJsonLd } from '@/lib/metadata';
import { JsonLd } from '@/components/seo/json-ld';
import { SITE_URL } from '@/lib/constants';
import type { Locale } from '@/lib/types';

export function generateStaticParams() {
  const locales: Locale[] = ['en', 'ru', 'es'];
  return locales.flatMap((locale) =>
    getAllBlogSlugs().map((slug) => ({ locale, slug }))
  );
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return {};
  const loc = locale as Locale;
  const title = getLocalized(post.title, loc);
  const description = getLocalized(post.excerpt, loc);
  const keywordsRaw = post.keywords ? getLocalized(post.keywords, loc) : '';
  const keywords = keywordsRaw
    ? keywordsRaw.split(',').map((k) => k.trim()).filter(Boolean)
    : undefined;

  return buildMetadata({
    title,
    description,
    path: `/blog/${slug}`,
    locale,
    image: post.coverImage,
    keywords,
    type: 'article',
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt || post.publishedAt
  });
}

export default async function BlogPostPage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const t = await getTranslations('blog');
  const loc = locale as Locale;
  const content = getBlogContent(slug);
  const title = getLocalized(post.title, loc);
  const description = getLocalized(post.excerpt, loc);
  const pageUrl = `${SITE_URL}/${locale}/blog/${slug}`;

  const articleLd = buildArticleJsonLd({
    title,
    description,
    url: pageUrl,
    image: post.coverImage,
    publishedAt: post.publishedAt,
    author: post.author
  });

  const breadcrumbLd = buildBreadcrumbJsonLd([
    { name: 'Home', url: `${SITE_URL}/${locale}` },
    { name: 'Blog', url: `${SITE_URL}/${locale}/blog` },
    { name: title, url: pageUrl }
  ]);

  return (
    <article className="section-padding">
      <JsonLd data={articleLd} />
      <JsonLd data={breadcrumbLd} />
      <div className="container max-w-4xl">
        <Link
          href="/blog"
          className="mb-6 inline-block text-sm font-semibold text-brand-ocean hover:underline"
        >
          ← {t('backToList')}
        </Link>

        <div className="relative mb-8 aspect-[21/9] overflow-hidden rounded-lg">
          <Image
            src={post.coverImage}
            alt={getLocalized(post.title, loc)}
            fill
            className="object-cover"
            sizes="896px"
            priority
          />
        </div>

        <time className="text-sm text-brand-ocean">
          {new Date(post.publishedAt).toLocaleDateString(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </time>
        <h1 className="mb-8 mt-2 text-3xl font-bold md:text-4xl">
          {getLocalized(post.title, loc)}
        </h1>

        <div className="prose prose-lg max-w-none prose-headings:text-brand-navy prose-a:text-brand-ocean">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
      </div>
    </article>
  );
}
