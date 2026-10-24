import whyArtificialPalms from '@/content/blog/why-artificial-palms-for-hotels.md';
import uvResistantGuide from '@/content/blog/uv-resistant-materials-guide.md';
import wholesaleOrderingTips from '@/content/blog/wholesale-ordering-tips.md';
import whyArtificialPalmsRu from '@/content/blog/ru/why-artificial-palms-for-hotels.md';
import uvResistantGuideRu from '@/content/blog/ru/uv-resistant-materials-guide.md';
import wholesaleOrderingTipsRu from '@/content/blog/ru/wholesale-ordering-tips.md';
import whyArtificialPalmsEs from '@/content/blog/es/why-artificial-palms-for-hotels.md';
import uvResistantGuideEs from '@/content/blog/es/uv-resistant-materials-guide.md';
import wholesaleOrderingTipsEs from '@/content/blog/es/wholesale-ordering-tips.md';
import { getBlogPostBySlug } from '@/lib/data';

const EN_CONTENT: Record<string, string> = {
  'why-artificial-palms-for-hotels.md': whyArtificialPalms,
  'uv-resistant-materials-guide.md': uvResistantGuide,
  'wholesale-ordering-tips.md': wholesaleOrderingTips
};

const CONTENT_BY_LOCALE: Record<string, Record<string, string>> = {
  en: EN_CONTENT,
  ru: {
    'why-artificial-palms-for-hotels.md': whyArtificialPalmsRu,
    'uv-resistant-materials-guide.md': uvResistantGuideRu,
    'wholesale-ordering-tips.md': wholesaleOrderingTipsRu
  },
  es: {
    'why-artificial-palms-for-hotels.md': whyArtificialPalmsEs,
    'uv-resistant-materials-guide.md': uvResistantGuideEs,
    'wholesale-ordering-tips.md': wholesaleOrderingTipsEs
  }
};

/**
 * Edge-safe: markdown is bundled at build time, no fs/path at runtime.
 *
 * The body used to come from a single English file for every locale, so /ru and
 * /es articles rendered English prose under a translated title. Each locale now
 * has its own body under `content/blog/<locale>/`.
 *
 * The markdown files open with their own `# Title` line, but the page already
 * renders the localised title as the single <h1>. Left in place the document
 * would carry two H1s, so the leading heading is stripped here and the body
 * starts at the first paragraph. The localised bodies omit the title line
 * entirely, which the same regex tolerates.
 */
export function getBlogContent(slug: string, locale = 'en'): string {
  const post = getBlogPostBySlug(slug);
  if (!post) return '';
  // Both maps are indexed with a noUncheckedIndexedAccess-safe fallback: a
  // locale that has no body for this post falls back to the English text.
  const byLocale: Record<string, string> = CONTENT_BY_LOCALE[locale] ?? EN_CONTENT;
  const raw = byLocale[post.contentFile] ?? EN_CONTENT[post.contentFile] ?? '';
  return raw.replace(/^\s*#\s+.*(?:\r?\n)+/, '');
}
