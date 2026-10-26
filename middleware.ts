import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: ['/', '/(en|ru|es|it|id|ja|fr|de)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)']
};
