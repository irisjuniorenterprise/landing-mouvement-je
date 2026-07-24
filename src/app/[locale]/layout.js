import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { Montserrat } from 'next/font/google';
import { locales } from '@/i18n/config';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
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
  return {
    title: `${t('title')} — CTJE`,
    description: t('subtitle'),
  };
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  const messages = await getMessages();
  const tNav = await getTranslations({ locale, namespace: 'nav' });

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={montserrat.variable} suppressHydrationWarning>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <a href="#main-content" className="skip-link">
            {tNav('skipToContent')}
          </a>
          <Header />
          {/* page-offset (défini dans globals.css) = var(--header-height),
              synchronisée avec Header.module.css pour éviter que le
              contenu passe sous le header fixe. */}
          <div className="page-offset">{children}</div>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}