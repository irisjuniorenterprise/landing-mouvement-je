import { useTranslations } from 'next-intl';
import Map from '@/components/map/Map';

export default async function HomePage({ params }) {
  const { locale } = await params;
  return <HomeContent locale={locale} />;
}

function HomeContent() {
  const t = useTranslations('hero');
  return (
    <main id="main-content" style={{ padding: '2rem' }}>
      <p>{t('eyebrow')}</p>
      <h1>{t('title')}</h1>
      <p>{t('subtitle')}</p>
      <div id="map">
        <Map />
      </div>
    </main>
  );
}