import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Icons } from '@/components/icons/Icons';
import styles from './Footer.module.css';

export default function Footer() {
  const t = useTranslations('footer');
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className="container">
          <div className={styles.grid}>

            <div>
              <div className={styles.brand}>
                <Image
                  src="/images/LOGO_JE_Tunisia_White.png"
                  alt="CTJE — Confédération Tunisienne des Junior Entreprises"
                  width={160}
                  height={64}
                  className={styles.logoImage}
                />
              </div>

              <p className={styles.tagline}>{t('tagline')}</p>
            
              <a
                href="https://www.jetunisie.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactItem}
                aria-label="Website"
              >
                <Icons.Globe size={16} /> www.jetunisie.com
              </a>
            </div>

            <div>
              <h3 id="footer-nav" className={styles.colTitle}>{t('linksTitle')}</h3>
              <nav className={styles.linkList} aria-labelledby="footer-nav">
                <a href="#about">{t('linkAbout')}</a>
                <a href="#map">{t('linkMap')}</a>
                <a href="#apply">{t('linkApply')}</a>
              </nav>
            </div>

            <div>
              <h3 id="footer-legal" className={styles.colTitle}>{t('legalTitle')}</h3>
              <nav className={styles.linkList} aria-labelledby="footer-legal">
                <Link href="/legal">{t('linkLegal')}</Link>
                <Link href="/privacy">{t('linkPrivacy')}</Link>
                <Link href="/terms">{t('linkTerms')}</Link>
              </nav>
            </div>

            <div>
              <h3 className={styles.colTitle}>{t('contactTitle')}</h3>
              <div className={styles.linkList}>
                <a href={`tel:${t('phone')}`} className={styles.contactItem}>
                  <Icons.Phone size={16} /> {t('phone')}
                </a>
                <a href={`mailto:${t('email')}`} className={styles.contactItem}>
                  <Icons.Mail size={16} /> {t('email')}
                </a>
              </div>

              <div className={styles.socialSection}>
                <h4 className={styles.socialTitle}>{t('socialTitle')}</h4>
                <div className={styles.socialLinks}>
                  <a
                    href="https://www.linkedin.com/company/jet-junior-enterprises-tunisia/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                    aria-label="LinkedIn"
                  >
                    <Icons.Linkedin size={20} />
                  </a>
                  <a
                    href="https://www.instagram.com/je.tunisia?igsh=ZHBqcG44NWlrejA3"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                    aria-label="Instagram"
                  >
                    <Icons.Instagram size={20} />
                  </a>
                  <a
                    href="https://www.facebook.com/JuniorEnterprisesOfTunisia"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                    aria-label="Facebook"
                  >
                    <Icons.Facebook size={20} />
                  </a>
                </div>
              </div>
            </div>

          </div>

          <div className={styles.bottomBar}>
            <span>{t('orgName')}</span>
            <span aria-hidden="true">—</span>
            <span>© {year}</span>
            <span aria-hidden="true">—</span>
            <span>{t('rights')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}