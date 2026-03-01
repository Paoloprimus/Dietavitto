import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // A list of all locales that are supported
  locales: ['it', 'en', 'de'],
  
  // Used when no locale matches
  defaultLocale: 'it',
  
  // Always use locale prefix
  localePrefix: 'always'
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(it|en|de)/:path*']
};
