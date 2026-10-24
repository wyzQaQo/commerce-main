import createNextIntlPlugin from 'next-intl/plugin';
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';

initOpenNextCloudflareForDev();

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/**
 * Slugs that were hard-truncated to 60 characters and now end mid-word
 * ("…-roofing-mate", "…-gazebo-constructi"). They were renamed to the full,
 * readable phrase; these entries keep every URL that was already indexed and
 * linked pointing at the new one.
 *
 * `permanent: true` emits a 308, which Next uses in place of 301 — same
 * "this move is forever, transfer the ranking signal" semantics, but it
 * preserves the request method instead of silently downgrading POST to GET.
 *
 * The locale segment is enumerated rather than matched with `:locale`
 * because next-intl's prefix set is fixed, and an explicit list cannot
 * accidentally swallow a future product whose slug starts with a locale code.
 */
const LEGACY_PRODUCT_SLUGS = {
  'island-country-tropical-style-artificial-thatch-roofing-mate':
    'island-country-tropical-artificial-thatch-roofing-material',
  'plastic-thatch-roof-tiles-for-private-home-gazebo-constructi':
    'plastic-thatch-roof-tiles-gazebo-construction-png',
  'plastic-coconut-thatch-roof-products-be-customized-for-your-':
    'custom-plastic-coconut-thatch-roof-resort-seaview-villa',
  'resort-hotel-villa-tiki-hut-fire-retardant-artificial-palm-t':
    'resort-hotel-tiki-hut-fire-retardant-palm-thatch-panels',
};

const LOCALES = ['en', 'ru', 'es'];

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return Object.entries(LEGACY_PRODUCT_SLUGS).flatMap(([from, to]) =>
      LOCALES.map((locale) => ({
        source: `/${locale}/products/${from}`,
        destination: `/${locale}/products/${to}`,
        permanent: true,
      }))
    );
  },
  transpilePackages: ['three', 'framer-motion'],
  reactCompiler: true,
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-accordion', '@radix-ui/react-dialog']
  },
  typescript: { ignoreBuildErrors: false },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 2560, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com'
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com'
      }
    ]
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.md$/,
      type: 'asset/source'
    });
    return config;
  },
  turbopack: {
    rules: {
      '*.md': {
        loaders: ['raw-loader'],
        as: '*.js'
      }
    }
  }
};

export default withNextIntl(nextConfig);
