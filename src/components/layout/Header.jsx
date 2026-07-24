'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Icons } from '../icons/Icons';
import LanguageSwitcher from '../ui/LanguageSwitcher';
import styles from './Header.module.css';

export default function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          <img src="/images/logo.png" alt="CTJE Logo" className={styles.logoImage} />
        </Link>

        <nav className={styles.nav} aria-label={t('mainNavigation')}>
          <a href="#history" className={styles.navLink}>{t('history')}</a>
          <a href="#about" className={styles.navLink}>{t('about')}</a>
          <a href="#map" className={styles.navLink}>{t('map')}</a>
          <a href="#kpis" className={styles.navLink}>{t('kpis')}</a>
          <a href="#apply" className={styles.navCta}>{t('apply')}</a>
          <LanguageSwitcher currentLocale={locale} />
        </nav>

        <div className={styles.mobileActions}>
          <LanguageSwitcher currentLocale={locale} />
          <button
            className={styles.menuBtn}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? t('closeMenu') : t('openMenu')}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? <Icons.X size={20} /> : <Icons.Menu size={20} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <nav id="mobile-menu" className={styles.mobileNav} aria-label={t('mobileNavigation')}>
          <a href="#history" onClick={() => setIsMenuOpen(false)} className={styles.mobileNavLink}>{t('history')}</a>
          <a href="#about" onClick={() => setIsMenuOpen(false)} className={styles.mobileNavLink}>{t('about')}</a>
          <a href="#map" onClick={() => setIsMenuOpen(false)} className={styles.mobileNavLink}>{t('map')}</a>
          <a href="#kpis" onClick={() => setIsMenuOpen(false)} className={styles.mobileNavLink}>{t('kpis')}</a>
          <a href="#apply" onClick={() => setIsMenuOpen(false)} className={styles.mobileNavLink}>{t('apply')}</a>
        </nav>
      )}
    </header>
  );
}