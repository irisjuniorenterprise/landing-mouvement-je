'use client';

import { useEffect } from 'react';

const WATCHED_SELECTOR = '.section-animate, .stagger-grid, .fade-in-item, .fade-in-soft';

export default function ClientSideEffects() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const footer = document.querySelector('.footer-reveal');
    
    const seen = new WeakSet();

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

    const kindOf = (el) => {
      if (el.classList.contains('section-animate')) return 'section';
      if (el.classList.contains('stagger-grid')) return 'grid';
      return 'fade';
    };

    if (prefersReducedMotion) {
      const revealInstant = (el) => {
        if (seen.has(el)) return;
        seen.add(el);
        if (kindOf(el) === 'grid') {
          Array.from(el.children).forEach((child) => {
            child.style.opacity = '1';
            child.style.transform = 'none';
          });
        } else {
          el.style.opacity = '1';
          el.style.transform = 'none';
        }
      };

      document.querySelectorAll(WATCHED_SELECTOR).forEach(revealInstant);

      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType !== 1) return;
            if (node.matches?.(WATCHED_SELECTOR)) revealInstant(node);
            node.querySelectorAll?.(WATCHED_SELECTOR).forEach(revealInstant);
          });
        });
      });
      observer.observe(document.body, { childList: true, subtree: true });

      return () => {
        observer.disconnect();
        footerObserver?.disconnect();
      };
    }


    let cancelled = false;
    let ctx;
    let gsapRef;
    let scrollTriggerRef;
    let mutationObserver;
    let refreshTimeout;
    let handleResize;

    const pending = [];

    const scheduleRefresh = () => {
      if (!scrollTriggerRef) return;
      clearTimeout(refreshTimeout);
      refreshTimeout = window.setTimeout(() => {
        if (!cancelled) scrollTriggerRef.refresh();
      }, 50);
    };

    const revealWithGsap = (el) => {
      const kind = kindOf(el);
      if (kind === 'section') {
        gsapRef.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        });
      } else if (kind === 'grid') {
        const items = el.children;
        if (items.length === 0) return;
        gsapRef.to(items, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: 'power2.out',
          stagger: 0.08,
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none reverse',
          },
        });
      } else {
        gsapRef.to(el, {
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
      }
    };

    const handleNewElement = (el) => {
      if (seen.has(el)) return;
      seen.add(el);
      if (!gsapRef || !ctx) {
        pending.push(el);
        return;
      }
      ctx.add(() => revealWithGsap(el));
      scheduleRefresh();
    };

    const initialElements = Array.from(document.querySelectorAll(WATCHED_SELECTOR));
    initialElements.forEach((el) => seen.add(el));

    mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType !== 1) return;
          if (node.matches?.(WATCHED_SELECTOR)) handleNewElement(node);
          node.querySelectorAll?.(WATCHED_SELECTOR).forEach(handleNewElement);
        });
      });
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);

      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      gsapRef = gsap;
      scrollTriggerRef = ScrollTrigger;

      ScrollTrigger.config({
        autoRefreshEvents: 'DOMContentLoaded,load,visibilitychange',
        ignoreMobileResize: true,
      });

      ctx = gsap.context(() => {
        initialElements.forEach((el, index) => {
          if (kindOf(el) === 'section' && index === 0) {
            gsap.to(el, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: 'power2.out',
              delay: 0.1,
              scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
              },
            });
          } else {
            revealWithGsap(el);
          }
        });
      });


      pending.splice(0).forEach((el) => ctx.add(() => revealWithGsap(el)));

      window.setTimeout(() => {
        if (!cancelled) ScrollTrigger.refresh();
      }, 400);

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
      mutationObserver?.disconnect();
      clearTimeout(refreshTimeout);
      if (handleResize) {
        window.removeEventListener('resize', handleResize);
      }
      ctx?.revert();
    };
  }, []);

  return null;
}