'use client';

import { useState } from 'react';
import styles from './dashboard.module.css';

export default function DashboardLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/dashboard/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        setError('Mot de passe incorrect.');
        setLoading(false);
        return;
      }

      window.location.reload();
    } catch {
      setError('Erreur de connexion.');
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginWrapper}>
      <form className={styles.loginCard} onSubmit={handleSubmit}>
        <h1 className={styles.loginTitle}>Dashboard KPIs</h1>
        <p className={styles.loginSubtitle}>Accès réservé à l&apos;équipe.</p>
        <input
          type="password"
          className={styles.loginInput}
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
        />
        {error && <p className={styles.loginError}>{error}</p>}
        <button type="submit" className={styles.loginButton} disabled={loading}>
          {loading ? 'Connexion…' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
}