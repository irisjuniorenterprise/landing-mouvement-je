import { createNavigation } from 'next-intl/navigation';
import { locales, defaultLocale } from './config';

// API de navigation "conscientes de la locale", fournies par next-intl.
// A utiliser a la place des equivalents bruts de 'next/navigation' des
// qu'un composant doit lire ou changer la locale courante (ex: switcher
// de langue), car elles gerent correctement le prefixe d'URL, le cookie
// NEXT_LOCALE, et la synchronisation avec le cache du App Router.
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
});