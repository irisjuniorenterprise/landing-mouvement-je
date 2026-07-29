'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Compteur qui s'incrémente progressivement de 0 jusqu'à `value` la
 * première fois qu'il entre dans le viewport (déclenché par
 * IntersectionObserver, une seule fois). Respecte `prefers-reduced-motion`
 * en affichant directement la valeur finale sans animation.
 *
 * Accessibilité : la version animée (`display`) est masquée aux
 * technologies d'assistance (`aria-hidden`), et une version statique
 * contenant directement la valeur finale (`value`) est fournie en
 * parallèle via `.sr-only` — un lecteur d'écran n'a donc jamais à
 * "attraper" une valeur intermédiaire pendant le comptage.
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
      <span aria-hidden="true">
        {prefix}
        {display.toLocaleString('fr-FR')}
        {suffix}
      </span>
      <span className="sr-only">
        {prefix}
        {value.toLocaleString('fr-FR')}
        {suffix}
      </span>
    </Tag>
  );
}