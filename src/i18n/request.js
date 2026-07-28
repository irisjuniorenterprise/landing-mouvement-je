import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

// Imports statiques : les fichiers de messages sont résolus au build par le
// bundler (webpack/Turbopack), et non lus dynamiquement à chaque requête.
import fr from '../messages/fr.json';
import en from '../messages/en.json';

const messagesByLocale = { fr, en };

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  return {
    locale,
    messages: messagesByLocale[locale],
  };
});