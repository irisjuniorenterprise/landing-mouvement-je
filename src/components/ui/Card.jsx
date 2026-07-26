import styles from './Card.module.css';

/**
 * Fiche synthétique générique (utilisée pour les JE et les JC).
 * Composition volontairement générique : le contenu métier (badge, tags,
 * actions) est injecté via des children pour rester réutilisable.
 */
export default function Card({ badge, title, meta, tags = [], footer, children, className = '' }) {
  return (
    <article className={`${styles.card} ${className}`.trim()}>
      {badge && <span className={styles.badge}>{badge}</span>}
      {title && <h3 className={styles.title}>{title}</h3>}
      {meta && <p className={styles.meta}>{meta}</p>}
      {children}
      {tags.length > 0 && (
        <ul className={styles.tagList}>
          {tags.map((tag) => (
            <li key={tag} className={styles.tag}>{tag}</li>
          ))}
        </ul>
      )}
      {footer && <div className={styles.footer}>{footer}</div>}
    </article>
  );
}
