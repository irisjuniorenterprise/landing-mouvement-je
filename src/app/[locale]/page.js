import Hero from '@/components/sections/Hero';
import KPIs from '@/components/sections/KPIs';
import NetworkExplorer from '@/components/sections/NetworkExplorer';
import JECards from '@/components/sections/JECards';
import JCDetails from '@/components/sections/JCDetails';

export default async function HomePage() {
  return (
    <main id="main-content">
      <Hero />
      <KPIs />
      <NetworkExplorer />
      <JECards />
      <JCDetails />
    </main>
  );
}