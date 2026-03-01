import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  
  if (!locale || !['it', 'en', 'de'].includes(locale)) {
    locale = 'it';
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});