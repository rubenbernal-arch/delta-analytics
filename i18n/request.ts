import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';

const locales = ['es', 'en'];

export default getRequestConfig(async ({requestLocale}) => {
  const locale = await requestLocale;
  if (!locale || !locales.includes(locale)) notFound();

  let messages;
  if (locale === 'en') {
    messages = (await import('../messages/en.json')).default;
  } else {
    messages = (await import('../messages/es.json')).default;
  }

  return { locale, messages };
});
