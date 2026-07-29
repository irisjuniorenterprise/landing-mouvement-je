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

  // OBLIGATOIRE avec generateStaticParams (rendu statique) : voir le
  // commentaire équivalent dans app/[locale]/layout.js. À répéter dans
  // chaque page, l'appel fait dans le layout parent n'est pas hérité.
  setRequestLocale(locale);

  // Dans un composant serveur async, on utilise getTranslations (version
  // async de next-intl/server) et non useTranslations (hook React réservé
  // aux composants synchrones / Client Components) — voir
  // https://next-intl.dev/docs/environments/server-client-components#async-components
  const tBreadcrumb = await getTranslations({ locale, namespace: 'breadcrumb' });

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