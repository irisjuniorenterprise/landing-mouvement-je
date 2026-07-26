'use client';

import { useEffect } from 'react';

/**
 * Anime l'apparition progressive :
 * 1) des sections marquées `.section-animate` au fil du défilement
 *    (fade + translation verticale) ;
 * 2) des grilles marquées `.stagger-grid` dont les enfants directs
 *    (cards, stats KPI...) apparaissent en cascade, décalés les uns
 *    des autres.
 * Le tout via GSAP + ScrollTrigger, chargé dynamiquement côté client
 * uniquement (aucun impact sur le SSR / SEO).
 *
 * Le footer (`.footer-reveal`) est traité à part, via un
 * IntersectionObserver natif et une transition CSS pure (voir
 * globals.css) — PAS via GSAP/ScrollTrigger. Un footer n'a besoin
 * d'apparaître qu'une seule fois, jamais de se recacher au scroll ;
 * gérer ça avec un trigger réversible basé sur des coordonnées en
 * pixels s'est révélé fragile au resize (coordonnées obsolètes après
 * un changement de breakpoint → le footer restait bloqué invisible
 * jusqu'au reload). L'IntersectionObserver, lui, se réévalue tout
 * seul à chaque changement de layout, sans coordonnées à mettre en
 * cache.
 *
 * Respecte `prefers-reduced-motion` pour l'accessibilité.
 */
export default function ClientSideEffects() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const sections = document.querySelectorAll('.section-animate');
    const staggerGrids = document.querySelectorAll('.stagger-grid');
    const fadeItems = document.querySelectorAll('.fade-in-item, .fade-in-soft');
    const footer = document.querySelector('.footer-reveal');

    // ---------------------------------------------------------------
    // FOOTER — IntersectionObserver natif, indépendant de GSAP.
    // ---------------------------------------------------------------
    let footerObserver;

    if (footer) {
      if (prefersReducedMotion) {
        footer.classList.add('is-visible');
      } else {
        footerObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                footer.classList.add('is-visible');
                footerObserver.unobserve(entry.target);
              }
            });
          },
          { threshold: 0, rootMargin: '0px 0px -5% 0px' }
        );
        footerObserver.observe(footer);
      }
    }

    // ---------------------------------------------------------------
    // Reste des animations — inchangé, piloté par GSAP/ScrollTrigger.
    // ---------------------------------------------------------------
    if (prefersReducedMotion) {
      sections.forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      staggerGrids.forEach((grid) => {
        Array.from(grid.children).forEach((child) => {
          child.style.opacity = '1';
          child.style.transform = 'none';
        });
      });
      fadeItems.forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return () => {
        footerObserver?.disconnect();
      };
    }

    if (sections.length === 0 && staggerGrids.length === 0 && fadeItems.length === 0) {
      return () => {
        footerObserver?.disconnect();
      };
    }

    let ctx;
    let cancelled = false;
    let handleResize;

    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);

      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      // Par défaut, ScrollTrigger se ré-actualise tout seul sur un tas
      // d'événements (resize, changements de layout...). Si un refresh
      // survient PENDANT qu'une animation de scroll plus bas dans la
      // page (ex. la carte) est déjà en train de jouer — ce qui peut
      // arriver pendant que les compteurs de la section KPIs animent
      // leurs chiffres juste au-dessus — les positions de départ sont
      // recalculées en plein milieu du tween, ce qui produit un effet
      // de tremblement haut/bas. On retire donc 'resize' de la liste
      // par défaut, et on gère nous-mêmes un refresh ciblé et débouncé
      // plus bas (handleResize).
      ScrollTrigger.config({
        autoRefreshEvents: 'DOMContentLoaded,load,visibilitychange',
        ignoreMobileResize: true,
      });

      ctx = gsap.context(() => {
        sections.forEach((section, index) => {
          gsap.to(section, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            delay: index === 0 ? 0.1 : 0,
            scrollTrigger: {
              trigger: section,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          });
        });

        staggerGrids.forEach((grid) => {
          const items = grid.children;
          if (items.length === 0) return;

          gsap.to(items, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: 'power2.out',
            stagger: 0.08,
            scrollTrigger: {
              trigger: grid,
              start: 'top 88%',
              toggleActions: 'play none none reverse',
            },
          });
        });

        fadeItems.forEach((el) => {
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
          });
        });
      });

      // Un unique refresh contrôlé une fois la page réellement stable
      // (polices + images + carte chargées), plutôt que de laisser
      // ScrollTrigger le faire de façon répétée et imprévisible.
      window.setTimeout(() => {
        if (!cancelled) ScrollTrigger.refresh();
      }, 400);

      // Refresh manuel et débouncé, déclenché uniquement quand la
      // LARGEUR de la fenêtre change (pas la hauteur seule, pour
      // ignorer les resize causés par la barre d'adresse mobile).
      // Garde les positions de trigger des sections/grilles à jour
      // après un changement de breakpoint.
      let lastWidth = window.innerWidth;
      let resizeTimeout;

      handleResize = () => {
        const currentWidth = window.innerWidth;
        if (currentWidth === lastWidth) return;
        lastWidth = currentWidth;

        clearTimeout(resizeTimeout);
        resizeTimeout = window.setTimeout(() => {
          if (!cancelled) ScrollTrigger.refresh();
        }, 200);
      };

      window.addEventListener('resize', handleResize);
    })();

    return () => {
      cancelled = true;
      footerObserver?.disconnect();
      if (handleResize) {
        window.removeEventListener('resize', handleResize);
      }
      ctx?.revert();
    };
  }, []);

  return null;
}