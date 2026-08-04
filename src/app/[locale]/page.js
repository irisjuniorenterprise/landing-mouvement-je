import { getTranslations, setRequestLocale } from 'next-intl/server';
import Hero from '@/components/sections/Hero';
import History from '@/components/sections/History';
import About from '@/components/sections/About';
import NetworkExplorer from '@/components/sections/NetworkExplorer';
import KPIs from '@/components/sections/KPIs';
import CandidatureForm from '@/components/forms/CandidatureForm';
import SatisfactionForm from '@/components/forms/SatisfactionForm';
import Breadcrumb from '@/components/ui/Breadcrumb';

export default async function HomePage({ params }) {
  const { locale } = await params;

  setRequestLocale(locale);

  const tBreadcrumb = await getTranslations({ locale, namespace: 'breadcrumb' });

  return (
    <main id="main-content">
      <div className="container">
        <Breadcrumb
          items={[{ label: tBreadcrumb('home') }]}
          ariaLabel={tBreadcrumb('ariaLabel')}
        />
      </div>

      <Hero />
      {/* <div className="section-seam" style={{ '--seam-from': '#050505', '--seam-to': '#FBEEF0' }} aria-hidden="true" /> */}

      <History />
      <About />
      {/* <div className="section-seam" style={{ '--seam-from': '#FFFFFF', '--seam-to': '#2E1D24' }} aria-hidden="true" /> */}

      <KPIs />
      {/* <div className="section-seam" style={{ '--seam-from': '#140B0E', '--seam-to': '#FFFFFF' }} aria-hidden="true" /> */}

      <NetworkExplorer />
      <div className="section-seam" style={{ '--seam-from': '#FAF6F5', '--seam-to': '#F4F4F4' }} aria-hidden="true" />
      <CandidatureForm />
      <SatisfactionForm />
      {/* <div className="section-seam" style={{ '--seam-from': '#F4F4F4', '--seam-to': '#1A1A1A' }} aria-hidden="true" /> */}
    </main>
  );
}