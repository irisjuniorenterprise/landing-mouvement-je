import { defineRouting } from 'next-intl/routing';

// Point d'entrée unique pour la configuration de routing i18n, consommé à
// la fois par le middleware, la config de requête (i18n/request.js) et les
// API de navigation (i18n/navigation.js). Centraliser ici évite toute
// divergence entre ces trois points, qui était justement la source des
// résolutions de locale incohérentes observées jusqu'ici.
export const routing = defineRouting({
  locales: ['fr', 'en'],
  defaultLocale: 'fr',
  localePrefix: 'as-needed',
});