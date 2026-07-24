import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { locales } from '@/i18n/config';
import Header from '@/components/layout/Header';
import '../globals.css';

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
      <body suppressHydrationWarning>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <a href="#main-content" className="skip-link">
            {tNav('skipToContent')}
          </a>
          <Header />
          <div className="page-offset" style={{ paddingTop: 'var(--header-height)' }}>
            {children}
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}