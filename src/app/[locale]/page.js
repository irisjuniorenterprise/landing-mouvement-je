import { useTranslations } from 'next-intl';
import Hero from '@/components/sections/Hero';
import KPIs from '@/components/sections/KPIs';
import NetworkExplorer from '@/components/sections/NetworkExplorer';
import JECards from '@/components/sections/JECards';
import JCDetails from '@/components/sections/JCDetails';
import CandidatureForm from '@/components/forms/CandidatureForm';
import Breadcrumb from '@/components/ui/Breadcrumb';

export default function HomePage() {
  const tBreadcrumb = useTranslations('breadcrumb');

  return (
    <main id="main-content">
      <div className="container">
        <Breadcrumb items={[{ label: tBreadcrumb('home') }]} />
      </div>
      <Hero />
      <KPIs />
      <NetworkExplorer />
      <JECards />
      <JCDetails />
      <CandidatureForm />
    </main>
  );
}