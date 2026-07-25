import React from 'react';

// Accessibilité : une icône est décorative par défaut (elle accompagne
// toujours un texte ou est portée par un bouton/lien déjà labellisé).
// On la masque donc automatiquement aux technologies d'assistance via
// aria-hidden="true" + focusable="false", sauf si le composant appelant
// fournit un aria-label ou un role="img" (icône porteuse de sens).
const IconWrapper = ({ children, size = 24, strokeWidth = 1.5, className = '', ...props }) => {
  const isMeaningful = props['aria-label'] != null || props.role === 'img';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={isMeaningful ? undefined : 'true'}
      focusable={isMeaningful ? undefined : 'false'}
      {...props}
    >
      {children}
    </svg>
  );
};

export const Icons = {
  Menu: (props) => (
    <IconWrapper {...props}>
      <path d="M3 12h18M3 6h18M3 18h18" />
    </IconWrapper>
  ),

  X: (props) => (
    <IconWrapper {...props}>
      <path d="M18 6 6 18M6 6l12 12" />
    </IconWrapper>
  ),
  Globe: (props) => (
    <IconWrapper strokeWidth={2} {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </IconWrapper>
  ),

  Phone: (props) => (
    <IconWrapper {...props}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </IconWrapper>
  ),

  Mail: (props) => (
    <IconWrapper {...props}>
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </IconWrapper>
  ),

  Linkedin: (props) => (
    <IconWrapper {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </IconWrapper>
  ),

  Instagram: (props) => (
    <IconWrapper {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <path d="M17.5 6.5h.01" />
    </IconWrapper>
  ),

  Facebook: (props) => (
    <IconWrapper {...props}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </IconWrapper>
  ),
  ArrowRight: (props) => (
    <IconWrapper strokeWidth={2} {...props}>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </IconWrapper>
  ),

  Map: (props) => (
    <IconWrapper {...props}>
      <path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z" />
      <path d="M15 5.764v15" />
      <path d="M9 3.236v15" />
    </IconWrapper>
  ),
};