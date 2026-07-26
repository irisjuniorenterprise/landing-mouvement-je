import { useTranslations } from 'next-intl';
import Button from '@/components/ui/Button';
import { Icons } from '@/components/icons/Icons';

export default function NotFound() {
  const t = useTranslations('notFound');

  return (
    <main className="section-padding container flex flex-col items-center text-center min-h-[60vh] justify-center">
      <p className="text-primary font-bold text-sm uppercase tracking-wide mb-3">404</p>
      <h1 className="text-3xl font-bold text-secondary mb-3">{t('title')}</h1>
      <p className="text-muted mb-8 max-w-md">{t('subtitle')}</p>
      <Button href="/" variant="primary">
        <Icons.Home size={18} />
        {t('cta')}
      </Button>
    </main>
  );
}
