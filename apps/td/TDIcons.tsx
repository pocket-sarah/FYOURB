
import React from 'react';

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

export const TDLogoSVG = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 320 286" 
    className={className} 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path style={{ fill: "#008A00", fillOpacity: 1, fillRule: "nonzero", stroke: "none" }} d="M 0,0 320,0 320,286 0,286 0,0 z" />
    <g transform="scale(1, -1) translate(0, -286)">
      <g transform="translate(210.1, 61.9)">
        <path 
          style={{ fill: "#ffffff", fillOpacity: 1, fillRule: "nonzero", stroke: "none" }} 
          d="m 0,0 -74.5,0 0,134.3 37.4,0 0,-110.5 36,0 c 24.8,0 35.3,17.2 35.3,61.6 0,44.6 -11.9,57.6 -37.1,57.6 l -82.1,0 0,-142.9 -37.1,0 0,142.9 -54.4,0 0,23.8 185.1,0 c 44.7,0 65.9,-23.1 65.9,-81.1 C 74.5,9.4 42.8,0 0,0" 
        />
      </g>
    </g>
  </svg>
);

export const TDShieldSVG = ({ size = 32, color = "#008A00", className = "" }: { size?: number, color?: string, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 2L4 5V11C4 16.55 7.41 21.74 12 23C16.59 21.74 20 16.55 20 11V5L12 2Z" fill={color}/>
    <path d="M12 7V16M8 10L12 14L16 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const BackIcon = ({ size = 28, color = "currentColor", className = "" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m15 18-6-6 6-6"/>
  </svg>
);

export const MenuIcon = ({ size = 28, color = "currentColor", className = "" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

export const SearchIcon = ({ size = 24, color = "currentColor", className = "" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
  </svg>
);

export const BellIcon = ({ size = 24, color = "currentColor", className = "" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);

export const ChevronRightIcon = ({ size = 20, color = "currentColor", className = "" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m9 18 6-6-6-6"/>
  </svg>
);

export const InfoIcon = ({ size = 24, color = "currentColor", className = "" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
  </svg>
);

export const CameraIcon = ({ size = 24, color = "currentColor", className = "" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>
  </svg>
);