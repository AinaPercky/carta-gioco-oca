import React from 'react';

interface EspressoMadagascarLogoProps {
  className?: string;
  variant?: 'light-bg' | 'dark-bg';
}

export const EspressoMadagascarLogo: React.FC<EspressoMadagascarLogoProps> = ({ 
  className = 'w-48 h-auto',
  variant = 'light-bg'
}) => {
  const isDark = variant === 'dark-bg';

  return (
    <div className={`inline-flex flex-col items-center justify-center select-none ${className}`}>
      <svg 
        viewBox="0 0 320 160" 
        className="w-full h-auto drop-shadow-sm" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="logo-subtle-shadow" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.25" />
          </filter>
          <linearGradient id="bubble-green-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1bb753" />
            <stop offset="100%" stopColor="#0ea043" />
          </linearGradient>
        </defs>

        {/* Speech Bubble Tail & Red Bottom Accent */}
        <path
          d="M 46 96 L 46 109 L 68 96 Z"
          fill="#d91b24"
        />
        <rect
          x="46"
          y="93"
          width="216"
          height="7"
          rx="3"
          fill="#d91b24"
        />

        {/* Main Green Speech Bubble */}
        <path
          d="M 64 22 
             H 258 
             A 18 18 0 0 1 276 40 
             V 78 
             A 18 18 0 0 1 258 96 
             H 64 
             A 18 18 0 0 1 46 78 
             V 40 
             A 18 18 0 0 1 64 22 
             Z"
          fill="url(#bubble-green-grad)"
          filter="url(#logo-subtle-shadow)"
        />
        {/* Speech Bubble Pointer tail (green) */}
        <path
          d="M 52 86 L 46 105 L 70 96 Z"
          fill="#0ea043"
        />

        {/* Text 'espresso' (Bold White lowercase) */}
        <text
          x="161"
          y="74"
          textAnchor="middle"
          fill="#ffffff"
          fontSize="52"
          fontWeight="900"
          letterSpacing="-1.5"
          style={{ 
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Montserrat, sans-serif',
            filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.25))'
          }}
        >
          espresso
        </text>

        {/* Text 'MADAGASCAR' (Bold Red uppercase) */}
        <text
          x="161"
          y="136"
          textAnchor="middle"
          fill="#d91b24"
          fontSize="35"
          fontWeight="900"
          letterSpacing="4"
          style={{ 
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Arial Black", sans-serif',
            filter: isDark ? 'drop-shadow(0 1px 3px rgba(255,255,255,0.85)) drop-shadow(0 0 6px rgba(255,255,255,0.9))' : 'drop-shadow(0 1px 1px rgba(0,0,0,0.15))'
          }}
        >
          MADAGASCAR
        </text>
      </svg>
    </div>
  );
};
