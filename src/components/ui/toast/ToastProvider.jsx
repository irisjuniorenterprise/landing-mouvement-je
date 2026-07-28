'use client';

import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { Icons } from '@/components/icons/Icons';
import styles from './Toast.module.css';

const ToastContext = createContext(null);

let idCounter = 0;

/**
 * Système de notifications légères (snackbars/toasts) monté une seule
 * fois à la racine de l'application (voir app/[locale]/layout.js) et
 * consommé n'importe où via useToast(). Pensé pour guider l'utilisateur
 * sans jamais bloquer son parcours — contrairement à une modale — par
 * exemple : "aucune Junior dans cette région", astuce d'utilisation de
 * la carte, confirmations diverses.
 *
 * Types disponibles : 'info' (par défaut) et 'warning'.
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
    clearTimeout(timers.current[id]);
    delete timers.current[id];
  }, []);

  const showToast = useCallback(
    ({ message, type = 'info', duration = 5000 }) => {
      const id = ++idCounter;
      setToasts((current) => [...current, { id, message, type }]);
      if (duration) {
        timers.current[id] = setTimeout(() => dismiss(id), duration);
      }
      return id;
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ showToast, dismiss }}>
      {children}

      <div className={styles.stack} aria-live="polite" aria-atomic="false">
        {toasts.map((toast) => (
          <div key={toast.id} className={`${styles.toast} ${styles[toast.type] || ''}`} role="status">
            <span className={styles.icon} aria-hidden="true">
              {toast.type === 'warning' ? <Icons.AlertCircle size={18} /> : <Icons.Info size={18} />}
            </span>
            <p className={styles.message}>{toast.message}</p>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={() => dismiss(toast.id)}
              aria-label="Fermer la notification"
            >
              <Icons.X size={15} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/** Hook d'accès au système de toasts : const { showToast } = useToast(); */
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast() doit être appelé à l'intérieur d'un <ToastProvider>.");
  }
  return ctx;
}