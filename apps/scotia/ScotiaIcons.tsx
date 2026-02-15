
import React from 'react';

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

export const ScotiaLogoSVG = ({ color = "#ec121f", className = "" }: { color?: string, className?: string }) => (
  <svg viewBox="0 0 80.73 89.45" className={className} xmlns="http://www.w3.org/2000/svg">
    <path fill={color} d="M65.68,16.68H40.37A28,28,0,0,0,12.49,41.61h0A28.06,28.06,0,0,1,37,0H80.73Z"/>
    <path fill={color} d="M15.05,72.78H40.37A28.06,28.06,0,0,0,68.25,47.85h0a28,28,0,0,1-24.56,41.6H0Z"/>
    <circle fill={color} cx="40.37" cy="44.73" r="22.53"/>
  </svg>
);

export const RBOSLogoSVG = ({ color = "white", className = "" }: { color?: string, className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(50, 60)">
      <text 
        x="0" 
        y="0" 
        font-family="Urbanist, sans-serif" 
        font-weight="900" 
        font-size="40" 
        fill={color} 
        text-anchor="middle"
        letter-spacing="-2"
      >RBOS</text>
    </g>
  </svg>
);

export const AdviceIcon = ({ size = 24, color = "currentColor", className = "" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2v8M12 14v8M2 12h8M14 12h8M6 6l4 4M14 14l4 4M6 18l4-4M14 10l4-4"/>
  </svg>
);

export const SceneIcon = ({ size = 24, color = "currentColor", className = "" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="3"/><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="19" r="1.5"/><circle cx="5" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>
  </svg>
);

export const InfoIcon = ({ size = 16, color = "currentColor", className = "" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
  </svg>
);

export const AlertIcon = ({ size = 24, color = "currentColor", className = "" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

export const HomeIcon = ({ size = 24, color = "currentColor", className = "" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

export const MoveIcon = ({ size = 24, color = "currentColor", className = "" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="10" width="18" height="12" rx="2" ry="2"/>
    <path d="M7 10V7a5 5 0 0 1 10 0v3"/>
    <path d="M12 14v4M10 16h4"/>
  </svg>
);

export const PayIcon = ({ size = 24, color = "currentColor", className = "" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M12 11h.01"/>
  </svg>
);

export const MoreIcon = ({ size = 24, color = "currentColor", className = "" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

export const BackIcon = ({ size = 24, color = "currentColor", className = "" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m15 18-6-6 6-6"/>
  </svg>
);

export const ChevronRightIcon = ({ size = 20, color = "currentColor", className = "" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m9 18 6-6-6-6"/>
  </svg>
);

export const ChevronDownIcon = ({ size = 16, color = "currentColor", className = "" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m6 9 6 6 6-6"/>
  </svg>
);

export const SearchIcon = ({ size = 24, color = "currentColor", className = "" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
  </svg>
);

export const TelegramIcon = ({ size = 24, color = "#0088cc", className = "" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className}>
    <path d="m20.665 3.717-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l.002.001-.314 4.692c.46 0 .663-.211.921-.46l2.211-2.15 4.599 3.397c.848.467 1.457.227 1.668-.785l3.019-14.228c.309-1.239-.473-1.8-1.282-1.434z" />
  </svg>
);

export const SendIcon = ({ size = 24, color = "currentColor", className = "" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

export const GiftIcon = ({ size = 24, color = "currentColor", className = "" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
  </svg>
);