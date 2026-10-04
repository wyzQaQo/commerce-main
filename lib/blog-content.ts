import whyArtificialPalms from '@/content/blog/why-artificial-palms-for-hotels.md';
import uvResistantGuide from '@/content/blog/uv-resistant-materials-guide.md';
import wholesaleOrderingTips from '@/content/blog/wholesale-ordering-tips.md';
import { getBlogPostBySlug } from '@/lib/data';

const CONTENT_BY_FILE: Record<string, string> = {
  'why-artificial-palms-for-hotels.md': whyArtificialPalms,
  'uv-resistant-materials-guide.md': uvResistantGuide,
  'wholesale-ordering-tips.md': wholesaleOrderingTips
};

/** Edge-safe: markdown is bundled at build time, no fs/path at runtime. */
export function getBlogContent(slug: string): string {
  const post = getBlogPostBySlug(slug);
  if (!post) return '';
  return CONTENT_BY_FILE[post.contentFile] ?? '';
}
