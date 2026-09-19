import React from 'react';
import { CardBackDesign, Language } from '../types';
import cardBackEspressoImage from '../assets/images/card_back_espresso_1789756785972.jpg';

interface CardBackProps {
  className?: string;
  showCropMarks?: boolean;
  language?: Language;
  design?: CardBackDesign;
  customImageUrl?: string;
}

export const CardBack: React.FC<CardBackProps> = ({ 
  className = '', 
  showCropMarks = false,
  language = 'fr',
  design = 'espresso',
  customImageUrl
}) => {
  const imageUrl = customImageUrl || cardBackEspressoImage || '/assets/card_back_espresso.jpg';

  return (
    <div 
      className={`relative flex items-center justify-center select-none ${className}`}
      style={showCropMarks ? { width: '69mm', height: '96mm' } : undefined}
    >
      {/* Traits de coupe d'imprimerie (Crop Marks for Print - 3mm bleed) */}
      {showCropMarks && (
        <>
          <div className="absolute top-0 left-[3mm] w-[0.5px] h-[2.5mm] bg-neutral-900" />
          <div className="absolute top-[3mm] left-0 h-[0.5px] w-[2.5mm] bg-neutral-900" />
          <div className="absolute top-0 right-[3mm] w-[0.5px] h-[2.5mm] bg-neutral-900" />
          <div className="absolute top-[3mm] right-0 h-[0.5px] w-[2.5mm] bg-neutral-900" />
          <div className="absolute bottom-0 left-[3mm] w-[0.5px] h-[2.5mm] bg-neutral-900" />
          <div className="absolute bottom-[3mm] left-0 h-[0.5px] w-[2.5mm] bg-neutral-900" />
          <div className="absolute bottom-0 right-[3mm] w-[0.5px] h-[2.5mm] bg-neutral-900" />
          <div className="absolute bottom-[3mm] right-0 h-[0.5px] w-[2.5mm] bg-neutral-900" />
        </>
      )}

      {/* Main Card Back Body (63mm × 90mm) */}
      <div 
        className="rounded-[5.5mm] overflow-hidden flex flex-col justify-between relative shadow-[0_4px_16px_rgba(0,0,0,0.25)] ring-1 ring-black/20"
        style={{ 
          width: '63mm', 
          height: '90mm',
          boxSizing: 'border-box'
        }}
      >
        {design === 'espresso' ? (
          /* =========================================================================
             ESPRESSO MADAGASCAR CARD BACK (HIGH ENERGY EMERALD & VORTEX DESIGN)
             ========================================================================= */
          <div className="w-full h-full relative overflow-hidden bg-[#03210e] flex flex-col items-center justify-center">
            {/* Background High-Resolution Artwork */}
            <img 
              src={imageUrl} 
              alt="Verso Espresso Madagascar" 
              className="w-full h-full object-cover object-center select-none pointer-events-none"
              referrerPolicy="no-referrer"
            />

            {/* Subtle Metallic Card Edge Sheen Overlay */}
            <div 
              className="absolute inset-0 pointer-events-none rounded-[5.5mm] border-[2px] border-emerald-400/40"
              style={{
                boxShadow: 'inset 0 0 10px rgba(0,0,0,0.6), inset 0 1px 2px rgba(255,255,255,0.4)'
              }}
            />

            {/* Top-Right and Bottom-Left Gloss Reflection */}
            <div 
              className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-60"
            />
          </div>
        ) : (
          /* =========================================================================
             CLASSIC GOLD & NAVY BLUE MEDALLION DESIGN
             ========================================================================= */
          <div 
            className="w-full h-full flex flex-col justify-between p-[2.8mm]"
            style={{
              background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 50%, #090d16 100%)'
            }}
          >
            {/* Outer Gold & Dark Inset Frame */}
            <div className="w-full h-full rounded-[3.8mm] overflow-hidden relative flex flex-col items-center justify-between border-[2px] border-amber-500/80 p-2 bg-[#0c1322]">
              
              {/* Subtle Geometric Background Pattern */}
              <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="card-back-grid" width="16" height="16" patternUnits="userSpaceOnUse">
                    <path d="M 16 0 L 0 16 M 0 0 L 16 16" fill="none" stroke="#f59e0b" strokeWidth="0.8" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#card-back-grid)" />
              </svg>

              {/* Top Decorative Header */}
              <div className="relative z-10 flex items-center gap-2 mt-1">
                <div className="h-[1px] w-6 bg-gradient-to-r from-transparent to-amber-400" />
                <div className="flex items-center gap-1">
                  <span className="text-amber-400 text-[0.55rem]">★</span>
                  <span className="text-[0.46rem] font-black uppercase tracking-[0.2em] text-amber-200">
                    {language === 'it' ? "GIOCO DELL'OCA" : "JEU DE L'OIE"}
                  </span>
                  <span className="text-amber-400 text-[0.55rem]">★</span>
                </div>
                <div className="h-[1px] w-6 bg-gradient-to-l from-transparent to-amber-400" />
              </div>

              {/* Central Medallion */}
              <div className="relative z-10 flex flex-col items-center justify-center my-auto">
                <div className="w-[32mm] h-[32mm] rounded-full border-[2.5px] border-amber-400/90 flex items-center justify-center p-1 bg-gradient-to-b from-amber-500/20 via-slate-900 to-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.25)]">
                  <div className="w-full h-full rounded-full border border-dashed border-amber-300/60 flex flex-col items-center justify-center relative overflow-hidden bg-[#090e1a]">
                    
                    {/* Italian Flag Shield Crest in background */}
                    <div className="absolute top-2 flex items-center shadow-sm rounded-sm overflow-hidden border border-white/20">
                      <div className="w-2.5 h-3 bg-[#009246]" />
                      <div className="w-2.5 h-3 bg-[#ffffff]" />
                      <div className="w-2.5 h-3 bg-[#ce2b37]" />
                    </div>

                    {/* Goose SVG Silhouette (Oca) */}
                    <svg viewBox="0 0 100 100" className="w-14 h-14 mt-3 text-amber-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" fill="currentColor">
                      <path d="M50 22 C45 22 41 26 42 32 C43 38 48 42 48 48 C48 55 42 62 34 65 C26 68 18 64 12 70 C8 74 10 80 16 82 C25 85 45 84 62 76 C74 70 86 58 88 44 C89 36 84 32 76 34 C68 36 62 42 58 40 C54 38 52 30 55 24 C56 22 53 22 50 22 Z" />
                      <circle cx="45" cy="27" r="2.2" fill="#090e1a" />
                      <polygon points="38,28 28,31 38,34" fill="#f59e0b" />
                      <path d="M52 48 C62 44 74 48 78 58 C72 64 60 62 50 56 Z" fill="#fde047" opacity="0.9" />
                    </svg>

                    <span className="text-[0.40rem] font-black uppercase tracking-wider text-amber-300 mt-0.5">
                      {language === 'it' ? 'ITALIANO' : 'ITALIEN'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Decorative Footer */}
              <div className="relative z-10 flex flex-col items-center gap-1 mb-1">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                </div>
                <span className="text-[0.38rem] font-mono tracking-widest text-slate-400 uppercase">
                  {language === 'it' ? 'MAZZO DI 48 CARTE' : 'PAQUET DE 48 CARTES'}
                </span>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};
