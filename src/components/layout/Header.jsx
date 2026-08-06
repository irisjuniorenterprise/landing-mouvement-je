'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { Icons } from '../icons/Icons';
import LanguageSwitcher from '../ui/LanguageSwitcher';
import styles from './Header.module.css';

export default function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const firstMobileLinkRef = useRef(null);

  const closeMenu = () => setIsMenuOpen(false);

  // Échap pour fermer + verrouillage du scroll de fond + focus sur le
  // premier lien à l'ouverture, pour un menu mobile clavier-accessible
  // (le reste du site gère déjà ce pattern via NetworkEntityPanel).
  useEffect(() => {
    if (!isMenuOpen) return undefined;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeMenu();
    };

    document.addEventListener('keydown', handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    firstMobileLinkRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isMenuOpen]);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          <Image
            src="/images/logo.png"
            alt="CTJE Logo"
            width={2376}
            height={1323}
            loading="eager"
            sizes="120px"
            className={styles.logoImage}
          />
        </Link>

        <nav className={styles.nav} aria-label={t('mainNavigation')}>
          <a href="#history" className={styles.navLink}>
            {t('history')}
          </a>
          <a href="#about" className={styles.navLink}>
            {t('about')}
          </a>
          <a href="#map" className={styles.navLink}>
            {t('map')}
          </a>
          <a href="#kpis" className={styles.navLink}>
            {t('kpis')}
          </a>
          <a href="#apply" className={styles.navCta}>
            {t('apply')}
          </a>
          <LanguageSwitcher currentLocale={locale} />
        </nav>

        <div className={styles.mobileActions}>
          <LanguageSwitcher currentLocale={locale} />
          <button
            className={styles.menuBtn}
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label={isMenuOpen ? t('closeMenu') : t('openMenu')}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? <Icons.X size={20} /> : <Icons.Menu size={20} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <>
          <button
            type="button"
            className={styles.mobileNavBackdrop}
            aria-label={t('closeMenu')}
            onClick={closeMenu}
          />
          <nav id="mobile-menu" className={styles.mobileNav} aria-label={t('mobileNavigation')}>
            <a
              ref={firstMobileLinkRef}
              href="#history"
              onClick={closeMenu}
              className={styles.mobileNavLink}
            >
              {t('history')}
            </a>
            <a href="#about" onClick={closeMenu} className={styles.mobileNavLink}>
              {t('about')}
            </a>
            <a href="#map" onClick={closeMenu} className={styles.mobileNavLink}>
              {t('map')}
            </a>
            <a href="#kpis" onClick={closeMenu} className={styles.mobileNavLink}>
              {t('kpis')}
            </a>
            <a href="#apply" onClick={closeMenu} className={styles.mobileNavLink}>
              {t('apply')}
            </a>
          </nav>
        </>
      )}
    </header>
  );
}