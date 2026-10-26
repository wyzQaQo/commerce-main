import type { Metadata } from 'next';
import {
  SITE_NAME,
  SITE_URL,
  SITE_TAGLINE,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  CONTACT_ADDRESS
} from '@/lib/constants';

/** Locale list for hreflang alternates; mirrors i18n/routing.ts. */
const LOCALES = ['en', 'ru', 'es', 'it', 'id', 'ja', 'fr', 'de'] as const;

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

const TITLE_MAX = 65;
const DESC_MAX = 165;

/**
 * Trim at a word boundary. The non-product routes (projects, blog, contact)
 * were authored with 30-54 character descriptions — shorter than the ~70 a
 * SERP will actually show — and the copy rewritten for them lands at 146-171,
 * so the top end needs a ceiling as well as a floor.
 */
function clamp(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const space = cut.lastIndexOf(' ');
  return (space > max * 0.6 ? cut.slice(0, space) : cut).replace(/[\s|,–—-]+$/, '');
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
  // Clamped centrally: /en/blog, /es/products and /es/projects each measured 66
  // characters, one over the limit, and the rewritten descriptions need the
  // same ceiling.
  const t = clamp(title, TITLE_MAX);
  const d = clamp(description, DESC_MAX);
  return {
    title: t,
    description: d,
    keywords: keywordStr,
    // Canonical plus hreflang alternates; locale list mirrors i18n/routing.ts.
    alternates: {
      canonical: url,
      languages: Object.fromEntries(
        LOCALES.map((l) => [
          l,
          `${SITE_URL}/${l}${path ? `/${path.replace(/^\//, '')}` : ''}`
        ])
      ) as Record<(typeof LOCALES)[number], string>
    },
    openGraph: {
      title: t,
      description: d,
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
      title: t,
      description: d
    }
  };
}

/**
 * Product schema tuned for answer-engine extraction.
 *
 * Beyond the merchant basics (name/image/offers) this emits the fields AI
 * systems actually read when answering "what is X" and "X vs Y" queries:
 *   - `description` is the answer_lead, not the marketing blurb, so the
 *     structured description and the visible lead paragraph agree.
 *   - `additionalProperty` carries every spec key as a PropertyValue, giving
 *     the spec table a machine-readable twin.
 *   - `material`, `audience` and `keywords` widen entity matching.
 *   - `offers` repeats the page url and seller so the price node stands alone.
 */
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
  /** Page url, repeated on the offers node. Defaults to `url`. */
  offerUrl?: string;
  category?: string;
  material?: string;
  keywords?: string[];
  audience?: string;
  /** Every spec row as {label, value}; emitted as PropertyValue. */
  properties?: { label: string; value: string }[];
}) {
  const images = product.images ?? (product.image ? [product.image] : []);
  const imageUrls = images.map((img) =>
    img.startsWith('http') ? img : `${SITE_URL}${img}`
  );
  const offerUrl = product.offerUrl ?? product.url;
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    ...(product.url ? { '@id': `${product.url}#product`, url: product.url } : {}),
    name: product.name,
    description: product.description,
    sku: product.sku,
    image: imageUrls,
    ...(product.category ? { category: product.category } : {}),
    ...(product.material ? { material: product.material } : {}),
    ...(product.keywords && product.keywords.length > 0
      ? { keywords: product.keywords.join(', ') }
      : {}),
    ...(product.audience
      ? {
          audience: {
            '@type': 'BusinessAudience',
            audienceType: product.audience
          }
        }
      : {}),
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: Math.round((product.priceMin + product.priceMax) / 2),
      lowPrice: product.priceMin,
      highPrice: product.priceMax,
      priceValidUntil: '2027-12-31',
      availability: 'https://schema.org/InStock',
      ...(offerUrl ? { url: offerUrl } : {}),
      seller: { '@id': `${SITE_URL}/#organization` }
    },
    brand: { '@type': 'Brand', name: product.brand ?? SITE_NAME },
    manufacturer: { '@id': `${SITE_URL}/#organization` },
    ...(product.properties && product.properties.length > 0
      ? {
          additionalProperty: product.properties.map((p) => ({
            '@type': 'PropertyValue',
            name: p.label,
            value: p.value
          }))
        }
      : {})
  };
}

/**
 * Lowercase the first letter unless the word is an acronym or proper noun
 * ("8–15+ years", "PE/nylon", "Class B1" stay untouched where it matters).
 */
function lowerFirst(text: string): string {
  if (text.length === 0) return text;
  if (/^[A-Z]{2,}/.test(text)) return text;
  return text.charAt(0).toLowerCase() + text.slice(1);
}

export interface ProductFaqQuestions {
  whereUsed: string;
  fireRating: string;
  lifespan: string;
  maintenance: string;
}

const DEFAULT_FAQ_QUESTIONS: ProductFaqQuestions = {
  whereUsed: 'Where is {name} used?',
  fireRating: 'What fire rating does {name} have?',
  lifespan: 'How long does {name} last?',
  maintenance: 'How much maintenance does {name} require?'
};

