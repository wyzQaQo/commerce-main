import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants';
import { getAllProductSlugs, getAllBlogSlugs, blogPosts } from '@/lib/data';

const locales = ['en', 'ru', 'es'] as const;

const staticPages = ['', '/products', '/projects', '/blog', '/about', '/contact'];

/**
 * Build the `alternates.languages` map for one path.
 *
 * Next renders this as xhtml:link hreflang pairs in sitemap.xml, which is the
 * canonical hreflang source for crawlers. The locale list is the routing list
 * (i18n/routing.ts); routes here are not pathname-localised, so every locale
 * shares the same segment and only the prefix changes.
 */
function languageAlternates(path: string) {
  return {
    languages: Object.fromEntries(
      locales.map((locale) => [locale, `${SITE_URL}/${locale}${path}`])
    ) as Record<(typeof locales)[number], string>
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const page of staticPages) {
      entries.push({
        url: `${SITE_URL}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'weekly' : 'monthly',
        priority: page === '' ? 1 : 0.8,
        alternates: languageAlternates(page)
      });
    }

    for (const slug of getAllProductSlugs()) {
      const path = `/products/${slug}`;
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
        alternates: languageAlternates(path)
      });
    }

    for (const slug of getAllBlogSlugs()) {
      const post = blogPosts.find((p) => p.slug === slug);
      const path = `/blog/${slug}`;
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: post?.updatedAt
          ? new Date(post.updatedAt)
          : post?.publishedAt
            ? new Date(post.publishedAt)
            : new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
        alternates: languageAlternates(path)
      });
    }
  }

  return entries;
}
