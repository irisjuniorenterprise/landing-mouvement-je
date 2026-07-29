import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Applique le middleware à toutes les routes sauf les assets statiques,
  // les fichiers internes Next.js, et les routes API (qui n'ont pas besoin
  // de résolution de locale).
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};