/**
 * FAQPage built only from the blocks the product page actually renders.
 *
 * Google requires the marked-up answer to be present in visible copy, so each
 * question is derived from the use-case list or the comparison table rather
 * than from a separate copy deck. Question wording comes from the caller so the
 * markup language matches the answers (and the page).
 */
export function generateProductFAQSchema(input: {
  name: string;
  useCases: { scenario: string; detail: string }[];
  comparison: {
    oursLabel: string;
    alternativeLabel: string;
    rows: { dimension: string; ours: string; alternative: string }[];
  } | null;
  fireRating?: string;
  serviceLife?: string;
  /** Localised question templates; each may contain {name}. */
  questions?: Partial<ProductFaqQuestions>;
}) {
  const templates = { ...DEFAULT_FAQ_QUESTIONS, ...input.questions };
  const ask = (template: string) =>
    template.replace(/\{name\}/g, input.name);

  const questions: {
    '@type': 'Question';
    name: string;
    acceptedAnswer: { '@type': 'Answer'; text: string };
  }[] = [];

  if (input.useCases.length > 0) {
    questions.push({
      '@type': 'Question',
      name: ask(templates.whereUsed),
      acceptedAnswer: {
        '@type': 'Answer',
        text: input.useCases
          .map((uc) => `${uc.scenario}: ${uc.detail}`)
          .join(' ')
      }
    });
  }

  const findRow = (needles: string[]) =>
    input.comparison?.rows.find((r) =>
      needles.some((n) => r.dimension.toLowerCase().includes(n))
    );

  const fireRow = findRow(['fire', 'ignífug', 'огнестойк']);
  if (fireRow || input.fireRating) {
    // The spec value ("Class B1 optional") and the comparison row usually
    // restate the same rating; when both name the same class, keep the more
    // detailed one instead of stacking two versions of it.
    const spec = input.fireRating;
    const compared = fireRow?.ours;
    const rating = (text?: string) => text?.match(/\b([A-Z]\d)\b/)?.[1];
    const text =
      spec && compared
        ? rating(spec) && rating(spec) === rating(compared)
          ? (compared.length >= spec.length ? compared : spec)
          : `${spec}. ${compared}`
        : spec || compared || '';
    questions.push({
      '@type': 'Question',
      name: ask(templates.fireRating),
      acceptedAnswer: { '@type': 'Answer', text }
    });
  }

  const lifeRow = findRow(['life', 'vida', 'срок']);
  if (lifeRow || input.serviceLife) {
    // The page passes the life row's own value as `serviceLife`, so drop the
    // duplicate rather than repeating the same sentence in the answer. The
    // alternative is quoted as "label: value" because the rows are phrases,
    // not verb phrases, and must read correctly in every locale.
    const alternative = lifeRow
      ? `${input.comparison?.alternativeLabel}: ${lowerFirst(lifeRow.alternative)}.`
      : null;
    // The life values are noun phrases, so a full stop keeps them readable
    // when joined ("… PE/nylon. Natural palm thatch: 2–4 years …").
    const segments = [
      input.serviceLife ? `${input.serviceLife.replace(/[.;]$/, '')}.` : null,
      lifeRow?.ours !== input.serviceLife ? lifeRow?.ours : null,
      alternative
    ].filter(Boolean);
    questions.push({
      '@type': 'Question',
      name: ask(templates.lifespan),
      acceptedAnswer: {
        '@type': 'Answer',
        text: segments.join(' ')
      }
    });
  }

  const maintRow = findRow(['maintenance', 'mantenimiento', 'обслужив']);
  if (maintRow) {
    questions.push({
      '@type': 'Question',
      name: ask(templates.maintenance),
      acceptedAnswer: { '@type': 'Answer', text: maintRow.ours }
    });
  }

  if (questions.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions
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

/**
 * Site-wide entity graph. Emitted once from the locale layout so every page
 * — home, product, blog — carries the same Organization node and the same
 * WebSite node, and page-level schemas can reference them by @id.
 */
export function buildOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    alternateName: '100Tiki',
    url: SITE_URL,
    description: SITE_TAGLINE,
    email: CONTACT_EMAIL,
    telephone: CONTACT_PHONE,
    address: {
      '@type': 'PostalAddress',
      streetAddress: CONTACT_ADDRESS,
      addressLocality: 'Guangzhou',
      addressRegion: 'Guangdong',
      addressCountry: 'CN'
    },
    areaServed: { '@type': 'Place', name: 'Worldwide' },
    knowsAbout: [
      'Artificial thatch roofing',
      'Synthetic palm thatch panels',
      'Nipa thatch roofing',
      'Fire-retardant thatch',
      'Resort roofing materials',
      'Tiki hut roofing'
    ]
  };
}

export function buildWebSiteJsonLd(locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: `${SITE_URL}/${locale}`,
    name: SITE_NAME,
    description: SITE_TAGLINE,
    inLanguage: locale,
    publisher: { '@id': `${SITE_URL}/#organization` }
  };
}
