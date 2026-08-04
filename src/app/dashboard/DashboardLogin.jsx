'use client';

import { useId, useState } from 'react';
import { Icons } from '@/components/icons/Icons';
import styles from './dashboard.module.css';

/** Icône "œil barré" (non présente dans la bibliothèque partagée) — même
 * style (trait, currentColor) que les icônes de components/icons/Icons.jsx. */
function EyeOffIcon(props) {
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
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5 0-9.27-3.11-11-7.5a11.6 11.6 0 0 1 3.16-4.44M9.9 4.24A10.94 10.94 0 0 1 12 4c5 0 9.27 3.11 11 7.5a11.7 11.7 0 0 1-2.16 3.34" />
      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
      <path d="M1 1l22 22" />
    </svg>
  );
}

export default function DashboardLogin() {
  const passwordFieldId = useId();
  const errorId = useId();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/dashboard/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        setError('Mot de passe incorrect. Vérifiez et réessayez.');
        setLoading(false);
        return;
      }

      window.location.reload();
    } catch {
      setError('Erreur de connexion. Vérifiez votre réseau et réessayez.');
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginCard}>
        <span className={styles.loginBadge} aria-hidden="true">
          <Icons.Lock size={22} />
        </span>
        <p className={styles.loginEyebrow}>CTJE · Espace interne</p>
        <h1 className={styles.loginTitle}>Dashboard KPIs</h1>
        <p className={styles.loginSubtitle}>Accès réservé à l&apos;équipe du mouvement JE.</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className={styles.fieldGroup}>
            <label htmlFor={passwordFieldId} className={styles.fieldLabel}>
              Mot de passe
            </label>
            <div className={styles.passwordWrapper}>
              <input
                id={passwordFieldId}
                type={showPassword ? 'text' : 'password'}
                className={styles.loginInput}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                autoFocus
                required
                aria-invalid={Boolean(error)}
                aria-describedby={error ? errorId : undefined}
              />
              <button
                type="button"
                className={styles.togglePassword}
                onClick={() => setShowPassword((v) => !v)}
                aria-pressed={showPassword}
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              >
                {showPassword ? <EyeOffIcon /> : <Icons.Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <p id={errorId} className={styles.loginError} role="alert">
              <Icons.AlertCircle size={16} />
              {error}
            </p>
          )}

          <button type="submit" className={styles.loginButton} disabled={loading}>
            {loading ? (
              <>
                <Icons.Loader size={18} className={styles.spinner} />
                Connexion…
              </>
            ) : (
              'Se connecter'
            )}
          </button>
        </form>

        <a href="/" className={styles.backLink}>
          ← Retour au site
        </a>
      </div>
    </div>
  );
}