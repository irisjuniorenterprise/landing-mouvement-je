import Hero from '@/components/sections/Hero';
import NetworkExplorer from '@/components/sections/NetworkExplorer';
import JECards from '@/components/sections/JECards';
import JCDetails from '@/components/sections/JCDetails';

export default async function HomePage() {
  return (
    <main id="main-content">
      <Hero />
      <NetworkExplorer />
      <JECards />
      <JCDetails />
    </main>
  );
}