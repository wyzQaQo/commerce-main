import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants';

/** AI crawlers are named explicitly; a wildcard-only file is ambiguous. */
const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-User',
  'Claude-SearchBot',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'CCBot',
  'meta-externalagent',
  'Bytespider',
  'Amazonbot',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/']
      },
      {
        userAgent: AI_CRAWLERS,
        allow: '/',
        disallow: ['/api/']
      }
    ],
    sitemap: `${SITE_URL}/sitemap.xml`
  };
}
