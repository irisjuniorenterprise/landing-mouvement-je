'use client';

import { usePathname, useRouter } from 'next/navigation';
import { locales } from '@/i18n/config';
import styles from './LanguageSwitcher.module.css';

const LOCALE_COOKIE_NAME = 'NEXT_LOCALE';
const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

const LOCALE_LABELS = {
  fr: 'Français',
  en: 'English',
};

export default function LanguageSwitcher({ currentLocale }) {
  const pathname = usePathname();
  const router = useRouter();
  const activeIndex = Math.max(locales.indexOf(currentLocale), 0);

  const switchTo = (locale) => {
    if (locale === currentLocale) return;

    document.cookie = `${LOCALE_COOKIE_NAME}=${locale}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; samesite=lax`;

    const segments = pathname.split('/').filter(Boolean);
    if (locales.includes(segments[0])) segments.shift();
    const newPath = locale === 'fr' ? `/${segments.join('/')}` : `/${locale}/${segments.join('/')}`;

    router.push(newPath || '/');
    router.refresh();
  };

  return (
    <div className={styles.switcher} role="group" aria-label="Langue / Language">
      <span
        className={`${styles.indicator} ${activeIndex === 1 ? styles.indicatorRight : ''}`}
        aria-hidden="true"
      />
      {locales.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => switchTo(l)}
          className={`${styles.option} ${l === currentLocale ? styles.optionActive : ''}`}
          aria-current={l === currentLocale ? 'true' : undefined}
          aria-label={LOCALE_LABELS[l] ?? l}
        >
          <span aria-hidden="true">{l.toUpperCase()}</span>
        </button>
      ))}
    </div>
  );
}