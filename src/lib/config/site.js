/**
 * Configuration centrale du site, utilisée par les métadonnées (SEO,
 * OpenGraph, Twitter Card), robots.txt et sitemap.xml.
 *
 * IMPORTANT : définir NEXT_PUBLIC_SITE_URL dans .env.local / les variables
 * d'environnement de production avec l'URL finale du site (sans slash final),
 * ex. "https://www.jetunisie.com". La valeur ci-dessous n'est qu'un
 * fallback pour que le build ne casse pas si la variable est absente.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.jetunisie.com').replace(/\/$/, '');

export const SITE_NAME = 'CTJE — Mouvement des Juniors Entreprises';