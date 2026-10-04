import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL } from '@/lib/constants';
interface BuildMetadataOptions {
  title: string;
  description: string;
  path?: string;
  locale?: string;
  keywords?: string | string[];
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
}

export function buildMetadata({
  title,
  description,
  path = '',
  locale = 'en',
  keywords,
  image = '/images/hero/hero-1.jpg',
  type = 'website',
  publishedTime,
  modifiedTime
}: BuildMetadataOptions): Metadata {
  const url = `${SITE_URL}/${locale}${path ? `/${path.replace(/^\//, '')}` : ''}`;
  const keywordStr = Array.isArray(keywords) ? keywords.join(', ') : keywords;
  return {
    title,
    description,
    keywords: keywordStr,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale,
      type,
      images: [{ url: image.startsWith('http') ? image : `${SITE_URL}${image}` }],
      ...(type === 'article' && publishedTime
        ? { publishedTime, modifiedTime: modifiedTime ?? publishedTime }
        : {})
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description
    }
  };
}

export function buildProductJsonLd(product: {
  name: string;
  description: string;
  sku: string;
  url?: string;
  image?: string;
  images?: string[];
  brand?: string;
  priceMin: number;
  priceMax: number;
}) {
  const images = product.images ?? (product.image ? [product.image] : []);
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    sku: product.sku,
    ...(product.url ? { url: product.url } : {}),
    image: images.map((img) => (img.startsWith('http') ? img : `${SITE_URL}${img}`)),
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      lowPrice: product.priceMin,
      highPrice: product.priceMax,
      availability: 'https://schema.org/InStock'
    },
    brand: { '@type': 'Brand', name: product.brand ?? SITE_NAME }
  };
}

export function buildArticleJsonLd(article: {
  title: string;
  description: string;
  url: string;
  image: string;
  publishedAt: string;
  locale?: string;
  author?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image.startsWith('http') ? article.image : `${SITE_URL}${article.image}`,
    datePublished: article.publishedAt,
    author: article.author
      ? { '@type': 'Person', name: article.author }
      : { '@type': 'Organization', name: SITE_NAME },
    publisher: { '@type': 'Organization', name: SITE_NAME },
    mainEntityOfPage: article.url,
    ...(article.locale ? { inLanguage: article.locale } : {})
  };
}

export function buildBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url
    }))
  };
}
