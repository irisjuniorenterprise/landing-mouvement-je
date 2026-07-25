'use client';

import { useEffect, useState } from 'react';
import { MEDIA_QUERIES } from '@/lib/config/breakpoints';

/**
 * Retourne 'mobile' | 'tablet' | 'desktop' selon la largeur d'écran.
 * Renvoie 'desktop' par défaut pendant l'hydratation (évite un flash
 * de contenu mobile sur un rendu SSR desktop-first).
 */
export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState('desktop');

  useEffect(() => {
    const mobileMql = window.matchMedia(MEDIA_QUERIES.mobile);
    const tabletMql = window.matchMedia(MEDIA_QUERIES.tablet);

    const update = () => {
      if (mobileMql.matches) setBreakpoint('mobile');
      else if (tabletMql.matches) setBreakpoint('tablet');
      else setBreakpoint('desktop');
    };

    update();
    mobileMql.addEventListener('change', update);
    tabletMql.addEventListener('change', update);

    return () => {
      mobileMql.removeEventListener('change', update);
      tabletMql.removeEventListener('change', update);
    };
  }, []);

  return breakpoint;
}