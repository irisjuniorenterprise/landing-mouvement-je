import { Analytics } from '@vercel/analytics/next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { Montserrat } from 'next/font/google';
import { locales } from '@/i18n/config';
import { SITE_URL, SITE_NAME } from '@/lib/config/site';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ClientSideEffects from '@/components/ClientSideEffects';
import VisitorPing from '@/components/analytics/VisitorPing';
import { ToastProvider } from '@/components/ui/toast/ToastProvider';
import '../globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-montserrat',
  display: 'swap',
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'hero' });

  const title = `${t('title')} — CTJE`;
  const description = t('subtitle');
  const path = locale === 'fr' ? '/' : `/${locale}`;
  const ogImage = `/images/og-image-${locale}.png`;
  const ogLocale = locale === 'fr' ? 'fr_FR' : 'en_US';
  const alternateOgLocale = locale === 'fr' ? 'en_US' : 'fr_FR';

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    keywords: [
      'Junior Entreprise',
      'Junior Créations',
      'CTJE',
      'JE Tunisie',
      'étudiants entrepreneurs',
      'entrepreneuriat étudiant Tunisie',
    ],
    alternates: {
      canonical: path,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, l === 'fr' ? '/' : `/${l}`])),
        'x-default': '/',
      },
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type: 'website',
      url: `${SITE_URL}${path}`,
      siteName: SITE_NAME,
      title,
      description,
      locale: ogLocale,
      alternateLocale: alternateOgLocale,
      images: [
        {
          url: `${SITE_URL}/images/og-image-${locale}.png`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    icons: {
      icon: [
        { url: '/favicon.ico', media: '(prefers-color-scheme: light)' },
        { url: '/favicon-white.ico', media: '(prefers-color-scheme: dark)' },
      ],
    },
    // fb:app_id : requis par le Facebook Sharing Debugger uniquement si vous
    // voulez rattacher les partages de cette page aux Insights d'une App
    // Facebook. Sans NEXT_PUBLIC_FB_APP_ID défini, la balise n'est tout
    // simplement pas générée (le site reste valide pour Facebook/LinkedIn).
    // Pour l'ajouter : créez une App sur https://developers.facebook.com/apps,
    // copiez son "App ID", et mettez NEXT_PUBLIC_FB_APP_ID=xxxxxxxxxx dans
    // .env.local (et dans les variables d'environnement de production).
    ...(process.env.NEXT_PUBLIC_FB_APP_ID && {
      other: {
        'fb:app_id': process.env.NEXT_PUBLIC_FB_APP_ID,
      },
    }),
  };
}

// theme-color : force la couleur de la barre du navigateur (adresse mobile,
// status bar iOS/Android) à rester blanche, quel que soit le thème clair/
// sombre choisi par le client.
export const viewport = {
  themeColor: '#ffffff',
};

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;

  setRequestLocale(locale);

  const messages = await getMessages();
  const tNav = await getTranslations({ locale, namespace: 'nav' });

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={montserrat.variable} suppressHydrationWarning>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ToastProvider>
            <a href="#main-content" className="skip-link">
              {tNav('skipToContent')}
            </a>
            <Header />
            {/* Le landmark <main id="main-content"> sémantique vit dans
                page.js — ce wrapper ne sert qu'à décaler le contenu sous
                le header fixe (.page-offset) et à porter la cible de
                focus du skip link (tabIndex). Pas de second <main> ici,
                pour éviter un id dupliqué + deux landmarks "main". */}
            <div id="main-content" tabIndex={-1} className="page-offset">
              {children}
            </div>
            <Footer />
            <ClientSideEffects />
            <VisitorPing />
          </ToastProvider>
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}