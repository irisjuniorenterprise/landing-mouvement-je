'use client';

import { usePathname, useRouter } from '@/i18n/navigation';
import { locales } from '@/i18n/config';
import styles from './LanguageSwitcher.module.css';

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
    router.replace(pathname, { locale });
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
          aria-label={`${l.toUpperCase()} — ${LOCALE_LABELS[l] ?? l}`}
        >
          <span aria-hidden="true">{l.toUpperCase()}</span>
        </button>
      ))}
    </div>
  );
}