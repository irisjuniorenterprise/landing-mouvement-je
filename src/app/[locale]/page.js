import Hero from '@/components/sections/Hero';
import NetworkExplorer from '@/components/sections/NetworkExplorer';

export default async function HomePage() {
  return (
    <main id="main-content">
      <Hero />
      <NetworkExplorer />
    </main>
  );
}