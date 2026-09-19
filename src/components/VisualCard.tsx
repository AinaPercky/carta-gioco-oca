import React from 'react';
import { CardData, Family, IconType, Language } from '../types';
import { getCardDisplayEffect, getCardDisplayTitle, getFamilyDisplayName } from '../data';
import { CardIllustration } from './CardIllustration';
import { HeaderIcon } from './HeaderIcon';

interface VisualCardProps {
  card: CardData;
  className?: string;
  showCropMarks?: boolean;
  language?: Language;
}

interface FamilyTheme {
  name: Family;
  code: string;
  borderHex: string;
  borderLight: string;
  borderDark: string;
  borderGradient: string;
  innerBorderHex: string;
  accentHex: string;
  pillBorder: string;
  pillTextHex: string;
  iconType: IconType;
}

const FAMILY_THEMES: Record<Family, FamilyTheme> = {
  Bonus: {
    name: 'Bonus',
    code: 'BON',
    borderHex: '#f59e0b',
    borderLight: '#fbbf24',
    borderDark: '#d97706',
    borderGradient: 'linear-gradient(165deg, #fcd34d 0%, #f59e0b 40%, #b45309 100%)',
    innerBorderHex: '#78350f',
    accentHex: '#d97706',
    pillBorder: '#f59e0b',
    pillTextHex: '#fef08a',
    iconType: 'timer',
  },
  Contre: {
    name: 'Contre',
    code: 'CTR',
    borderHex: '#0d9488',
    borderLight: '#2dd4bf',
    borderDark: '#0f766e',
    borderGradient: 'linear-gradient(165deg, #2dd4bf 0%, #0d9488 40%, #042f2e 100%)',
    innerBorderHex: '#042f2e',
    accentHex: '#14b8a6',
    pillBorder: '#14b8a6',
    pillTextHex: '#5eead4',
    iconType: 'shield',
  },
  Attaque: {
    name: 'Attaque',
    code: 'ATK',
    borderHex: '#dc2626',
    borderLight: '#f87171',
    borderDark: '#b91c1c',
    borderGradient: 'linear-gradient(165deg, #f87171 0%, #dc2626 40%, #7f1d1d 100%)',
    innerBorderHex: '#450a0a',
    accentHex: '#ef4444',
    pillBorder: '#ef4444',
    pillTextHex: '#fca5a5',
    iconType: 'swords',
  },
  Défense: {
    name: 'Défense',
    code: 'DEF',
    borderHex: '#2563eb',
    borderLight: '#60a5fa',
    borderDark: '#1d4ed8',
    borderGradient: 'linear-gradient(165deg, #60a5fa 0%, #2563eb 40%, #172554 100%)',
    innerBorderHex: '#172554',
    accentHex: '#3b82f6',
    pillBorder: '#3b82f6',
    pillTextHex: '#93c5fd',
    iconType: 'shield-check',
  },
  Progression: {
    name: 'Progression',
    code: 'PRG',
    borderHex: '#16a34a',
    borderLight: '#4ade80',
    borderDark: '#15803d',
    borderGradient: 'linear-gradient(165deg, #4ade80 0%, #16a34a 40%, #052e16 100%)',
    innerBorderHex: '#052e16',
    accentHex: '#22c55e',
    pillBorder: '#22c55e',
    pillTextHex: '#86efac',
    iconType: 'zap',
  },
  Spéciale: {
    name: 'Spéciale',
    code: 'SPC',
    borderHex: '#7c3aed',
    borderLight: '#a78bfa',
    borderDark: '#6d28d9',
    borderGradient: 'linear-gradient(165deg, #a78bfa 0%, #7c3aed 40%, #2e1065 100%)',
    innerBorderHex: '#2e1065',
    accentHex: '#8b5cf6',
    pillBorder: '#8b5cf6',
    pillTextHex: '#c4b5fd',
    iconType: 'sparkles',
  },
  Joker: {
    name: 'Joker',
    code: 'JKR',
    borderHex: '#db2777',
    borderLight: '#f472b6',
    borderDark: '#be185d',
    borderGradient: 'linear-gradient(165deg, #f472b6 0%, #db2777 40%, #500724 100%)',
    innerBorderHex: '#500724',
    accentHex: '#ec4899',
    pillBorder: '#ec4899',
    pillTextHex: '#fbcfe8',
    iconType: 'crown',
  },
};

