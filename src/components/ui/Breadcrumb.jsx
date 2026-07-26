import Link from 'next/link';
import { Icons } from '@/components/icons/Icons';
import styles from './Breadcrumb.module.css';

/**
 * Fil d'Ariane.
 * @param {Array<{ label: string, href?: string }>} items - Liste des segments.
 * Le dernier élément est affiché comme page courante (non cliquable).
 * Si le premier élément a href="/", l'icône maison est affichée sur mobile.
 */
export default function Breadcrumb({ items = [] }) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const isHome = index === 0 && item.href === '/';

        return (
          <span key={item.label} className={styles.item}>
            {index > 0 && (
              <Icons.ChevronRight size={14} className={styles.separator} />
            )}
            {isLast || !item.href ? (
              <span className={styles.current} aria-current="page">
                {isHome ? (
                  <>
                    <Icons.Home size={16} className={styles.homeIcon} />
                    <span className={styles.homeLabel}>{item.label}</span>
                  </>
                ) : (
                  item.label
                )}
              </span>
            ) : (
              <Link href={item.href} className={styles.link}>
                {isHome ? (
                  <>
                    <Icons.Home size={16} className={styles.homeIcon} />
                    <span className={styles.homeLabel}>{item.label}</span>
                  </>
                ) : (
                  item.label
                )}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}