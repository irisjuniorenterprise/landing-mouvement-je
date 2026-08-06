import { setRequestLocale } from 'next-intl/server';

export default async function PrivacyPage({ params }) {
  const { locale } = await params;

  setRequestLocale(locale);

  return (
    <main id="main-content">
      {/* Empty page for Privacy Policy */}
    </main>
  );
}