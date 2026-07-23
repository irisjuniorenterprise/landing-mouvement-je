import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

export default async function HomePage({ params }) {
  const { locale } = await params;
  return <HomeContent locale={locale} />;
}

function HomeContent({ locale }) {
  const t = useTranslations('hero');
  return (
    <main id="main-content" style={{ padding: '2rem' }}>
      <LanguageSwitcher currentLocale={locale} />
      <p>{t('eyebrow')}</p>
      <h1>{t('title')}</h1>
      <p>{t('subtitle')}</p>
    </main>
  );
}