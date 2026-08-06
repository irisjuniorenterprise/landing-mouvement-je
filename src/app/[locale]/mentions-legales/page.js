import { setRequestLocale } from 'next-intl/server';

export default async function LegalPage({ params }) {
  const { locale } = await params;

  setRequestLocale(locale);

  return (
    <main id="main-content">
      {/* Empty page for Legal */}
    </main>
  );
}