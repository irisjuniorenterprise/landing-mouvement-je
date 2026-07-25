import Hero from '@/components/sections/Hero';
import Map from '@/components/map/Map';

export default async function HomePage() {
  return (
    <main id="main-content">
      <Hero />
      <div id="map" className="container section-padding">
        <Map />
      </div>
    </main>
  );
}