export const getMedallionBackground = (iconBgColor?: string, themeBorderLight?: string) => {
  if (!iconBgColor || iconBgColor === 'pearl' || iconBgColor === 'white' || iconBgColor === '#ffffff') {
    return 'radial-gradient(circle at 35% 30%, #ffffff 0%, #f8fafc 55%, #e2e8f0 100%)';
  }
  if (iconBgColor === 'family-tint') {
    const tint = themeBorderLight || '#60a5fa';
    return `radial-gradient(circle at 35% 30%, #ffffff 15%, #f8fafc 55%, ${tint}33 100%)`;
  }
  if (iconBgColor === 'gold') {
    return 'radial-gradient(circle at 35% 30%, #fffbeb 0%, #fef3c7 45%, #fde68a 100%)';
  }
  if (iconBgColor === 'dark') {
    return 'radial-gradient(circle at 35% 30%, #334155 0%, #1e293b 60%, #0f172a 100%)';
  }
  return iconBgColor;
};

export const isMedallionDark = (iconBgColor?: string) => {
  if (!iconBgColor) return false;
  if (iconBgColor === 'dark' || iconBgColor === '#090d16' || iconBgColor === '#000000' || iconBgColor === '#0f172a') return true;
  if (iconBgColor === 'pearl' || iconBgColor === 'white' || iconBgColor === 'family-tint' || iconBgColor === 'gold') return false;
  if (iconBgColor.startsWith('#') && iconBgColor.length === 7) {
    const r = parseInt(iconBgColor.slice(1, 3), 16) || 0;
    const g = parseInt(iconBgColor.slice(3, 5), 16) || 0;
    const b = parseInt(iconBgColor.slice(5, 7), 16) || 0;
    return (0.299 * r + 0.587 * g + 0.114 * b) < 128;
  }
  return false;
};

