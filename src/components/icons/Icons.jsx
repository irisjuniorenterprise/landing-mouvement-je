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
  MapPin: (props) => (
    <IconWrapper {...props}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </IconWrapper>
  ),

  ChevronDown: (props) => (
    <IconWrapper strokeWidth={2} {...props}>
      <path d="m6 9 6 6 6-6" />
    </IconWrapper>
  ),
  Calendar: (props) => (
    <IconWrapper {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </IconWrapper>
  ),
  Building: (props) => (
    <IconWrapper {...props}>
      <rect x="4" y="2" width="16" height="20" rx="1" />
      <path d="M9 22v-4h6v4M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01" />
    </IconWrapper>
  ),
  Briefcase: (props) => (
    <IconWrapper {...props}>
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </IconWrapper>
  ),

  Users: (props) => (
    <IconWrapper {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </IconWrapper>
  ),

  FileCheck: (props) => (
    <IconWrapper {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="m9 15 2 2 4-4" />
    </IconWrapper>
  ),

  Coin: (props) => (
    <IconWrapper {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M14.8 9a2.5 2.5 0 0 0-2.3-1.5h-1a2 2 0 0 0 0 4h1a2 2 0 0 1 0 4h-1A2.5 2.5 0 0 1 9.2 14" />
      <path d="M12 6v2M12 16v2" />
    </IconWrapper>
  ),

  ServicePro: (props) => (
    <IconWrapper {...props}>
      <path d="m12 15 3.5-3.5" />
      <path d="M20.42 4.58a5 5 0 0 0-7.08 0L12 5.92l-1.34-1.34a5 5 0 1 0-7.08 7.08l1.34 1.34L12 20.42l7.08-7.08 1.34-1.34a5 5 0 0 0 0-7.08Z" />
    </IconWrapper>
  ),

  GraduationCap: (props) => (
    <IconWrapper {...props}>
      <path d="M22 10 12 5 2 10l10 5 10-5Z" />
      <path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" />
    </IconWrapper>
  ),

  WalletMoney: (props) => (
    <IconWrapper {...props}>
      <path d="M20 12V8a2 2 0 0 0-2-2H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v3" />
      <path d="M20 12v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7" />
      <circle cx="16" cy="15" r="1.5" />
    </IconWrapper>
  ),
  PenDraw: (props) => (
    <IconWrapper {...props}>
      <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    </IconWrapper>
  ),

  User: (props) => (
    <IconWrapper {...props}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </IconWrapper>
  ),

  AlertCircle: (props) => (
    <IconWrapper strokeWidth={2} {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </IconWrapper>
  ),

  Heart: (props) => (
    <IconWrapper {...props}>
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" />
    </IconWrapper>
  ),

  Edit: (props) => (
    <IconWrapper {...props}>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z" />
    </IconWrapper>
  ),

  LawScale: (props) => (
    <IconWrapper {...props}>
      <path d="M12 3v18M6 8l-4 8a4 4 0 0 0 8 0ZM18 8l-4 8a4 4 0 0 0 8 0Z" />
      <path d="M4 21h16M6 8h12" />
    </IconWrapper>
  ),

  Check: (props) => (
    <IconWrapper strokeWidth={2.5} {...props}>
      <path d="M20 6 9 17l-5-5" />
    </IconWrapper>
  ),

  Send: (props) => (
    <IconWrapper {...props}>
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </IconWrapper>
  ),
  
  ChevronRight: (props) => (
    <IconWrapper strokeWidth={2} {...props}>
      <path d="m9 18 6-6-6-6" />
    </IconWrapper>
  ),

  Home: (props) => (
    <IconWrapper {...props}>
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
      <path d="M9 22V12h6v10" />
    </IconWrapper>
  ),
};