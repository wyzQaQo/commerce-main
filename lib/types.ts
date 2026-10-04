export type Locale = 'en' | 'ru' | 'es';

export type LocalizedString = Record<Locale, string>;

export interface PackagingSpec {
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  weightKg: number;
  piecesPerCarton: number;
}

export interface Certification {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
}

export interface Category {
  id: string;
  slug: string;
  name: LocalizedString;
  description: LocalizedString;
  image: string;
  brand?: string;
}

export interface ProductSpec {
  label: LocalizedString;
  value: LocalizedString;
}

export interface Product {
  id: string;
  slug: string;
  sku: string;
  name: LocalizedString;
  description: LocalizedString;
  shortDescription: LocalizedString;
  /** 可选 SEO 关键词 */
  seoKeywords?: LocalizedString;
  categoryId: string;
  brand: string;
  priceMin: number;
  priceMax: number;
  images: string[];
  specs: ProductSpec[];
  packaging: PackagingSpec;
  installationGuide: LocalizedString;
  certifications: Certification[];
  featured?: boolean;
  tags?: string[];
}

export interface FaqItem {
  id: string;
  question: LocalizedString;
  answer: LocalizedString;
  category?: 'general' | 'product' | 'installation';
}

export interface Project {
  id: string;
  slug: string;
  title: LocalizedString;
  region: LocalizedString;
  summary: LocalizedString;
  image: string;
  featured?: boolean;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: LocalizedString;
  excerpt: LocalizedString;
  /** 每语言 SEO 关键词，用于 meta keywords */
  keywords?: LocalizedString;
  coverImage: string;
  publishedAt: string;
  updatedAt?: string;
  author: string;
  contentFile: string;
}

export interface HeroSlide {
  id: string;
  image: string;
  title: LocalizedString;
  subtitle: LocalizedString;
  cta: LocalizedString;
}

export interface StatItem {
  id: string;
  value: string;
  label: LocalizedString;
}

export interface AboutTimelineEntry {
  year: string;
  text: LocalizedString;
}

export interface AboutCertificateEntry {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
}

export interface AboutGalleryEntry {
  src: string;
  caption: LocalizedString;
}

export interface AboutContent {
  introImage: string;
  timeline: AboutTimelineEntry[];
  certificates: AboutCertificateEntry[];
  gallery: AboutGalleryEntry[];
  factoryPhotos: AboutGalleryEntry[];
}
