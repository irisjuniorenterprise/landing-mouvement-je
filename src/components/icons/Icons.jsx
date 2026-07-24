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
};