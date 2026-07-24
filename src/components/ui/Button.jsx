import Link from 'next/link';

/**
 * Bouton réutilisable respectant la charte CTJE (variantes primary /
 * secondary / secondary-light). Rendu comme <Link> si `href` est fourni,
 * sinon comme <button> natif.
 */
export default function Button({
  children,
  variant = 'primary',
  href,
  type = 'button',
  disabled = false,
  className = '',
  ...props
}) {
  const variantClass = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    'secondary-light': 'btn-secondary-light',
  }[variant] || 'btn-primary';

  const classes = `${variantClass} ${className}`.trim();

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} disabled={disabled} className={classes} {...props}>
      {children}
    </button>
  );
}