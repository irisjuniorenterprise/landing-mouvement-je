import { SITE_URL } from '@/lib/config/site';
import { locales, defaultLocale } from '@/i18n/config';

export default function sitemap() {
  const now = new Date();

  return locales.map((locale) => ({
    // La locale par défaut (fr) n'a pas de préfixe dans l'URL.
    url: locale === defaultLocale ? SITE_URL : `${SITE_URL}/${locale}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: locale === defaultLocale ? 1 : 0.8,
    alternates: {
      languages: Object.fromEntries(
        locales.map((l) => [l, l === defaultLocale ? SITE_URL : `${SITE_URL}/${l}`])
      ),
    },
  }));
}