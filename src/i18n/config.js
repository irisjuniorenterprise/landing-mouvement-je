import { routing } from './routing';

// Ré-exporté depuis routing.js (source unique de vérité désormais utilisée
// par le middleware, request.js et navigation.js) pour ne pas casser les
// imports existants ailleurs dans le code (LanguageSwitcher, layout,
// sitemap, ...).
export const locales = routing.locales;
export const defaultLocale = routing.defaultLocale;

export const localeNames = {
  fr: 'Français',
  en: 'English',
};