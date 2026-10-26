import categoriesData from '@/data/categories.json';
import productsData from '@/data/products.json';
import projectsData from '@/data/projects.json';
import blogData from '@/data/blog.json';
import heroData from '@/data/hero.json';
import statsData from '@/data/stats.json';
import faqData from '@/data/faq.json';
import aboutData from '@/data/about.json';
import {
  DEFAULT_PACKAGING,
  PACKAGING_BY_CATEGORY
} from './shipping';
import type {
  BlogPost,
  Category,
  FaqItem,
  AboutContent,
  HeroSlide,
  Locale,
  PackagingSpec,
  Product,
  Project,
  StatItem
} from './types';

export const categories = categoriesData as Category[];
export const products = (productsData as Partial<Product>[]).map((p) =>
  enrichProduct(p as Product)
);
export const projects = projectsData as Project[];
export const blogPosts = blogData as BlogPost[];
export const heroSlides = heroData as HeroSlide[];
export const stats = statsData as StatItem[];
export const faqItems = faqData as FaqItem[];
export const aboutContent = aboutData as AboutContent;

function enrichProduct(p: Partial<Product> & Pick<Product, 'id' | 'slug' | 'sku' | 'name' | 'description' | 'shortDescription' | 'categoryId' | 'brand' | 'priceMin' | 'priceMax' | 'images' | 'specs'>): Product {
  const packaging =
    p.packaging ??
  PACKAGING_BY_CATEGORY[p.categoryId] ??
    DEFAULT_PACKAGING;

  return {
    ...p,
    packaging,
    installationGuide: p.installationGuide ?? defaultInstallationGuide(),
    certifications:
      p.certifications && p.certifications.length > 0
        ? p.certifications
        : defaultCertifications()
  } as Product;
}

function defaultInstallationGuide(): Product['installationGuide'] {
  return {
    en: `## Installation Overview\n\n1. Ensure roof pitch is 25°–45° for optimal drainage.\n2. Install battens at 30 cm centers perpendicular to rafters.\n3. Fix tiles with stainless screws; overlap rows by 12 cm.\n4. Seal ridge caps with UV-resistant adhesive.\n\nFull PDF drawings available upon order confirmation.`,
    ru: `## Монтаж\n\n1. Уклон кровли 25°–45°\n2. Обрешётка с шагом 30 см.\n3. Крепление нержавеющими саморезами, нахлёст 12 см.\n4. Конёк с UV-клеем.\n\nPDF-чертежи после подтверждения заказа.`,
    es: `## Instalación\n\n1. Pendiente 25°–45°\n2. Rastreles cada 30 cm.\n3. Fijar con tornillos inox, solape 12 cm.\n4. Cumbrera con adhesivo UV.\n\nPlanos PDF tras confirmar pedido.`,
    it: `## Panoramica dell\'installazione\n\n1. Pendenza 25°–45°\n2. Rastreles ogni 30 cm.\n3. Fissare con viti inox.\n\nPDF su richiesta.`,
    id: `## Installation Overview\n\n1. Ensure roof pitch is 25°–45° for optimal drainage.\n2. Install battens at 30 cm centers perpendicular to rafters.\n3. Fix tiles with stainless screws; overlap rows by 12 cm.\n4. Seal ridge caps with UV-resistant adhesive.\n\nFull PDF drawings available upon order confirmation.`,
    ja: `## Installation Overview\n\n1. Ensure roof pitch is 25°–45° for optimal drainage.\n2. Install battens at 30 cm centers perpendicular to rafters.\n3. Fix tiles with stainless screws; overlap rows by 12 cm.\n4. Seal ridge caps with UV-resistant adhesive.\n\nFull PDF drawings available upon order confirmation.`,
    fr: `## Installation Overview\n\n1. Ensure roof pitch is 25°–45° for optimal drainage.\n2. Install battens at 30 cm centers perpendicular to rafters.\n3. Fix tiles with stainless screws; overlap rows by 12 cm.\n4. Seal ridge caps with UV-resistant adhesive.\n\nFull PDF drawings available upon order confirmation.`,
    de: `## Installation Overview\n\n1. Ensure roof pitch is 25°–45° for optimal drainage.\n2. Install battens at 30 cm centers perpendicular to rafters.\n3. Fix tiles with stainless screws; overlap rows by 12 cm.\n4. Seal ridge caps with UV-resistant adhesive.\n\nFull PDF drawings available upon order confirmation.`,
  };
}

