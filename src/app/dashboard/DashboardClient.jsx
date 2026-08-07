'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Icons } from '@/components/icons/Icons';
import styles from './dashboard.module.css';

const POLL_INTERVAL_MS = 8000;

/* --- Icônes locales (absentes de la bibliothèque partagée), même style
   (trait, currentColor) que components/icons/Icons.jsx --- */

function StarIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={props.size || 20}
      height={props.size || 20}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 2.5l2.9 6.06 6.6.77-4.87 4.6 1.28 6.57L12 17.35l-5.91 3.15 1.28-6.57-4.87-4.6 6.6-.77z" />
    </svg>
  );
}

function DownloadIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={props.size || 18}
      height={props.size || 18}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M5 21h14" />
    </svg>
  );
}

function LogoutIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={props.size || 18}
      height={props.size || 18}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="m16 17 5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}

/**
 * Anneau de progression SVG représentant l'avancement d'un KPI vers sa
 * cible. Décoratif (aria-hidden) : la valeur exacte est déjà annoncée en
 * texte à côté, donc pas de doublon pour les lecteurs d'écran.
 */
function ProgressRing({ percent, tone, size = 72, strokeWidth = 7 }) {
  const clamped = Math.max(0, Math.min(100, percent));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true" focusable="false">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" className={styles.ringTrack} strokeWidth={strokeWidth} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        className={`${styles.ringProgress} ${tone === 'ok' ? styles.ringOk : styles.ringWarning}`}
      />
    </svg>
  );
}

/* Cible de référence par KPI (cahier des charges, section Impact) et
   mise en forme de la ligne de détail — logique purement d'affichage,
   les vrais chiffres viennent de /api/kpis. */
const KPI_CARD_CONFIG = {
  kpi1_formCompletion: {
    icon: Icons.FileCheck,
    target: 70,
    detail: (raw) => `${raw.formSubmitted.toLocaleString('fr-FR')} candidature(s) soumise(s) sur ${raw.formStartedVisitors.toLocaleString('fr-FR')} démarrée(s)`,
  },
  kpi2_mapInteraction: {
    icon: Icons.Map,
    target: 40,
    detail: (raw) => `${raw.mapInteractedVisitors.toLocaleString('fr-FR')} interaction(s) sur ${raw.uniqueVisitors.toLocaleString('fr-FR')} visiteur(s) unique(s)`,
  },
  kpi3_traffic: {
    icon: Icons.Users,
    target: 45,
    detail: () => 'Visiteurs uniques comptabilisés ce mois',
  },
  kpi4_satisfaction: {
    icon: StarIcon,
    target: 75,
    detail: (raw) =>
      raw.satisfactionCount > 0
        ? `${raw.satisfactionCount.toLocaleString('fr-FR')} avis · moyenne ${(raw.satisfactionSum / raw.satisfactionCount).toFixed(1)}/5`
        : 'Aucun avis reçu pour le moment',
  },
};

