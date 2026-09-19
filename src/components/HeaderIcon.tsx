import React from 'react';
import { IconType } from '../types';

interface HeaderIconProps {
  iconType?: IconType;
  iconUrl?: string;
  className?: string;
  color?: string;
}

export const HeaderIcon: React.FC<HeaderIconProps> = ({ 
  iconType = 'sparkles', 
  iconUrl, 
  className = 'w-4 h-4',
  color
}) => {
  if (iconUrl) {
    return (
      <img 
        src={iconUrl} 
        alt="Icône" 
        className={`${className} max-w-full max-h-full object-contain`}
        referrerPolicy="no-referrer"
      />
    );
  }

  const svgStyle: React.CSSProperties | undefined = color ? { color } : undefined;
  const baseClass = `${className} overflow-visible drop-shadow-[0_1px_1.5px_rgba(0,0,0,0.22)]`;

  switch (iconType) {
    case 'timer':
      return (
        <svg viewBox="-1 -1 26 26" style={svgStyle} className={baseClass} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="2" x2="12" y2="4" />
          <circle cx="12" cy="14" r="8" />
          <polyline points="12 10 12 14 15 14" />
        </svg>
      );
    case 'shield':
      return (
        <svg viewBox="-1 -1 26 26" style={svgStyle} className={baseClass} fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
    case 'shield-check':
      return (
        <svg viewBox="-1 -1 26 26" style={svgStyle} className={baseClass} fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <polyline points="9 12 11 14 15 10" strokeWidth="2.5" fill="none" />
        </svg>
      );
    case 'swords':
      return (
        <svg viewBox="-1 -1 26 26" style={svgStyle} className={baseClass} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" />
          <line x1="13" y1="19" x2="19" y2="13" />
          <line x1="16" y1="16" x2="20" y2="20" />
          <line x1="19" y1="21" x2="21" y2="19" />
        </svg>
      );
    case 'zap':
      return (
        <svg viewBox="-1 -1 26 26" style={svgStyle} className={baseClass} fill="currentColor">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
    case 'crown':
      return (
        <svg viewBox="-1 -1 26 26" style={svgStyle} className={baseClass} fill="currentColor" fillOpacity="0.14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
        </svg>
      );
    case 'target':
      return (
        <svg viewBox="-1 -1 26 26" style={svgStyle} className={baseClass} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="5" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        </svg>
      );
    case 'dice':
      return (
        <svg viewBox="-1 -1 26 26" style={svgStyle} className={baseClass} fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <circle cx="8" cy="8" r="1.2" fill="currentColor" />
          <circle cx="16" cy="8" r="1.2" fill="currentColor" />
          <circle cx="12" cy="12" r="1.2" fill="currentColor" />
          <circle cx="8" cy="16" r="1.2" fill="currentColor" />
          <circle cx="16" cy="16" r="1.2" fill="currentColor" />
        </svg>
      );
    case 'flame':
      return (
        <svg viewBox="-1 -1 26 26" style={svgStyle} className={baseClass} fill="currentColor">
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
        </svg>
      );
    case 'heart':
      return (
        <svg viewBox="-1 -1 26 26" style={svgStyle} className={baseClass} fill="currentColor">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
      );
    case 'goose':
      return (
        <svg viewBox="-1 -1 26 26" style={svgStyle} className={baseClass} fill="currentColor">
          <path d="M12 4c-2 0-3.5 1.5-3 3.5 0.5 1.5 2 2.5 2 4 0 2-2 4-5 5 0 1 1 3 3 3 3 0 7-1 9-5 2-3 1-6-1-7-1-0.5-2-2-2-3 0-0.5-1-0.5-3-0.5z" />
        </svg>
      );
    case 'refresh-cw':
      return (
        <svg viewBox="-1 -1 26 26" style={svgStyle} className={baseClass} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
          <path d="M21 3v5h-5" />
          <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
          <path d="M3 21v-5h5" />
        </svg>
      );
    case 'sparkles':
    default:
      return (
        <svg viewBox="-1 -1 26 26" style={svgStyle} className={baseClass} fill="currentColor">
          <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z" />
        </svg>
      );
  }
};
