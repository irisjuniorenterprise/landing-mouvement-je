import { setRequestLocale } from 'next-intl/server';

export default async function TermsPage({ params }) {
  const { locale } = await params;

  setRequestLocale(locale);

  return (
    <main id="main-content">
      {/* Empty page for Terms of Use */}
    </main>
  );
}