import type { Metadata } from 'next';
import {
  SITE_NAME,
  SITE_URL,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  CONTACT_ADDRESS
} from '@/lib/constants';
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
    alternates: {
      canonical: url,
      languages: {
        en: `${SITE_URL}/en${path ? `/${path.replace(/^\//, '')}` : ''}`,
        ru: `${SITE_URL}/ru${path ? `/${path.replace(/^\//, '')}` : ''}`,
        es: `${SITE_URL}/es${path ? `/${path.replace(/^\//, '')}` : ''}`,
        'x-default': `${SITE_URL}/en${path ? `/${path.replace(/^\//, '')}` : ''}`
      }
    },
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

export function buildOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/images/hero/hero-1.jpg`,
    email: CONTACT_EMAIL,
    telephone: CONTACT_PHONE,
    address: {
      '@type': 'PostalAddress',
      streetAddress: CONTACT_ADDRESS,
      addressLocality: 'Guangzhou',
      addressRegion: 'Guangdong',
      addressCountry: 'CN'
    }
  };
}

export function buildWebSiteJsonLd(locale = 'en') {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: `${SITE_URL}/${locale}`,
    inLanguage: locale,
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL }
  };
}

export function buildCollectionPageJsonLd(opts: {
  name: string;
  description: string;
  url: string;
  locale?: string;
  items?: { name: string; url: string }[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: opts.name,
    description: opts.description,
    url: opts.url,
    ...(opts.locale ? { inLanguage: opts.locale } : {}),
    ...(opts.items && opts.items.length
      ? {
          mainEntity: {
            '@type': 'ItemList',
            numberOfItems: opts.items.length,
            itemListElement: opts.items.map((it, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: it.name,
              url: it.url
            }))
          }
        }
      : {})
  };
}

export function buildWebPageJsonLd(opts: {
  type: string;
  name: string;
  description: string;
  url: string;
  locale?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': opts.type,
    name: opts.name,
    description: opts.description,
    url: opts.url,
    ...(opts.locale ? { inLanguage: opts.locale } : {})
  };
}
