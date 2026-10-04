import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants';
import { getAllProductSlugs, getAllBlogSlugs, blogPosts } from '@/lib/data';

const locales = ['en', 'ru', 'es'] as const;

const staticPages = ['', '/products', '/projects', '/blog', '/about', '/contact'];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const page of staticPages) {
      entries.push({
        url: `${SITE_URL}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'weekly' : 'monthly',
        priority: page === '' ? 1 : 0.8
      });
    }

    for (const slug of getAllProductSlugs()) {
      entries.push({
        url: `${SITE_URL}/${locale}/products/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9
      });
    }

    for (const slug of getAllBlogSlugs()) {
      const post = blogPosts.find((p) => p.slug === slug);
      entries.push({
        url: `${SITE_URL}/${locale}/blog/${slug}`,
        lastModified: post?.updatedAt
          ? new Date(post.updatedAt)
          : post?.publishedAt
            ? new Date(post.publishedAt)
            : new Date(),
        changeFrequency: 'weekly',
        priority: 0.7
      });
    }
  }

  return entries;
}
