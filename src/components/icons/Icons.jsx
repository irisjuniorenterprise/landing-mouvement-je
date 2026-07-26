import React from 'react';

// strokeWidth passé à 1.5 par défaut pour un rendu plus fin et premium
//
// Accessibilité : une icône est décorative par défaut (elle accompagne
// toujours un texte ou est portée par un bouton/lien déjà labellisé).
// On la masque donc automatiquement aux technologies d'assistance via
// aria-hidden="true" + focusable="false".
// Si un composant appelant fournit un aria-label ou un role="img" (icône
// porteuse de sens, sans texte visible à côté), on considère qu'elle doit
// être exposée : on n'ajoute alors ni aria-hidden ni focusable="false".
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
  // ============================================================
  // ICÔNES EXISTANTES (versions affinées, conservées telles quelles)
  // ============================================================

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

  Home: (props) => (
    <IconWrapper {...props}>
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <path d="M9 22V12h6v10" />
    </IconWrapper>
  ),

  Mail: (props) => (
    <IconWrapper {...props}>
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </IconWrapper>
  ),

  Phone: (props) => (
    <IconWrapper {...props}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </IconWrapper>
  ),

  MapPin: (props) => (
    <IconWrapper {...props}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </IconWrapper>
  ),

  ArrowRight: (props) => (
    <IconWrapper {...props}>
      <path d="M5 12h14M12 5l7 7-7 7" />
    </IconWrapper>
  ),

  Check: (props) => (
    <IconWrapper {...props}>
      <path d="M20 6 9 17l-5-5" />
    </IconWrapper>
  ),

  AlertCircle: (props) => (
    <IconWrapper {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4M12 16h.01" />
    </IconWrapper>
  ),

  Users: (props) => (
    <IconWrapper {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </IconWrapper>
  ),

  Building: (props) => (
    <IconWrapper {...props}>
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01" />
    </IconWrapper>
  ),

  Briefcase: (props) => (
    <IconWrapper {...props}>
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </IconWrapper>
  ),

  Calendar: (props) => (
    <IconWrapper {...props}>
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </IconWrapper>
  ),

  Loader: (props) => (
    <IconWrapper {...props} className={`animate-spin ${props.className || ''}`}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </IconWrapper>
  ),

  ChevronDown: (props) => (
    <IconWrapper {...props}>
      <path d="m6 9 6 6 6-6" />
    </IconWrapper>
  ),

  Send: (props) => (
    <IconWrapper {...props}>
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </IconWrapper>
  ),

  Map: (props) => (
    <IconWrapper {...props}>
      <path d="M3 6v16l6-4 6 4 6-4V2l-6 4-6-4z" />
      <path d="M9 2v16M15 6v16" />
    </IconWrapper>
  ),

  // ============================================================
  // ICÔNES AJOUTÉES (issues de Icons.tsx)
  // ============================================================

  User: (props) => (
    <IconWrapper strokeWidth={2} {...props}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </IconWrapper>
  ),

  UserCircle: (props) => (
    <IconWrapper strokeWidth={2} {...props}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </IconWrapper>
  ),

  Message: (props) => (
    <IconWrapper strokeWidth={2} {...props}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </IconWrapper>
  ),

  Edit: (props) => (
    <IconWrapper strokeWidth={2} {...props}>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </IconWrapper>
  ),

  Shield: (props) => (
    <IconWrapper strokeWidth={2} {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </IconWrapper>
  ),

  Alert: (props) => (
    <IconWrapper strokeWidth={2} {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4M12 16h.01" />
    </IconWrapper>
  ),

  ChevronRight: (props) => (
    <IconWrapper strokeWidth={2} {...props}>
      <path d="m9 18 6-6-6-6" />
    </IconWrapper>
  ),

  ChevronLeft: (props) => (
    <IconWrapper strokeWidth={2} {...props}>
      <path d="m15 18-6-6 6-6" />
    </IconWrapper>
  ),

  Code: (props) => (
    <IconWrapper strokeWidth={2} {...props}>
      <path d="m16 18 6-6-6-6" />
      <path d="m8 6-6 6 6 6" />
    </IconWrapper>
  ),

  CodeSlash: (props) => (
    <IconWrapper strokeWidth={2} {...props}>
      <path d="m8 7-5 5 5 5" />
      <path d="M14 5 10 19" />
      <path d="m16 7 5 5-5 5" />
    </IconWrapper>
  ),

  Globe: (props) => (
    <IconWrapper strokeWidth={2} {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </IconWrapper>
  ),

  Megaphone: (props) => (
    <IconWrapper strokeWidth={2} {...props}>
      <path d="M3 11 21 6v12L3 14v-3z" />
      <path d="M6 14v4a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-4" />
    </IconWrapper>
  ),

  MarketingMegaphone: (props) => (
    <IconWrapper strokeWidth={2} {...props}>
      <path d="m3 11 18-5v12L3 14v-3z" />
      <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
    </IconWrapper>
  ),

  Chart: (props) => (
    <IconWrapper strokeWidth={2} {...props}>
      <path d="M21 12v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h3" />
      <path d="M15 6h6v6" />
      <path d="M10 14 21 3" />
    </IconWrapper>
  ),

  BarChart: (props) => (
    <IconWrapper strokeWidth={2} {...props}>
      <path d="M18 20V10" />
      <path d="M12 20V4" />
      <path d="M6 20v-6" />
    </IconWrapper>
  ),

  TrendUp: (props) => (
    <IconWrapper strokeWidth={2} {...props}>
      <path d="M3 20v-4" />
      <path d="M8 20v-7" />
      <path d="M13 20v-9" />
      <path d="M18 20v-5" />
      <path d="M2 13.5l4-4.5 4.5 3.5 11.5-10" />
      <path d="M17 2.5h5v5" />
    </IconWrapper>
  ),

  Palette: (props) => (
    <IconWrapper strokeWidth={2} {...props}>
      <circle cx="13.5" cy="6.5" r="0.5" />
      <circle cx="17.5" cy="10.5" r="0.5" />
      <circle cx="8.5" cy="7.5" r="0.5" />
      <circle cx="6.5" cy="12.5" r="0.5" />
      <path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10a2 2 0 0 0 2-2c0-.52-.2-1-.53-1.37-.33-.37-.47-.85-.47-1.37 0-1.1.9-2 2-2h2.5c1.66 0 3-1.34 3-3 0-4.41-4.49-8-10-8z" />
    </IconWrapper>
  ),

  Share: (props) => (
    <IconWrapper strokeWidth={2} {...props}>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="m8.59 13.51 6.83 3.98" />
      <path d="m15.41 6.51-6.82 3.98" />
    </IconWrapper>
  ),

  Target: (props) => (
    <IconWrapper strokeWidth={2} {...props}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </IconWrapper>
  ),

  Heart: (props) => (
    <IconWrapper strokeWidth={2} {...props}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </IconWrapper>
  ),

  Coin: (props) => (
    <IconWrapper strokeWidth={2} {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2v20" />
      <path d="M22 12H2" />
    </IconWrapper>
  ),

  Clock: (props) => (
    <IconWrapper strokeWidth={2} {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </IconWrapper>
  ),

  CreditCard: (props) => (
    <IconWrapper strokeWidth={2} {...props}>
      <rect width="22" height="16" x="1" y="4" rx="2" ry="2" />
      <path d="M1 10h22" />
    </IconWrapper>
  ),

  GraduationCap: (props) => (
    <IconWrapper strokeWidth={2} {...props}>
      <path d="M22 10v6M2 10l10-5 10 5-10 5-10-5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </IconWrapper>
  ),

  Smartphone: (props) => (
    <IconWrapper strokeWidth={2} {...props}>
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
      <path d="M12 18h.01" />
      <path d="M9 7h6" />
      <path d="M9 11h4" />
    </IconWrapper>
  ),

  MobileDev: (props) => (
    <IconWrapper strokeWidth={2} {...props}>
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <path d="M12 18h.01" />
      <path d="M9.5 9.5 7 12l2.5 2.5" />
      <path d="M14.5 9.5 17 12l-2.5 2.5" />
    </IconWrapper>
  ),

  WebDevBrowser: (props) => (
    <IconWrapper strokeWidth={2} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <path d="M3 9h18" />
      <path d="m10 13-2 2 2 2" />
      <path d="m14 13 2 2-2 2" />
    </IconWrapper>
  ),

  Chatbot: (props) => (
    <IconWrapper strokeWidth={2} {...props}>
      <defs>
        <mask id="chatbot-solid-mask">
          <rect x="0" y="0" width="24" height="24" fill="white" />
          <circle cx="9.5" cy="13" r="1.2" fill="black" stroke="none" />
          <circle cx="14.5" cy="13" r="1.2" fill="black" stroke="none" />
          <path d="M9.5 15.5c1 1 4 1 5 0" stroke="black" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </mask>
      </defs>
      <circle cx="12" cy="3" r="1.5" fill="currentColor" stroke="none" />
      <path d="M12 4v5.5" />
      <path d="M5.5 11.5V10a6.5 6.5 0 0 1 13 0v1.5" />
      <rect x="3.5" y="11" width="3" height="4.5" rx="1.5" fill="currentColor" stroke="none" />
      <rect x="17.5" y="11" width="3" height="4.5" rx="1.5" fill="currentColor" stroke="none" />
      <rect
        x="6"
        y="9.5"
        width="12"
        height="8"
        rx="2.5"
        fill="currentColor"
        stroke="none"
        mask="url(#chatbot-solid-mask)"
      />
      <path d="M18.5 14v4a3 3 0 0 1-3 3h-3.5v-2" />
    </IconWrapper>
  ),

  Handshake: (props) => (
    <IconWrapper strokeWidth={2} {...props}>
      <path d="M17 11v5" />
      <path d="M7 11v5" />
      <path d="M3 9l4-4 4 4" />
      <path d="M21 9l-4-4-4 4" />
      <path d="M3 9v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9" />
      <path d="M7 9h10" />
    </IconWrapper>
  ),

  FileText: (props) => (
    <IconWrapper strokeWidth={2} {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
      <path d="M10 9H8" />
    </IconWrapper>
  ),

  Lock: (props) => (
    <IconWrapper strokeWidth={2} {...props}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </IconWrapper>
  ),

  FileCheck: (props) => (
    <IconWrapper strokeWidth={2} {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="m9 15 2 2 4-4" />
    </IconWrapper>
  ),

  Scale: (props) => (
    <IconWrapper strokeWidth={2} {...props}>
      <path d="M3 3v18h18" />
      <path d="m7 7 10 10" />
      <path d="m7 17 10-10" />
    </IconWrapper>
  ),

  LawScale: (props) => (
    <IconWrapper strokeWidth={2} {...props}>
      <path d="M8 21h8" />
      <path d="M12 3v18" />
      <circle cx="12" cy="5" r="2" />
      <path d="M3 7h18" />
      <path d="M2 16c.87.65 1.92 1 3 1s2.13-.35 3-1l-3-9-3 9z" />
      <path d="M16 16c.87.65 1.92 1 3 1s2.13-.35 3-1l-3-9-3 9z" />
    </IconWrapper>
  ),

  Info: (props) => (
    <IconWrapper strokeWidth={2} {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </IconWrapper>
  ),

  Eye: (props) => (
    <IconWrapper strokeWidth={2} {...props}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </IconWrapper>
  ),

  GitBranch: (props) => (
    <IconWrapper strokeWidth={2} {...props}>
      <path d="M6 3v12" />
      <circle cx="18" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M18 9a9 9 0 0 1-9 9" />
    </IconWrapper>
  ),

  Crown: (props) => (
    <IconWrapper strokeWidth={2} {...props}>
      <path d="M2 8l3 12h14l3-12-5 4-5-4-5 4-5-4z" />
      <path d="M2 8l3-4 5 2 5-2 5 4" />
    </IconWrapper>
  ),

  HelpCircle: (props) => (
    <IconWrapper strokeWidth={2} {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </IconWrapper>
  ),

  Search: (props) => (
    <IconWrapper strokeWidth={2} {...props}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </IconWrapper>
  ),

  Innovation: (props) => (
    <IconWrapper strokeWidth={2} {...props}>
      <path d="M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.5 3.5 0 0 0 10.5 19h3" />
    </IconWrapper>
  ),

  Resourcefulness: (props) => (
    <IconWrapper strokeWidth={2} {...props}>
      <path d="M12 2 2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </IconWrapper>
  ),

  Inspiration: (props) => (
    <IconWrapper strokeWidth={2} {...props}>
      <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </IconWrapper>
  ),

  Strategy: (props) => (
    <IconWrapper strokeWidth={2} {...props}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </IconWrapper>
  ),

  Professionalism: (props) => (
    <IconWrapper strokeWidth={2} {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </IconWrapper>
  ),

  Engagement: (props) => (
    <IconWrapper strokeWidth={2} {...props}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </IconWrapper>
  ),

  Education: (props) => (
    <IconWrapper strokeWidth={2} {...props}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <path d="M10 8h6" />
      <path d="M10 12h4" />
    </IconWrapper>
  ),

  Business: (props) => (
    <IconWrapper strokeWidth={2} {...props}>
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </IconWrapper>
  ),

  Business_dep: (props) => (
    <IconWrapper strokeWidth={2} {...props}>
      <defs>
        <mask id="studies-arrow-mask">
          <rect x="0" y="0" width="24" height="24" fill="white" />
          <path
            d="M2 15L9 8L13 12L21 4"
            stroke="black"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polygon points="14 4 21 4 21 11" fill="black" stroke="black" strokeWidth="6" strokeLinejoin="round" />
        </mask>
      </defs>
      <g mask="url(#studies-arrow-mask)" fill="currentColor" stroke="none">
        <rect x="3" y="13" width="3.5" height="9" rx="1" />
        <rect x="8.5" y="10" width="3.5" height="12" rx="1" />
        <rect x="14" y="7" width="3.5" height="15" rx="1" />
        <rect x="19.5" y="4" width="3.5" height="18" rx="1" />
      </g>
      <path d="M2 15L9 8L13 12L21 4" stroke="currentColor" strokeWidth="2" fill="none" />
      <polygon points="15 4 21 4 21 10" fill="currentColor" stroke="currentColor" strokeWidth="1.5" />
    </IconWrapper>
  ),

  WalletMoney: (props) => (
    <IconWrapper strokeWidth={2} {...props}>
      <path d="M8 11V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v5" />
      <path d="M8 6a2 2 0 0 0 2-2" />
      <path d="M16 6a2 2 0 0 1-2-2" />
      <path d="M10 11a2 2 0 0 1 4 0" />
      <path d="M9 8H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2H7.5" />
    </IconWrapper>
  ),

  PenDraw: (props) => (
    <IconWrapper {...props}>
      <path d="M3 13c1 0 2-2 4-2s2 4 4 4 2-2 3-2" />
      <path d="M17.5 4.5a2.121 2.121 0 0 1 3 3L13 15l-4 1 1-4 7.5-7.5z" />
      <path d="M16 6l2 2" />
      <path d="M12.5 13.5l1 1" />
      <path d="M19.5 6.5l1.5 1.5" />
    </IconWrapper>
  ),

  WebsiteCookie: (props) => (
    <IconWrapper strokeWidth={2} {...props}>
      <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5z" />
      <path d="M6 14h.01" strokeWidth="3" />
      <path d="M11 17h.01" strokeWidth="3" />
      <path d="M16 14h.01" strokeWidth="3" />
      <path d="M10 10h.01" strokeWidth="3" />
      <path d="M7 8h.01" strokeWidth="3" />
    </IconWrapper>
  ),

  VisibilitySurvey: (props) => (
    <IconWrapper strokeWidth={2} {...props}>
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M7 13c1.5-2 3.5-3 5-3s3.5 1 5 3c-1.5 2-3.5 3-5 3s-3.5-1-5-3z" />
      <circle cx="12" cy="13" r="1.5" />
    </IconWrapper>
  ),

  BusinessPlanDoc: (props) => (
    <IconWrapper strokeWidth={2} {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="m8 16 2.5-2.5 2 2 3.5-3.5" />
    </IconWrapper>
  ),

  ServicePro: (props) => (
    <IconWrapper {...props}>
      <circle cx="12" cy="8" r="7" />
      <path d="m8.21 13.89-1.21 9.11 5-3 5 3-1.21-9.12" />
    </IconWrapper>
  ),

  FlexibleSliders: (props) => (
    <IconWrapper strokeWidth={2} {...props}>
      <path d="M4 21v-7" />
      <path d="M4 10V3" />
      <path d="M12 21v-9" />
      <path d="M12 8V3" />
      <path d="M20 21v-5" />
      <path d="M20 12V3" />
      <path d="M1 14h6" />
      <path d="M9 8h6" />
      <path d="M17 16h6" />
    </IconWrapper>
  ),

  FlexibleSolutions: (props) => (
    <IconWrapper strokeWidth={2} {...props}>
      <path d="M4 6h8" />
      <circle cx="14" cy="6" r="2" />
      <path d="M16 6h4" />
      <path d="M4 12h2" />
      <circle cx="8" cy="12" r="2" />
      <path d="M10 12h10" />
      <path d="M4 18h10" />
      <circle cx="16" cy="18" r="2" />
      <path d="M18 18h2" />
    </IconWrapper>
  ),

  EagleLogo: (props) => (
    <IconWrapper viewBox="0 0 196 196" fill="currentColor" {...props}>
      <g transform="translate(0, 196) scale(0.100000, -0.100000)" fill="#1a3969" stroke="none">
        <path
          d="M895 1929 c-105 -8 -154 -18 -250 -54 -288 -108 -514 -358 -597 -660
        -31 -116 -31 -364 0 -480 87 -318 320 -565 634 -670 106 -36 122 -39 258 -43
        168 -5 243 8 387 64 278 107 489 342 575 640 31 108 33 380 4 489 -43 162
        -147 337 -266 449 -212 200 -452 285 -745 265z m333 -88 c93 -27 221 -91 294
        -147 86 -66 184 -180 237 -274 49 -86 100 -224 88 -236 -4 -4 -48 14 -99 39
        -107 52 -166 71 -290 92 -130 23 -182 14 -235 -41 l-42 -43 -10 47 c-5 26 -8
        49 -5 51 3 3 33 13 67 22 34 10 89 25 122 34 73 21 235 16 305 -9 l45 -16 -48
        45 c-59 54 -151 99 -231 114 -123 22 -269 10 -348 -30 -72 -37 -161 -132 -215
        -231 -47 -85 -93 -203 -82 -211 2 -2 28 -1 57 1 37 3 52 8 52 18 0 8 12 38 26
        66 l26 51 21 -21 c20 -21 20 -23 4 -57 -22 -46 -22 -45 16 -45 63 1 158 28
        254 73 54 25 116 48 138 51 22 4 140 1 261 -6 l222 -12 11 -67 c6 -37 11 -100
        11 -138 l0 -71 -82 83 c-94 94 -164 134 -287 161 -100 22 -135 20 -184 -8 -57
        -33 -159 -76 -232 -97 l-60 -18 42 0 c147 -3 378 -61 519 -131 88 -44 216
        -132 235 -163 8 -11 -19 -97 -29 -97 -4 0 -27 23 -50 51 -89 102 -246 199
        -403 247 -72 22 -292 56 -330 50 -22 -3 -20 -6 26 -37 128 -88 250 -239 276
        -341 7 -27 16 -50 20 -50 4 0 10 20 13 45 4 25 11 45 16 45 14 0 86 -89 108
        -134 12 -23 34 -78 51 -123 l30 -82 -37 -31 c-20 -16 -39 -30 -43 -30 -4 0 -9
        22 -13 49 -4 27 -18 76 -32 108 l-26 58 -17 -25 c-31 -46 -64 -81 -73 -78 -6
        2 -19 36 -29 75 -22 90 -75 203 -125 270 -53 71 -154 136 -234 152 -34 7 -63
        11 -65 9 -2 -2 19 -29 46 -61 34 -38 62 -85 86 -144 33 -82 36 -95 35 -188 0
        -55 -6 -113 -12 -129 -6 -16 -8 -32 -4 -35 8 -9 80 77 102 123 l19 40 14 -25
        c20 -35 17 -211 -5 -269 -29 -76 -36 -80 -150 -80 -153 0 -256 20 -375 73
        l-45 20 76 21 c183 53 277 192 248 370 -13 81 -20 100 -59 158 -33 49 -58 74
        -67 66 -3 -3 0 -27 7 -52 20 -79 7 -185 -31 -263 -50 -101 -148 -191 -243
        -222 -36 -12 -41 -11 -78 15 -88 60 -193 192 -259 323 -85 170 -108 417 -57
        614 90 341 363 593 717 661 14 2 93 3 175 1 117 -2 166 -7 223 -24z m-90 -546
        c19 -42 14 -74 -17 -106 -37 -36 -99 -41 -131 -9 -25 25 -25 32 -2 53 16 15
        19 15 30 -3 14 -22 52 -26 70 -8 16 16 15 43 -3 58 -12 10 -13 16 -4 26 18 22
        45 16 57 -11z"
        />
        <path
          d="M890 1501 c-90 -30 -188 -92 -261 -165 -38 -37 -69 -72 -69 -78 0 -5
        26 9 58 30 31 22 67 43 78 46 21 6 21 5 16 -84 -2 -49 -3 -90 0 -90 3 0 13 21
        23 48 19 50 93 171 129 211 11 13 43 41 69 62 55 44 44 49 -43 20z"
        />
        <path
          d="M549 1153 c-165 -169 -188 -223 -158 -365 9 -44 21 -63 65 -107 30
        -30 56 -52 59 -49 3 2 -2 23 -11 46 -19 47 -13 101 15 126 40 36 238 100 356
        114 l70 8 -53 17 c-28 9 -90 19 -137 23 l-85 7 0 36 c0 52 -23 231 -30 231 -3
        0 -44 -39 -91 -87z"
        />
      </g>
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
};