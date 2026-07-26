'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Compteur qui s'incrémente progressivement de 0 jusqu'à `value` la
 * première fois qu'il entre dans le viewport (déclenché par
 * IntersectionObserver, une seule fois). Respecte `prefers-reduced-motion`
 * en affichant directement la valeur finale sans animation.
 *
 * Usage : <AnimatedCounter value={128} suffix="+" className={styles.value} />
 */
export default function AnimatedCounter({
  value,
  prefix = '',
  suffix = '',
  duration = 1500,
  className = '',
  as: Tag = 'span',
}) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      // setState appelé depuis un callback (requestAnimationFrame) plutôt
      // que de façon synchrone dans le corps de l'effet, pour rester
      // cohérent avec le reste du composant et éviter un rendu en cascade.
      const raf = requestAnimationFrame(() => setDisplay(value));
      return () => cancelAnimationFrame(raf);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            animateCount();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(node);

    function animateCount() {
      const start = performance.now();
      const from = 0;
      const to = value;

      const tick = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // easeOutExpo : démarrage rapide, ralentit en douceur vers la valeur finale
        const eased = progress === 1 ? 1 : 1 - 2 ** (-10 * progress);
        const current = Math.round(from + (to - from) * eased);

        setDisplay(current);

        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      };

      requestAnimationFrame(tick);
    }

    return () => observer.disconnect();
  }, [value, duration]);

  return (
    <Tag ref={ref} className={className}>
      {prefix}
      {display.toLocaleString('fr-FR')}
      {suffix}
    </Tag>
  );
}