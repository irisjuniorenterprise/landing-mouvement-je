/**
 * Source unique de vérité pour les breakpoints du projet.
 * Doit rester synchronisé avec :
 * - tailwind.config.js (breakpoints par défaut : md=768px, lg=1024px)
 * - app/globals.css (@media max-width: 768px / 1024px / 480px)
 */
export const BREAKPOINTS = {
  mobile: 0,       // < 768px
  tablet: 768,      // 768px – 1023px
  desktop: 1024,    // >= 1024px
};

export const MEDIA_QUERIES = {
  mobile: `(max-width: ${BREAKPOINTS.tablet - 1}px)`,
  tablet: `(min-width: ${BREAKPOINTS.tablet}px) and (max-width: ${BREAKPOINTS.desktop - 1}px)`,
  desktop: `(min-width: ${BREAKPOINTS.desktop}px)`,
};