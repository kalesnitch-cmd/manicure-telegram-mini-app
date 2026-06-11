
// Custom design icons in deep-mint or currentColor to give a high-end salon feel

export const LotusIcon = ({ size = 20, color = 'var(--deep-mint)' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22C12 22 16 18 16 14C16 11.7909 14.2091 10 12 10C9.79086 10 8 11.7909 8 14C8 18 12 22 12 22Z" />
    <path d="M12 2C12 2 16 6 16 10C16 12.2091 14.2091 14 12 14C9.79086 14 8 12.2091 8 10C8 6 12 2 12 2Z" opacity="0.6" />
    <path d="M2 12C2 12 6 16 10 16C12.2091 16 14 14.2091 14 12C14 9.79086 12.2091 8 10 8C6 8 2 12 2 12Z" opacity="0.6" />
    <path d="M22 12C22 12 18 16 14 16C11.7909 16 10 14.2091 10 12C10 9.79086 11.7909 8 14 8C18 8 22 12 22 12Z" opacity="0.6" />
  </svg>
);

export const CalendarIcon = ({ size = 20, color = 'var(--deep-mint)' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

export const NailIcon = ({ size = 20, color = 'var(--deep-mint)' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    {/* Polish Bottle representation */}
    <path d="M10 2h4v5h-4z" />
    <path d="M7 7h10v11a4 4 0 0 1-4 4H11a4 4 0 0 1-4-4V7z" />
    <path d="M12 11v6" strokeDasharray="2 2" />
  </svg>
);

export const SparklesIcon = ({ size = 20, color = 'var(--deep-mint)' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5z" />
    <path d="M5 3l.8 2.2L8 6l-2.2.8L5 9l-.8-2.2L2 6l2.2-.8z" opacity="0.7" />
  </svg>
);

export const ClockIcon = ({ size = 16, color = 'var(--deep-mint)' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export const LocationIcon = ({ size = 16, color = 'var(--deep-mint)' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export const ShieldCleanIcon = ({ size = 20, color = 'var(--deep-mint)' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 11 2 2 4-4" />
  </svg>
);

export const GemIcon = ({ size = 20, color = 'var(--deep-mint)' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 3h12l4 6-10 13L2 9z" />
    <path d="M11 3 8 9l4 13 4-13-3-6" />
    <path d="M2 9h20" />
  </svg>
);

export const AwardIcon = ({ size = 20, color = 'var(--deep-mint)' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="7" />
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
  </svg>
);

export const CheckCircleIcon = ({ size = 48, color = 'var(--success)' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="22 4 12 14 9 11" />
  </svg>
);