function defaultCertifications(): Product['certifications'] {
  return [
    {
      id: 'cert-b1',
      title: {
        en: 'Fire-Retardant Class B1',
        ru: 'Огнестойкость B1',
        es: 'Ignífugo Clase B1',
        it: 'Ignifugo Classe B1',
        id: 'Fire-Retardant Class B1',
        ja: 'Fire-Retardant Class B1',
        fr: 'Fire-Retardant Class B1',
        de: 'Fire-Retardant Class B1',
      },
      description: {
        en: 'DIN 4102-1 Class B1 test report available. Suitable for commercial resort applications.',
        ru: 'Протокол DIN 4102-1 B1. Для коммерческих курортов.',
        es: 'Informe DIN 4102-1 B1. Para resorts comerciales.',
        it: 'Rapporto di prova DIN 4102-1 Classe B1 disponibile. Adatto per resort commerciali.',
        id: 'DIN 4102-1 Class B1 test report available. Suitable for commercial resort applications.',
        ja: 'DIN 4102-1 Class B1 test report available. Suitable for commercial resort applications.',
        fr: 'DIN 4102-1 Class B1 test report available. Suitable for commercial resort applications.',
        de: 'DIN 4102-1 Class B1 test report available. Suitable for commercial resort applications.',
      }
    },
    {
      id: 'cert-uv',
      title: {
        en: 'UV Resistance Certificate',
        ru: 'Сертификат UV-стойкости',
        es: 'Certificado resistencia UV',
        it: 'Certificato di Resistenza UV',
        id: 'UV Resistance Certificate',
        ja: 'UV Resistance Certificate',
        fr: 'UV Resistance Certificate',
        de: 'UV Resistance Certificate',
      },
      description: {
        en: '5+ year accelerated UV aging test (ASTM G154). Color ΔE < 3 after 3000h.',
        ru: 'Ускоренное UV-старение 5+ лет (ASTM G154). ΔE < 3 после 3000 ч.',
        es: 'Envejecimiento UV 5+ años (ASTM G154). ΔE < 3 tras 3000h.',
        it: 'Test di invecchiamento UV accelerato 5+ anni (ASTM G154). Colore ΔE < 3 dopo 3000h.',
        id: '5+ year accelerated UV aging test (ASTM G154). Color ΔE < 3 after 3000h.',
        ja: '5+ year accelerated UV aging test (ASTM G154). Color ΔE < 3 after 3000h.',
        fr: '5+ year accelerated UV aging test (ASTM G154). Color ΔE < 3 after 3000h.',
        de: '5+ year accelerated UV aging test (ASTM G154). Color ΔE < 3 after 3000h.',
      }
    },
    {
      id: 'cert-iso',
      title: { en: 'ISO 9001:2015', ru: 'ISO 9001:2015', es: 'ISO 9001:2015', it: 'ISO 9001:2015', id: 'ISO 9001:2015', ja: 'ISO 9001:2015', fr: 'ISO 9001:2015', de: 'ISO 9001:2015' },
      description: {
        en: 'Factory quality management system certified.',
        ru: 'Сертифицированная система менеджмента качества.',
        es: 'Sistema de gestión de calidad certificado.',
        it: 'Sistema di gestione della qualità certificato.',
        id: 'Factory quality management system certified.',
        ja: 'Factory quality management system certified.',
        fr: 'Factory quality management system certified.',
        de: 'Factory quality management system certified.',
      }
    }
  ];
}

export function getLocalized<T extends Record<Locale, string>>(
  obj: T,
  locale: Locale
): string {
  return obj[locale] || obj.en;
}

export function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function getCategoryById(id: string) {
  return categories.find((c) => c.id === id);
}

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(categoryId: string) {
  return products.filter((p) => p.categoryId === categoryId);
}

export function getFeaturedProducts(limit = 12) {
  return products.filter((p) => p.featured).slice(0, limit);
}

export function getRelatedProducts(product: Product, limit = 4) {
  const sameCategory = products.filter(
    (p) => p.categoryId === product.categoryId && p.id !== product.id
  );
  const pool =
    sameCategory.length > 0
      ? sameCategory
      : products.filter((p) => p.id !== product.id);
  return pool.slice(0, limit);
}

export function getSiblingProducts(
  product: Product,
  limit = 3,
  excludeIds: string[] = []
) {
  const skip = new Set([product.id, ...excludeIds]);
  const sameCategory = products.filter(
    (p) => p.categoryId === product.categoryId && !skip.has(p.id)
  );
  const others = products.filter(
    (p) => p.categoryId !== product.categoryId && !skip.has(p.id)
  );
  return [...sameCategory, ...others].slice(0, limit);
}

export function getFeaturedProjects(limit = 4) {
  return projects.filter((p) => p.featured).slice(0, limit);
}

export function getProjectBySlug(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}

export function getFaqItems(limit?: number) {
  const items = [...faqItems];
  return limit ? items.slice(0, limit) : items;
}

export function buildFaqItems(items: FaqItem[], locale: Locale) {
  return items.map((item) => ({
    id: item.id,
    question: item.question[locale] || item.question.en,
    answer: item.answer[locale] || item.answer.en
  }));
}

export interface ProductFilters {
  category?: string;
  brand?: string;
  priceMin?: number;
  priceMax?: number;
  page?: number;
  perPage?: number;
}

export function filterProducts(filters: ProductFilters) {
  let result = [...products];

  if (filters.category) {
    const cat = getCategoryBySlug(filters.category);
    if (cat) {
      result = result.filter((p) => p.categoryId === cat.id);
    }
  }

  if (filters.brand) {
    result = result.filter(
      (p) => p.brand.toLowerCase() === filters.brand!.toLowerCase()
    );
  }

  if (filters.priceMin !== undefined) {
    result = result.filter((p) => p.priceMax >= filters.priceMin!);
  }

  if (filters.priceMax !== undefined) {
    result = result.filter((p) => p.priceMin <= filters.priceMax!);
  }

  const perPage = filters.perPage || 12;
  const page = filters.page || 1;
  const total = result.length;
  const totalPages = Math.ceil(total / perPage);
  const start = (page - 1) * perPage;
  const items = result.slice(start, start + perPage);

  return { items, total, totalPages, page, perPage };
}

export function getAllBrands() {
  return [...new Set(products.map((p) => p.brand))].sort();
}

export function getAllProductSlugs() {
  return products.map((p) => p.slug);
}

export function getAllBlogSlugs() {
  return blogPosts.map((p) => p.slug);
}

export function getProductPackaging(product: Product): PackagingSpec {
  return product.packaging;
}