export default function DashboardClient() {
  const [payload, setPayload] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [pulsingKeys, setPulsingKeys] = useState(new Set());

  const prevValuesRef = useRef({});
  const pollIntervalRef = useRef(null);

  const fetchKPIs = useCallback(async (period) => {
    try {
      const url = period ? `/api/kpis?period=${period}` : '/api/kpis';
      const res = await fetch(url, { cache: 'no-store' });

      if (res.status === 401) {
        window.location.reload();
        return;
      }
      if (!res.ok) throw new Error('fetch_failed');

      const json = await res.json();
      setPayload(json);
      setSelectedPeriod(json.period);
      setLastUpdated(new Date());
      setError('');
    } catch {
      setError('Impossible de récupérer les indicateurs pour le moment.');
    }
  }, []);

  // Rafraîchissement automatique — mis en pause quand l'onglet n'est pas
  // visible (économie de lectures Firestore et de batterie), et relancé
  // immédiatement dès que l'utilisateur revient dessus.
  useEffect(() => {
    // fetchKPIs est async et tous ses setState surviennent après un await ;
    // le linter le signale à tort comme un setState synchrone dans l'effet
    // (faux positif documenté : facebook/react#34905).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchKPIs(selectedPeriod);

    const startPolling = () => {
      if (pollIntervalRef.current) return;
      pollIntervalRef.current = setInterval(() => fetchKPIs(selectedPeriod), POLL_INTERVAL_MS);
    };
    const stopPolling = () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        stopPolling();
      } else {
        fetchKPIs(selectedPeriod);
        startPolling();
      }
    };

    startPolling();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      stopPolling();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPeriod]);

  const cardEntries = useMemo(() => {
    if (!payload?.data) return [];
    return Object.keys(KPI_CARD_CONFIG)
      .filter((key) => payload.data[key])
      .map((key) => [key, payload.data[key]]);
  }, [payload]);

  // Met brièvement en avant une carte dont la valeur vient de changer
  // (retour visuel "les données bougent vraiment"). Désactivé si
  // l'utilisateur préfère moins d'animations.
  useEffect(() => {
    if (cardEntries.length === 0) return undefined;

    const prefersReducedMotion =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      cardEntries.forEach(([key, kpi]) => {
        prevValuesRef.current[key] = kpi.value;
      });
      return undefined;
    }

    const changed = new Set();
    cardEntries.forEach(([key, kpi]) => {
      const prev = prevValuesRef.current[key];
      if (prev !== undefined && prev !== kpi.value) changed.add(key);
      prevValuesRef.current[key] = kpi.value;
    });

    if (changed.size === 0) return undefined;

    setPulsingKeys(changed);
    const timer = setTimeout(() => setPulsingKeys(new Set()), 1000);
    return () => clearTimeout(timer);
  }, [cardEntries]);

  const handleLogout = async () => {
    await fetch('/api/dashboard/auth', { method: 'DELETE' });
    window.location.reload();
  };

  const handleExport = () => {
    window.open(`/api/kpis?period=${selectedPeriod}&format=csv`, '_blank');
  };

  const handleRetry = () => fetchKPIs(selectedPeriod);

  return (
    <div className={styles.wrapper}>
      <a href="#dashboard-main" className="skip-link">
        Aller au contenu principal
      </a>

      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>CTJE · Espace interne</p>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>Dashboard KPIs — Impact</h1>
            <span className={styles.liveBadge} role="status">
              <span className={styles.liveDot} aria-hidden="true" />
              En direct
            </span>
          </div>
          <p className={styles.subtitle}>
            Actualisation automatique toutes les {POLL_INTERVAL_MS / 1000}&nbsp;secondes
            {lastUpdated && (
              <>
                {' '}
                · dernière mise à jour{' '}
                <time dateTime={lastUpdated.toISOString()}>{lastUpdated.toLocaleTimeString('fr-FR')}</time>
              </>
            )}
          </p>
        </div>

        <div className={styles.toolbar}>
          <div className={styles.toolbarField}>
            <label htmlFor="dashboard-period" className={styles.toolbarLabel}>
              Période
            </label>
            <select
              id="dashboard-period"
              className={styles.periodSelect}
              value={selectedPeriod || ''}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              {(payload?.availablePeriods || []).map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <button type="button" className={styles.exportButton} onClick={handleExport} disabled={!selectedPeriod}>
            <DownloadIcon />
            Exporter en CSV
          </button>

          <button type="button" className={styles.logoutButton} onClick={handleLogout}>
            <LogoutIcon />
            <span className={styles.logoutLabel}>Déconnexion</span>
          </button>
        </div>
      </header>

      {/* Annoncé aux lecteurs d'écran uniquement lors des changements
          d'état significatifs (erreur / rétablissement) — pas à chaque
          cycle de rafraîchissement, pour ne pas les submerger. */}
      <p className={styles.visuallyHidden} role="status" aria-live="polite">
        {error}
      </p>

      {error && (
        <div className={styles.errorBanner} role="alert">
          <Icons.AlertCircle size={18} />
          <span>{error}</span>
          <button type="button" className={styles.retryButton} onClick={handleRetry}>
            Réessayer
          </button>
        </div>
      )}

      <main id="dashboard-main">
        {!payload ? (
          <div className={styles.grid} aria-busy="true">
            <p className={styles.visuallyHidden} role="status">
              Chargement des indicateurs en cours…
            </p>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className={styles.skeletonCard} aria-hidden="true">
                <div className={styles.skeletonIcon} />
                <div className={styles.skeletonLine} style={{ width: '70%' }} />
                <div className={styles.skeletonLine} style={{ width: '45%', height: '2rem' }} />
                <div className={styles.skeletonLine} style={{ width: '85%' }} />
              </div>
            ))}
          </div>
        ) : (
          <section className={styles.grid} aria-label="Indicateurs clés de performance">
            {cardEntries.map(([key, kpi]) => {
              const config = KPI_CARD_CONFIG[key];
              const Icon = config.icon;
              const ringPercent = config.target ? (kpi.value / config.target) * 100 : 0;
              const isOk = kpi.status === 'ok';

              return (
                <article
                  key={key}
                  className={`${styles.card} ${isOk ? styles.cardOk : styles.cardWarning} ${
                    pulsingKeys.has(key) ? styles.cardPulse : ''
                  }`}
                >
                  <div className={styles.cardTop}>
                    <span className={styles.cardIconWrap} aria-hidden="true">
                      <Icon size={20} />
                    </span>
                    <ProgressRing percent={ringPercent} tone={kpi.status} />
                  </div>

                  <h2 className={styles.cardLabel}>{kpi.label}</h2>

                  <p className={styles.cardValue}>
                    {kpi.value.toLocaleString('fr-FR')}
                    <span className={styles.cardUnit}>{kpi.unit}</span>
                  </p>

                  <p className={styles.cardTarget}>Cible : {kpi.targetLabel}</p>

                  <span className={`${styles.statusPill} ${isOk ? styles.statusPillOk : styles.statusPillWarning}`}>
                    {isOk ? <Icons.Check size={14} /> : <Icons.AlertCircle size={14} />}
                    {isOk ? 'Objectif atteint' : "Sous l'objectif"}
                  </span>

                  <p className={styles.cardDetail}>{config.detail(kpi.raw)}</p>
                </article>
              );
            })}
          </section>
        )}
      </main>
    </div>
  );
}