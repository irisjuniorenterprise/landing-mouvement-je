'use client';

import { useEffect, useState, useCallback } from 'react';
import styles from './dashboard.module.css';

const POLL_INTERVAL_MS = 8000;

export default function DashboardClient() {
  const [payload, setPayload] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

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
      setError('Impossible de récupérer les KPIs pour le moment.');
    }
  }, []);

  useEffect(() => {
    fetchKPIs(selectedPeriod);
    const interval = setInterval(() => fetchKPIs(selectedPeriod), POLL_INTERVAL_MS);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPeriod]);

  const handleLogout = async () => {
    await fetch('/api/dashboard/auth', { method: 'DELETE' });
    window.location.reload();
  };

  const handleExport = () => {
    window.open(`/api/kpis?period=${selectedPeriod}&format=csv`, '_blank');
  };

  if (!payload) {
    return <div className={styles.loading}>Chargement des KPIs…</div>;
  }

  const { data, availablePeriods } = payload;
  const cards = [data.kpi1_formCompletion, data.kpi2_mapInteraction, data.kpi3_traffic, data.kpi4_satisfaction];

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard KPIs — Impact</h1>
          <p className={styles.subtitle}>
            Mise à jour automatique toutes les {POLL_INTERVAL_MS / 1000}s
            {lastUpdated && ` · dernière actualisation ${lastUpdated.toLocaleTimeString('fr-FR')}`}
          </p>
        </div>
        <div className={styles.headerActions}>
          <select
            className={styles.periodSelect}
            value={selectedPeriod || ''}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            {availablePeriods.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <button className={styles.exportButton} onClick={handleExport}>
            Exporter en CSV
          </button>
          <button className={styles.logoutButton} onClick={handleLogout}>
            Déconnexion
          </button>
        </div>
      </header>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.grid}>
        {cards.map((kpi) => (
          <article
            key={kpi.label}
            className={`${styles.card} ${kpi.status === 'ok' ? styles.cardOk : styles.cardWarning}`}
          >
            <h2 className={styles.cardLabel}>{kpi.label}</h2>
            <p className={styles.cardValue}>
              {kpi.value}
              <span className={styles.cardUnit}>{kpi.unit}</span>
            </p>
            <p className={styles.cardTarget}>Cible : {kpi.targetLabel}</p>
            <span className={styles.cardStatus}>
              {kpi.status === 'ok' ? '✔ Objectif atteint' : "⚠ Sous l'objectif"}
            </span>
          </article>
        ))}
      </div>
    </div>
  );
}