export const VisualCard: React.FC<VisualCardProps> = ({ 
  card, 
  className = '',
  showCropMarks = false,
  language = 'fr'
}) => {
  const theme = FAMILY_THEMES[card.family] || FAMILY_THEMES.Bonus;
  const containerOpacity = card.containerOpacity !== undefined ? card.containerOpacity : 0.35;

  const resolvedTitle = getCardDisplayTitle(card, language);
  const resolvedEffect = getCardDisplayEffect(card, language);
  const resolvedFamilyName = getFamilyDisplayName(card.family, language);
  const gameTitle = language === 'it' ? "GIOCO DELL'OCA" : "JEU DE L'OIE";

  // Split title and parenthesis subtitle (e.g. "PROLONGATION (+15 S)")
  let mainTitle = resolvedTitle.trim();
  let subtitle = '';
  const match = resolvedTitle.match(/^(.*?)\s*(\(.*?\))$/);
  if (match) {
    mainTitle = match[1].trim();
    subtitle = match[2].trim();
  }

  // Dynamic font sizing for main title
  let titleFontSize = 'text-[0.78rem]';
  if (mainTitle.length > 18) {
    titleFontSize = 'text-[0.62rem]';
  } else if (mainTitle.length > 13) {
    titleFontSize = 'text-[0.70rem]';
  }

  // Effect text size based on length (enlarged for improved readability)
  let effectFontSize = 'text-[0.70rem]';
  if (resolvedEffect.length > 120) {
    effectFontSize = 'text-[0.58rem]';
  } else if (resolvedEffect.length > 85) {
    effectFontSize = 'text-[0.64rem]';
  } else if (resolvedEffect.length < 50) {
    effectFontSize = 'text-[0.76rem]';
  }

  return (
    <div 
      className={`relative flex items-center justify-center select-none ${className}`}
      style={showCropMarks ? { width: '69mm', height: '96mm' } : undefined}
    >
      
      {/* Traits de coupe d'imprimerie (Crop Marks for Print) */}
      {showCropMarks && (
        <>
          {/* Top Left */}
          <div className="absolute top-0 left-[3mm] w-[0.5px] h-[2.5mm] bg-neutral-900" />
          <div className="absolute top-[3mm] left-0 h-[0.5px] w-[2.5mm] bg-neutral-900" />
          
          {/* Top Right */}
          <div className="absolute top-0 right-[3mm] w-[0.5px] h-[2.5mm] bg-neutral-900" />
          <div className="absolute top-[3mm] right-0 h-[0.5px] w-[2.5mm] bg-neutral-900" />
          
          {/* Bottom Left */}
          <div className="absolute bottom-0 left-[3mm] w-[0.5px] h-[2.5mm] bg-neutral-900" />
          <div className="absolute bottom-[3mm] left-0 h-[0.5px] w-[2.5mm] bg-neutral-900" />
          
          {/* Bottom Right */}
          <div className="absolute bottom-0 right-[3mm] w-[0.5px] h-[2.5mm] bg-neutral-900" />
          <div className="absolute bottom-[3mm] right-0 h-[0.5px] w-[2.5mm] bg-neutral-900" />
        </>
      )}

      {/* Main Card Container (Standard Card Dimensions: 63mm × 90mm) */}
      <div 
        className="rounded-[5.5mm] overflow-hidden flex flex-col justify-between relative shadow-[0_6px_18px_rgba(0,0,0,0.22)]"
        style={{ 
          width: '63mm', 
          height: '90mm',
          background: theme.borderGradient,
          padding: '2.8mm',
          boxSizing: 'border-box'
        }}
      >
        {/* Subtle Specular Sheen across outer border */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/25 pointer-events-none rounded-[5.5mm]" />

        {/* Inner Chamfered/Notched Card Frame with dark border line */}
        <div className="w-full h-full rounded-[3.8mm] overflow-hidden relative flex flex-col justify-between border-[1.8px] shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)]"
          style={{ borderColor: theme.innerBorderHex }}
        >
          {/* Full-bleed Illustration Canvas */}
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            <CardIllustration 
              cardName={card.illustrationPreset || card.name} 
              cardId={card.id}
              customImageUrl={card.customImageUrl}
              customSpeechBubble={card.customSpeechBubble}
            />
          </div>

          {/* 1. TOP HEADER BANNER (Floating white polygonal plaque with cut bottom corners) */}
          <div className="relative z-10 w-full px-[1.5mm] pt-[1.2mm]">
            <div className="relative w-full h-[11.8mm] flex items-center px-2 drop-shadow-[0_2.5px_4px_rgba(0,0,0,0.3)]">
              {/* SVG Background Polygon with cut bottom corners and sharp 2.8px dark stroke */}
              <svg 
                className="absolute inset-0 w-full h-full pointer-events-none" 
                preserveAspectRatio="none" 
                viewBox="0 0 100 100"
              >
                {/* Clean White Body with Cut Bottom Corners & Adjustable Transparency */}
                <polygon 
                  points="2,0 98,0 100,6 100,75 92,100 8,100 0,75 0,6" 
                  fill="#ffffff" 
                  fillOpacity={containerOpacity}
                  stroke="#090d16" 
                  strokeWidth="2.8" 
                  vectorEffect="non-scaling-stroke" 
                />
              </svg>

              {/* Banner Content */}
              <div className="relative z-10 w-full flex items-center justify-between">
                {/* Left: Sculpted Medallion Emblem with Tactile Bezel & Depth */}
                {(() => {
                  const isDark = isMedallionDark(card.iconBgColor);
                  const medallionBg = getMedallionBackground(card.iconBgColor, theme.borderLight);
                  return (
                    <div 
                      className="w-[7.6mm] h-[7.6mm] rounded-full flex items-center justify-center shrink-0 relative shadow-[0_1.5px_3.5px_rgba(0,0,0,0.22)]"
                      style={{ 
                        background: medallionBg,
                        border: `1.8px solid ${isDark ? '#ffffff' : '#0f172a'}`,
                      }}
                    >
                      {/* Inner Concentric Accent Ring */}
                      <div 
                        className="absolute inset-[1.3px] rounded-full pointer-events-none" 
                        style={{ 
                          border: `1.3px solid ${theme.borderHex}`,
                          boxShadow: isDark 
                            ? 'inset 0 1px 2px rgba(0,0,0,0.5)' 
                            : 'inset 0 1px 2px rgba(255,255,255,0.85)'
                        }} 
                      />

                      {/* Subtle Specular Arc Highlight (Enamel / Coin Sheen) */}
                      <div 
                        className="absolute inset-[2.2px] rounded-full pointer-events-none opacity-40"
                        style={{
                          background: 'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 55%)'
                        }}
                      />

                      {/* Inner Icon Safe Zone: padded so neither SVG nor image is cropped by borders */}
                      <div className="relative z-10 w-full h-full flex items-center justify-center p-[1.6px]">
                        <HeaderIcon 
                          iconType={card.customIcon || theme.iconType} 
                          iconUrl={card.customIconUrl}
                          color={isDark ? '#ffffff' : theme.borderHex}
                          className="w-full h-full max-w-[4.4mm] max-h-[4.4mm] object-contain flex items-center justify-center"
                        />
                      </div>
                    </div>
                  );
                })()}

                {/* Center: Card Title & Subtitle */}
                <div className="flex-1 flex flex-col items-center justify-center px-1">
                  <h2 className={`font-black uppercase tracking-tight text-neutral-950 text-center leading-none drop-shadow-[0_0.5px_0_rgba(0,0,0,0.1)] ${titleFontSize}`}>
                    {mainTitle}
                  </h2>
                  
                  {subtitle ? (
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="h-[1.5px] w-3 rounded-full" style={{ backgroundColor: theme.accentHex }} />
                      <span 
                        className="font-black text-[0.56rem] tracking-wide"
                        style={{ color: theme.accentHex }}
                      >
                        {subtitle}
                      </span>
                      <div className="h-[1.5px] w-3 rounded-full" style={{ backgroundColor: theme.accentHex }} />
                    </div>
                  ) : (
                    <div 
                      className="h-[2px] w-12 rounded-full mt-1" 
                      style={{ backgroundColor: theme.accentHex }} 
                    />
                  )}
                </div>

                {/* Right: Slanted Italian Flag Ribbon (3 Stripes) - Enlarged */}
                <div className="shrink-0 flex items-center -skew-x-[18deg] shadow-sm rounded-[1px] overflow-hidden border-[1.2px] border-neutral-900">
                  <div className="w-[4.4px] h-[13.5px] bg-[#009246]" />
                  <div className="w-[4.4px] h-[13.5px] bg-[#ffffff]" />
                  <div className="w-[4.4px] h-[13.5px] bg-[#ce2b37]" />
                </div>
              </div>
            </div>
          </div>

          {/* Spacer for middle illustration view */}
          <div className="flex-1 pointer-events-none" />

          {/* 2. LOWER SECTION: EFFECT DESCRIPTION PLAQUE & FOOTER BAR */}
          <div className="relative z-10 w-full px-[1.5mm] pb-[1.2mm] flex flex-col gap-[1.2mm]">
            
            {/* Effect Description Box (Octagonal Parchment Plaque with 4 cut corners) */}
            <div className="relative w-full min-h-[17.5mm] flex items-center px-2 py-1.5 drop-shadow-[0_2.5px_4px_rgba(0,0,0,0.28)]">
              {/* SVG Background Plaque with Warm Cream Tone, adjustable transparency and 2.5px dark border */}
              <svg 
                className="absolute inset-0 w-full h-full pointer-events-none" 
                preserveAspectRatio="none" 
                viewBox="0 0 100 100"
              >
                <polygon 
                  points="5,0 95,0 100,16 100,84 95,100 5,100 0,84 0,16" 
                  fill="#faf8f0" 
                  fillOpacity={containerOpacity}
                  stroke="#090d16" 
                  strokeWidth="2.5" 
                  vectorEffect="non-scaling-stroke" 
                />
              </svg>

              {/* Content inside Plaque */}
              <div className="relative z-10 w-full flex items-center gap-2 pl-0.5 pr-1">
                {/* Vertical Italian Flag Pill - Enlarged */}
                <div className="w-[5.5px] h-[24px] rounded-[1.5px] overflow-hidden flex flex-col border-[1.2px] border-neutral-900 shrink-0 shadow-xs">
                  <div className="flex-1 bg-[#009246]" />
                  <div className="flex-1 bg-[#ffffff]" />
                  <div className="flex-1 bg-[#ce2b37]" />
                </div>

                {/* Effect Text */}
                <p 
                  className={`flex-1 text-neutral-950 font-bold italic text-left leading-[1.3] tracking-tight drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)] ${effectFontSize}`}
                  style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
                >
                  {resolvedEffect}
                </p>
              </div>
            </div>

            {/* Bottom Footer Bar (Dark Plaque with Family Badge and Code) */}
            <div className="relative w-full h-[6.6mm] flex items-center px-2 drop-shadow-sm">
              <svg 
                className="absolute inset-0 w-full h-full pointer-events-none" 
                preserveAspectRatio="none" 
                viewBox="0 0 100 100"
              >
                <polygon 
                  points="3,0 97,0 100,28 100,72 97,100 3,100 0,72 0,28" 
                  fill="#080f1a" 
                  stroke={theme.borderHex} 
                  strokeWidth="1.8" 
                  vectorEffect="non-scaling-stroke" 
                />
              </svg>

              <div className="relative z-10 w-full flex items-center justify-between text-white">
                {/* Left: Star + Game Title (without ITALIEN) */}
                <div className="flex items-center gap-1">
                  <span className="text-amber-400 text-[0.52rem] leading-none">★</span>
                  <span className="font-bold text-[0.45rem] tracking-wider text-slate-100 uppercase">
                    {gameTitle}
                  </span>
                </div>

                {/* Center: Family Pill Badge */}
                <div 
                  className="px-2 py-[0.5px] rounded-[2mm] border-[1.8px] font-black text-[0.46rem] uppercase tracking-wider shadow-xs"
                  style={{ 
                    backgroundColor: '#080f1a',
                    borderColor: theme.pillBorder,
                    color: theme.pillTextHex
                  }}
                >
                  {resolvedFamilyName}
                </div>

                {/* Right: Serial Identifier Code (NO quantity count) */}
                <span className="font-mono font-bold text-[0.44rem] tracking-wider text-slate-300">
                  {theme.code}_{card.id.padStart(2, '0')}
                </span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
