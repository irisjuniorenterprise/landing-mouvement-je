import { useTranslations } from 'next-intl';
import Hero from '@/components/sections/Hero';
import History from '@/components/sections/History';
import About from '@/components/sections/About';
import NetworkExplorer from '@/components/sections/NetworkExplorer';
import KPIs from '@/components/sections/KPIs';
import CandidatureForm from '@/components/forms/CandidatureForm';
import SatisfactionForm from '@/components/forms/SatisfactionForm';
import Breadcrumb from '@/components/ui/Breadcrumb';

export default function HomePage() {
  const tBreadcrumb = useTranslations('breadcrumb');

  return (
    <main id="main-content">
      <div className="container">
        <Breadcrumb items={[{ label: tBreadcrumb('home') }]} />
      </div>
      <Hero />
      <History />
      <About />
      <KPIs />
      <NetworkExplorer />
      <CandidatureForm />
      <SatisfactionForm />
    </main>
  );
}