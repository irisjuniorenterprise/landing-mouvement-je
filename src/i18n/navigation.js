import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

// API de navigation "conscientes de la locale", fournies par next-intl.
// A utiliser à la place des équivalents bruts de 'next/navigation' dès
// qu'un composant doit lire ou changer la locale courante (ex: switcher
// de langue), car elles gèrent correctement le préfixe d'URL, le cookie
// NEXT_LOCALE, et la synchronisation avec le cache du App Router.
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);