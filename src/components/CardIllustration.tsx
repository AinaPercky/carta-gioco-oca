import React from 'react';

interface CardIllustrationProps {
  cardName: string;
  cardId?: string;
  className?: string;
  customImageUrl?: string;
  customSpeechBubble?: string;
}

export const CardIllustration: React.FC<CardIllustrationProps> = ({ 
  cardName, 
  cardId,
  className = '',
  customImageUrl,
  customSpeechBubble
}) => {
  if (customImageUrl) {
    return (
      <div className={`w-full h-full relative overflow-hidden bg-slate-900 ${className}`}>
        <img 
          src={customImageUrl} 
          alt={cardName} 
          className="w-full h-full object-cover object-center" 
          referrerPolicy="no-referrer"
        />
        {/* Subtle vignette so header and effect plaques retain contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20 pointer-events-none" />
      </div>
    );
  }

  const norm = cardName.trim().toUpperCase();

  // Helper for generating dynamic sunburst rays
  const renderSunburst = (color1: string, color2: string, cx = 120, cy = 80, count = 18) => {
    const rays = [];
    const angleStep = 360 / count;
    for (let i = 0; i < count; i++) {
      const a1 = (i * angleStep * Math.PI) / 180;
      const a2 = ((i * angleStep + angleStep * 0.5) * Math.PI) / 180;
      const r = 260;
      const x1 = cx + r * Math.cos(a1);
      const y1 = cy + r * Math.sin(a1);
      const x2 = cx + r * Math.cos(a2);
      const y2 = cy + r * Math.sin(a2);
      rays.push(
        <polygon
          key={i}
          points={`${cx},${cy} ${x1},${y1} ${x2},${y2}`}
          fill={i % 2 === 0 ? color1 : color2}
        />
      );
    }
    return <g opacity="0.95">{rays}</g>;
  };

  // 1. PROLONGATION (+15 S) - EXACT REPLICA OF REFERENCE PHOTO
  if (norm.includes('PROLONGATION') || norm.includes('PROLUNGAMENTO') || cardId === '10') {
    return (
      <svg viewBox="0 0 240 160" className={`w-full h-full ${className}`} preserveAspectRatio="xMidYMid slice">
        {/* Sunburst background radiating from clock */}
        <rect width="240" height="160" fill="#f59e0b" />
        {renderSunburst('#fde047', '#f59e0b', 145, 75, 20)}
        {/* Dynamic speed lines */}
        <line x1="20" y1="30" x2="90" y2="60" stroke="#fef08a" strokeWidth="2" opacity="0.6" />
        <line x1="10" y1="80" x2="70" y2="85" stroke="#fef08a" strokeWidth="2" opacity="0.6" />

        {/* Perspective Ground / Floor */}
        <polygon points="0,118 240,118 240,160 0,160" fill="#b45309" />
        <line x1="0" y1="118" x2="240" y2="118" stroke="#78350f" strokeWidth="2" />
        {/* Character Floor Cast Shadow */}
        <ellipse cx="65" cy="126" rx="36" ry="6" fill="#78350f" opacity="0.8" />
        <ellipse cx="145" cy="124" rx="28" ry="5" fill="#78350f" opacity="0.8" />

        {/* Stick Figure lunging forward holding clock */}
        <g stroke="#090d16" strokeLinecap="round" strokeLinejoin="round">
          {/* Back Leg */}
          <path d="M72,94 L42,106 L28,124" fill="none" strokeWidth="6.5" />
          {/* Front Leg */}
          <path d="M72,94 L82,108 L100,125" fill="none" strokeWidth="6.5" />
          {/* Torso */}
          <line x1="72" y1="94" x2="68" y2="62" strokeWidth="7.5" />
          {/* Head */}
          <circle cx="68" cy="48" r="13" fill="#090d16" stroke="none" />
          {/* Back Arm */}
          <path d="M68,66 L50,78 L40,94" fill="none" strokeWidth="5.5" />
          {/* Front Arm reaching out grasping the clock */}
          <path d="M68,66 L98,66 L122,70" fill="none" strokeWidth="6" />
        </g>

        {/* Giant Stopwatch / Clock */}
        <g transform="translate(145, 75)">
          {/* Top Ring & Crown */}
          <rect x="-4" y="-46" width="8" height="8" fill="#090d16" rx="1.5" />
          <path d="M-8,-46 C-8,-54 8,-54 8,-46" fill="none" stroke="#090d16" strokeWidth="3.5" />
          {/* Outer Black Bezel */}
          <circle cx="0" cy="0" r="40" fill="#090d16" />
          {/* Gold Inner Accent Ring */}
          <circle cx="0" cy="0" r="37" fill="#f59e0b" />
          {/* White Dial Face */}
          <circle cx="0" cy="0" r="34" fill="#ffffff" />
          
          {/* Clock Ticks */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(deg => (
            <line
              key={deg}
              x1="0"
              y1="-32"
              x2="0"
              y2={deg % 90 === 0 ? '-25' : '-28'}
              stroke="#090d16"
              strokeWidth={deg % 90 === 0 ? '2.5' : '1.5'}
              transform={`rotate(${deg})`}
            />
          ))}

          {/* Clock Hands in Red at 3 o'clock */}
          <circle cx="0" cy="0" r="3.5" fill="#dc2626" />
          <line x1="0" y1="0" x2="0" y2="-18" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" />
          <line x1="0" y1="0" x2="22" y2="4" stroke="#dc2626" strokeWidth="3.5" strokeLinecap="round" />

          {/* Red "+15s" text in center */}
          <text
            x="-4"
            y="17"
            fill="#dc2626"
            fontSize="14"
            fontWeight="900"
            fontFamily="system-ui, sans-serif"
            letterSpacing="-0.5px"
          >
            +15s
          </text>
        </g>

        {/* Hand grasping the clock */}
        <circle cx="122" cy="70" r="5" fill="#090d16" />

        {/* Comic Speech Bubble "PARLARE!" */}
        <g transform="translate(156, 18)">
          {/* Pointer tail pointing down-left to the stick figure */}
          <polygon points="12,32 -8,40 20,32" fill="#ffffff" stroke="#090d16" strokeWidth="2.5" />
          {/* Bubble Body */}
          <rect x="0" y="0" width="76" height="34" rx="12" fill="#ffffff" stroke="#090d16" strokeWidth="2.5" />
          {/* Bubble Text */}
          <text
            x="38"
            y="23"
            fill="#090d16"
            fontSize={customSpeechBubble && customSpeechBubble.length > 8 ? "10" : "12.5"}
            fontWeight="900"
            fontFamily="Impact, system-ui, sans-serif"
            textAnchor="middle"
            letterSpacing="0.5px"
          >
            {customSpeechBubble || 'PARLARE!'}
          </text>
        </g>
      </svg>
    );
  }

  // 2. CONTRE-ATTAQUE - EXACT REPLICA OF REFERENCE PHOTO
  if (norm.includes('CONTRE-ATTAQUE') || norm.includes('CONTROATTACCO') || norm === 'CONTRE ATTAQUE' || cardId === '11') {
    return (
      <svg viewBox="0 0 240 160" className={`w-full h-full ${className}`} preserveAspectRatio="xMidYMid slice">
        {/* Teal Sunburst and speed rays */}
        <rect width="240" height="160" fill="#0d9488" />
        {renderSunburst('#14b8a6', '#0f766e', 140, 70, 22)}
        {/* Dynamic diagonal speed cuts */}
        <line x1="0" y1="20" x2="80" y2="60" stroke="#5eead4" strokeWidth="2.5" opacity="0.5" />
        <line x1="20" y1="10" x2="120" y2="50" stroke="#5eead4" strokeWidth="1.5" opacity="0.4" />
        <line x1="160" y1="120" x2="240" y2="80" stroke="#5eead4" strokeWidth="2" opacity="0.5" />

        {/* Floor */}
        <polygon points="0,122 240,122 240,160 0,160" fill="#115e59" />
        <line x1="0" y1="122" x2="240" y2="122" stroke="#042f2e" strokeWidth="2" />
        {/* Floor Shadows */}
        <ellipse cx="78" cy="128" rx="42" ry="6" fill="#042f2e" opacity="0.7" />
        <ellipse cx="195" cy="128" rx="24" ry="5" fill="#042f2e" opacity="0.7" />

        {/* Swirling Yellow Energy Arc blasting across scene */}
        <path
          d="M110,65 C125,25 210,20 220,65 C225,95 140,115 115,95"
          fill="none"
          stroke="#fde047"
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.95"
        />
        <path
          d="M125,60 C140,30 200,30 215,62 C220,85 155,105 130,90"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.9"
        />

        {/* Left Stick Figure (Defender lunging in martial stance) */}
        <g stroke="#090d16" strokeLinecap="round" strokeLinejoin="round">
          {/* Back Leg low stretch */}
          <path d="M74,96 L46,110 L28,126" fill="none" strokeWidth="6.5" />
          {/* Front Leg */}
          <path d="M74,96 L88,110 L104,126" fill="none" strokeWidth="6.5" />
          {/* Torso */}
          <line x1="74" y1="96" x2="68" y2="64" strokeWidth="7.5" />
          {/* Head */}
          <circle cx="68" cy="48" r="13" fill="#090d16" stroke="none" />
          {/* Back Arm */}
          <path d="M68,68 L50,82 L42,94" fill="none" strokeWidth="5.5" />
          {/* Front Arm thrusting shield */}
          <path d="M68,68 L96,62 L120,54" fill="none" strokeWidth="6.5" />
        </g>

        {/* Glowing Shield & Blast Deflection */}
        <g transform="translate(126, 52)">
          {/* Outer Energy Glow */}
          <ellipse cx="4" cy="0" rx="20" ry="15" fill="#fef08a" opacity="0.8" />
          {/* White Oval Barrier */}
          <ellipse cx="0" cy="0" rx="16" ry="12" fill="#ffffff" stroke="#090d16" strokeWidth="2.5" />
          {/* Orange Star Burst Deflection */}
          <polygon
            points="14,-10 24,-2 18,8 28,14 14,16 10,26 4,14 -4,18 2,6 -8,0 4,-6 8,-16"
            fill="#f97316"
            stroke="#090d16"
            strokeWidth="1.5"
          />
          <polygon
            points="12,-6 18,0 14,6 20,10 12,12 8,18 4,10 -2,12 2,4 -4,0 4,-4 6,-10"
            fill="#fde047"
          />
        </g>

        {/* Right Stick Figure (Attacker knocked backwards in shock) */}
        <g stroke="#090d16" strokeLinecap="round" strokeLinejoin="round">
          {/* Left Leg */}
          <path d="M194,102 L186,114 L176,128" fill="none" strokeWidth="6" />
          {/* Right Leg */}
          <path d="M194,102 L202,114 L212,128" fill="none" strokeWidth="6" />
          {/* Torso knocked back */}
          <line x1="194" y1="102" x2="198" y2="70" strokeWidth="7" />
          {/* Head tilted */}
          <circle cx="200" cy="54" r="12" fill="#090d16" stroke="none" />
          {/* Arms flailing in shock */}
          <path d="M198,72 L212,68 L218,58" fill="none" strokeWidth="5.5" />
          <path d="M198,76 L186,82 L178,74" fill="none" strokeWidth="5.5" />
        </g>

        {/* Stun/Surprise Impact Star on Attacker's head */}
        <g transform="translate(194, 40)">
          <polygon
            points="6,-10 10,-2 18,-6 14,2 22,6 14,10 16,18 8,14 2,20 0,12 -8,14 -4,6 -12,2 -4,-2 -6,-10 2,-6"
            fill="#facc15"
            stroke="#090d16"
            strokeWidth="1.5"
          />
          <polygon
            points="4,-6 7,-1 12,-4 9,1 15,4 9,7 11,12 5,9 1,13 0,8 -5,9 -3,4 -8,1 -3,-1 -4,-6 1,-4"
            fill="#ffffff"
          />
        </g>
      </svg>
    );
  }

  // 3. BLOCAGE
  if (norm.includes('BLOCAGE') || norm.includes('BLOCCO') || cardId === '1') {
    return (
      <svg viewBox="0 0 240 160" className={`w-full h-full ${className}`} preserveAspectRatio="xMidYMid slice">
        <rect width="240" height="160" fill="#dc2626" />
        {renderSunburst('#ef4444', '#b91c1c', 160, 70, 20)}
        <polygon points="0,120 240,120 240,160 0,160" fill="#7f1d1d" />
        <line x1="0" y1="120" x2="240" y2="120" stroke="#450a0a" strokeWidth="2" />
        <ellipse cx="65" cy="126" rx="36" ry="6" fill="#450a0a" opacity="0.8" />

        {/* Giant Red Stop Barrier / Wall */}
        <g transform="translate(150, 25)">
          <rect x="0" y="0" width="22" height="100" rx="3" fill="#374151" stroke="#090d16" strokeWidth="3" />
          <line x1="5" y1="20" x2="17" y2="20" stroke="#6b7280" strokeWidth="2" />
          <line x1="5" y1="50" x2="17" y2="50" stroke="#6b7280" strokeWidth="2" />
          <line x1="5" y1="80" x2="17" y2="80" stroke="#6b7280" strokeWidth="2" />
          
          {/* Big Octagonal Stop Sign */}
          <g transform="translate(-18, 10)">
            <polygon points="12,0 36,0 48,12 48,36 36,48 12,48 0,36 0,12" fill="#ffffff" stroke="#090d16" strokeWidth="3" />
            <polygon points="13,3 35,3 45,13 45,35 35,45 13,45 3,35 3,13" fill="#dc2626" />
            <text x="24" y="30" fill="#ffffff" fontSize="13" fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle">STOP</text>
          </g>
        </g>

        {/* Comic Impact Stars */}
        <g transform="translate(136, 50)">
          <polygon points="0,-12 6,-3 15,-6 10,2 18,8 9,10 8,19 2,12 -5,17 -4,9 -13,6 -5,1 -8,-8 0,-4" fill="#facc15" stroke="#090d16" strokeWidth="1.5" />
        </g>

        {/* Stick figure crashing / skidding against the wall */}
        <g stroke="#090d16" strokeLinecap="round" strokeLinejoin="round">
          {/* Legs braking violently */}
          <path d="M78,98 L56,110 L34,124" fill="none" strokeWidth="6.5" />
          <path d="M78,98 L96,112 L116,124" fill="none" strokeWidth="6.5" />
          {/* Torso pressed forward */}
          <line x1="78" y1="98" x2="88" y2="68" strokeWidth="7.5" />
          {/* Head tilting back in shock */}
          <circle cx="94" cy="52" r="13" fill="#090d16" stroke="none" />
          {/* Hands splayed against barrier */}
          <path d="M86,72 L115,70 L138,62" fill="none" strokeWidth="6" />
          <path d="M84,76 L112,82 L136,82" fill="none" strokeWidth="6" />
        </g>
        {/* Brake smoke */}
        <circle cx="34" cy="122" r="6" fill="#ffffff" opacity="0.8" />
        <circle cx="24" cy="124" r="4" fill="#ffffff" opacity="0.6" />
      </svg>
    );
  }

  // 4. RALENTISSEMENT
  if (norm.includes('RALENTISSEMENT') || norm.includes('RALLENTAMENTO') || cardId === '2') {
    return (
      <svg viewBox="0 0 240 160" className={`w-full h-full ${className}`} preserveAspectRatio="xMidYMid slice">
        <rect width="240" height="160" fill="#ea580c" />
        {renderSunburst('#fb923c', '#c2410c', 100, 60, 18)}
        {/* Muddy Ground */}
        <polygon points="0,118 240,118 240,160 0,160" fill="#78350f" />
        <line x1="0" y1="118" x2="240" y2="118" stroke="#451a03" strokeWidth="2" />

        {/* Giant Heavy Iron Ball with "-2" */}
        <g transform="translate(42, 105)">
          <circle cx="0" cy="0" r="22" fill="#1f2937" stroke="#090d16" strokeWidth="3" />
          <ellipse cx="-6" cy="-8" rx="6" ry="3" fill="#4b5563" />
          <text x="0" y="7" fill="#f3f4f6" fontSize="16" fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle">-2</text>
        </g>
        {/* Heavy Chain to leg */}
        <path d="M64,105 Q85,108 106,104" fill="none" stroke="#090d16" strokeWidth="4.5" strokeDasharray="5,4" />

        {/* Exhausted Stick Figure bent forward */}
        <g stroke="#090d16" strokeLinecap="round" strokeLinejoin="round">
          <path d="M116,98 L108,114 L104,124" fill="none" strokeWidth="6.5" />
          <path d="M116,98 L132,112 L144,124" fill="none" strokeWidth="6.5" />
          {/* Bent back */}
          <path d="M116,98 Q125,80 134,68" fill="none" strokeWidth="7.5" />
          <circle cx="144" cy="56" r="12.5" fill="#090d16" stroke="none" />
          {/* Drooping arms dragging */}
          <path d="M128,74 L140,86 L144,104" fill="none" strokeWidth="5.5" />
          <path d="M126,76 L118,88 L114,102" fill="none" strokeWidth="5.5" />
        </g>
        {/* Sweat drops */}
        <path d="M158,50 Q162,42 165,48 Q168,54 158,50 Z" fill="#38bdf8" stroke="#090d16" strokeWidth="1.5" />
        
        {/* Cheerful Snail overtaking */}
        <g transform="translate(185, 96)">
          <circle cx="16" cy="14" r="14" fill="#facc15" stroke="#090d16" strokeWidth="2.5" />
          <path d="M16,6 A8,8 0 1,1 10,18" fill="none" stroke="#090d16" strokeWidth="2.5" />
          <path d="M0,24 C8,22 28,22 38,22 C44,22 46,16 46,12" fill="#fef08a" stroke="#090d16" strokeWidth="2.5" />
          <line x1="43" y1="12" x2="45" y2="4" stroke="#090d16" strokeWidth="2.5" />
          <circle cx="45" cy="4" r="2" fill="#090d16" />
        </g>
      </svg>
    );
  }

  // 5. TEMPS RÉDUIT
  if (norm.includes('TEMPS RÉDUIT') || norm.includes('TEMPS REDUIT') || norm.includes('TEMPO RIDOTTO') || cardId === '3') {
    return (
      <svg viewBox="0 0 240 160" className={`w-full h-full ${className}`} preserveAspectRatio="xMidYMid slice">
        <rect width="240" height="160" fill="#dc2626" />
        {renderSunburst('#f87171', '#b91c1c', 160, 75, 20)}
        <polygon points="0,120 240,120 240,160 0,160" fill="#7f1d1d" />
        <line x1="0" y1="120" x2="240" y2="120" stroke="#450a0a" strokeWidth="2" />

        {/* Panicking Stick Figure */}
        <g stroke="#090d16" strokeLinecap="round" strokeLinejoin="round">
          <path d="M80,98 L64,112 L50,124" fill="none" strokeWidth="6.5" />
          <path d="M80,98 L98,112 L112,124" fill="none" strokeWidth="6.5" />
          <line x1="80" y1="98" x2="80" y2="66" strokeWidth="7.5" />
          <circle cx="80" cy="50" r="13" fill="#090d16" stroke="none" />
          {/* Hands holding head in panic */}
          <path d="M80,70 L66,58 L72,46" fill="none" strokeWidth="5.5" />
          <path d="M80,70 L94,58 L88,46" fill="none" strokeWidth="5.5" />
        </g>
        {/* Panic sweat drops */}
        <ellipse cx="64" cy="42" rx="3" ry="5" fill="#38bdf8" />
        <ellipse cx="98" cy="42" rx="3" ry="5" fill="#38bdf8" />

        {/* Melting / Fast Ticking Clock with "-15s" */}
        <g transform="translate(155, 75)">
          <circle cx="0" cy="0" r="34" fill="#ffffff" stroke="#090d16" strokeWidth="4" />
          <circle cx="0" cy="0" r="30" fill="#fee2e2" />
          {/* Hands spinning wildly */}
          <line x1="0" y1="0" x2="-14" y2="-16" stroke="#dc2626" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="0" y1="0" x2="20" y2="6" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" />
          <circle cx="0" cy="0" r="3.5" fill="#090d16" />
          <text x="0" y="18" fill="#dc2626" fontSize="15" fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle">-15s</text>
        </g>
        {/* Comic Speech Bubble "PRESTO!" */}
        <g transform="translate(145, 14)">
          <polygon points="15,30 2,38 22,30" fill="#ffffff" stroke="#090d16" strokeWidth="2" />
          <rect x="0" y="0" width="76" height="30" rx="10" fill="#ffffff" stroke="#090d16" strokeWidth="2" />
          <text x="38" y="20" fill="#090d16" fontSize="12" fontWeight="900" fontFamily="Impact, sans-serif" textAnchor="middle">PRESTO!</text>
        </g>
      </svg>
    );
  }

  // 6. RECUL FORCÉ
  if (norm.includes('RECUL FORCÉ') || norm.includes('RECUL FORCE') || norm.includes('RETROCESSIONE') || norm.includes('ARRETRAMENTO') || cardId === '4') {
    return (
      <svg viewBox="0 0 240 160" className={`w-full h-full ${className}`} preserveAspectRatio="xMidYMid slice">
        <rect width="240" height="160" fill="#b91c1c" />
        {renderSunburst('#f87171', '#991b1b', 40, 70, 20)}
        <polygon points="0,122 240,122 240,160 0,160" fill="#450a0a" />

        {/* Giant Spring Boxing Glove */}
        <g transform="translate(10, 65)">
          {/* Coiled Spring */}
          <path d="M0,0 Q15,-15 30,0 Q45,15 60,0 Q75,-15 90,0" fill="none" stroke="#e5e7eb" strokeWidth="5" strokeLinecap="round" />
          {/* Red Glove */}
          <ellipse cx="105" cy="0" rx="20" ry="16" fill="#dc2626" stroke="#090d16" strokeWidth="3" />
          <circle cx="112" cy="8" r="7" fill="#dc2626" stroke="#090d16" strokeWidth="2.5" />
        </g>
        {/* Big comic "POW!" star */}
        <g transform="translate(125, 65)">
          <polygon points="0,-18 7,-6 18,-10 12,2 24,8 11,12 14,24 4,14 -4,22 -3,11 -16,10 -7,1 -14,-8 -3,-5" fill="#facc15" stroke="#090d16" strokeWidth="2" />
          <text x="0" y="5" fill="#dc2626" fontSize="11" fontWeight="900" fontFamily="Impact, sans-serif" textAnchor="middle">POW!</text>
        </g>

        {/* Stick figure blown backwards into the air */}
        <g stroke="#090d16" strokeLinecap="round" strokeLinejoin="round" transform="translate(170, 60) rotate(25)">
          <line x1="0" y1="20" x2="-20" y2="45" strokeWidth="6" />
          <line x1="0" y1="20" x2="15" y2="45" strokeWidth="6" />
          <line x1="0" y1="20" x2="0" y2="-15" strokeWidth="7" />
          <circle cx="0" cy="-30" r="12" fill="#090d16" stroke="none" />
          <line x1="0" y1="-5" x2="-25" y2="-15" strokeWidth="5.5" />
          <line x1="0" y1="-5" x2="25" y2="-20" strokeWidth="5.5" />
        </g>
        {/* Backward directional indicator */}
        <g transform="translate(180, 125)">
          <rect x="-35" y="-12" width="70" height="24" rx="6" fill="#ffffff" stroke="#090d16" strokeWidth="2.5" />
          <text x="0" y="5" fill="#dc2626" fontSize="12" fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle">◀ ◀ -2</text>
        </g>
      </svg>
    );
  }

  // 7. BOUCLIER
  if (norm.includes('BOUCLIER') || norm.includes('SCUDO') || cardId === '5') {
    return (
      <svg viewBox="0 0 240 160" className={`w-full h-full ${className}`} preserveAspectRatio="xMidYMid slice">
        <rect width="240" height="160" fill="#2563eb" />
        {renderSunburst('#60a5fa', '#1d4ed8', 120, 70, 20)}
        <polygon points="0,122 240,122 240,160 0,160" fill="#1e3a8a" />
        <line x1="0" y1="122" x2="240" y2="122" stroke="#172554" strokeWidth="2" />

        {/* Hero Defender Stick Figure standing firm */}
        <g stroke="#090d16" strokeLinecap="round" strokeLinejoin="round">
          <path d="M75,98 L55,112 L40,126" fill="none" strokeWidth="6.5" />
          <path d="M75,98 L92,112 L105,126" fill="none" strokeWidth="6.5" />
          <line x1="75" y1="98" x2="75" y2="64" strokeWidth="7.5" />
          <circle cx="75" cy="48" r="13" fill="#090d16" stroke="none" />
          <path d="M75,68 L95,68 L115,70" fill="none" strokeWidth="6" />
        </g>

        {/* Giant Glowing Blue Energy Shield */}
        <g transform="translate(120, 30)">
          <path
            d="M0,0 L35,0 C35,45 25,75 0,90 C-25,75 -35,45 -35,0 Z"
            fill="#38bdf8"
            stroke="#090d16"
            strokeWidth="4"
          />
          <path
            d="M0,6 L28,6 C28,40 20,68 0,80 C-20,68 -28,40 -28,6 Z"
            fill="#e0f2fe"
          />
          {/* Golden Shield Crest */}
          <polygon points="0,20 12,35 0,55 -12,35" fill="#facc15" stroke="#090d16" strokeWidth="2" />
        </g>

        {/* Attack arrows bouncing off with sparks */}
        <g transform="translate(170, 50)">
          <line x1="45" y1="-15" x2="0" y2="15" stroke="#ef4444" strokeWidth="3.5" />
          <polygon points="0,15 8,8 14,14" fill="#ef4444" />
          <polygon points="-8,18 2,10 6,24" fill="#facc15" />
        </g>
        <g transform="translate(165, 80)">
          <line x1="40" y1="15" x2="0" y2="-5" stroke="#ef4444" strokeWidth="3.5" />
          <polygon points="0,-5 8,2 12,-4" fill="#ef4444" />
          <polygon points="-6,-6 4,-2 2,8" fill="#facc15" />
        </g>
      </svg>
    );
  }

  // 8. IMMUNITÉ
  if (norm.includes('IMMUNITÉ') || norm.includes('IMMUNITE') || norm.includes('IMMUNITÀ') || norm.includes('IMMUNITA') || cardId === '6') {
    return (
      <svg viewBox="0 0 240 160" className={`w-full h-full ${className}`} preserveAspectRatio="xMidYMid slice">
        <rect width="240" height="160" fill="#1d4ed8" />
        {renderSunburst('#93c5fd', '#2563eb', 120, 75, 22)}
        <polygon points="0,122 240,122 240,160 0,160" fill="#1e3a8a" />

        {/* Glowing Protective Forcefield Dome */}
        <circle cx="120" cy="80" r="48" fill="#bae6fd" opacity="0.6" stroke="#ffffff" strokeWidth="3" />
        <circle cx="120" cy="80" r="45" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="6,4" />
        {/* Golden Aura Ring on top */}
        <ellipse cx="120" cy="38" rx="20" ry="6" fill="none" stroke="#facc15" strokeWidth="3.5" />

        {/* Zen Meditating / Calm Stick Figure */}
        <g stroke="#090d16" strokeLinecap="round" strokeLinejoin="round">
          {/* Crossed legs */}
          <path d="M102,112 Q120,118 138,112" fill="none" strokeWidth="6.5" />
          <line x1="120" y1="112" x2="120" y2="78" strokeWidth="7.5" />
          <circle cx="120" cy="62" r="13" fill="#090d16" stroke="none" />
          {/* Folded arms */}
          <path d="M120,82 L106,92 L134,92 L120,82" fill="none" strokeWidth="5.5" />
        </g>

        {/* Shattering attack arrows outside the bubble */}
        <g transform="translate(45, 60) rotate(-30)">
          <line x1="0" y1="0" x2="25" y2="0" stroke="#ef4444" strokeWidth="3" />
          <polygon points="25,0 18,-5 18,5" fill="#ef4444" />
          <circle cx="28" cy="0" r="3" fill="#facc15" />
        </g>
        <g transform="translate(195, 60) rotate(30)">
          <line x1="0" y1="0" x2="-25" y2="0" stroke="#ef4444" strokeWidth="3" />
          <polygon points="-25,0 -18,-5 -18,5" fill="#ef4444" />
          <circle cx="-28" cy="0" r="3" fill="#facc15" />
        </g>
      </svg>
    );
  }

  // 9. ACCÉLÉRATION
  if (norm.includes('ACCÉLÉRATION') || norm.includes('ACCELERATION') || norm.includes('ACCELERAZIONE') || cardId === '7') {
    return (
      <svg viewBox="0 0 240 160" className={`w-full h-full ${className}`} preserveAspectRatio="xMidYMid slice">
        <rect width="240" height="160" fill="#16a34a" />
        {renderSunburst('#86efac', '#15803d', 70, 70, 20)}
        <polygon points="0,122 240,122 240,160 0,160" fill="#14532d" />
        <line x1="0" y1="122" x2="240" y2="122" stroke="#052e16" strokeWidth="2" />

        {/* Fire / Rocket Exhaust from back shoe */}
        <g transform="translate(60, 115)">
          <polygon points="-20,-5 5,-15 15,0 5,15" fill="#f97316" />
          <polygon points="-12,-3 5,-8 10,0 5,8" fill="#fde047" />
          <circle cx="-24" cy="0" r="8" fill="#ffffff" opacity="0.8" />
          <circle cx="-36" cy="-4" r="5" fill="#ffffff" opacity="0.6" />
        </g>

        {/* Sonic Sprinting Stick Figure */}
        <g stroke="#090d16" strokeLinecap="round" strokeLinejoin="round">
          {/* Back trailing leg */}
          <path d="M120,96 L90,105 L65,114" fill="none" strokeWidth="6.5" />
          {/* Front high stride leg */}
          <path d="M120,96 L145,95 L158,124" fill="none" strokeWidth="6.5" />
          {/* Deep forward lean torso */}
          <line x1="120" y1="96" x2="148" y2="70" strokeWidth="7.5" />
          <circle cx="160" cy="56" r="13" fill="#090d16" stroke="none" />
          {/* Pumping arms */}
          <path d="M140,74 L165,68 L175,80" fill="none" strokeWidth="5.5" />
          <path d="M136,78 L116,84 L105,74" fill="none" strokeWidth="5.5" />
        </g>

        {/* Massive Dynamic "+3" Speed Badge */}
        <g transform="translate(195, 45)">
          <rect x="-24" y="-18" width="48" height="36" rx="8" fill="#ffffff" stroke="#090d16" strokeWidth="3" />
          <text x="0" y="8" fill="#16a34a" fontSize="22" fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle">+3</text>
        </g>
        {/* Speed motion lines */}
        <line x1="15" y1="50" x2="80" y2="50" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
        <line x1="30" y1="70" x2="95" y2="70" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="10" y1="90" x2="60" y2="90" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  // 10. REBOND
  if (norm.includes('REBOND') || norm.includes('RIMBALZO') || cardId === '8') {
    return (
      <svg viewBox="0 0 240 160" className={`w-full h-full ${className}`} preserveAspectRatio="xMidYMid slice">
        <rect width="240" height="160" fill="#16a34a" />
        {renderSunburst('#fde047', '#15803d', 120, 45, 20)}
        <polygon points="0,124 240,124 240,160 0,160" fill="#14532d" />

        {/* Coiled Trampoline Spring */}
        <g transform="translate(70, 95)">
          <path d="M0,28 Q18,20 36,28 Q18,12 0,20 Q18,4 36,12 Q18,-4 0,4" fill="none" stroke="#e5e7eb" strokeWidth="5.5" strokeLinecap="round" />
          <line x1="-8" y1="28" x2="44" y2="28" stroke="#090d16" strokeWidth="4" />
        </g>

        {/* Curved Bounce Trajectory */}
        <path d="M88,95 Q105,30 145,45" fill="none" stroke="#facc15" strokeWidth="4" strokeDasharray="6,4" />

        {/* Figure at the peak of acrobatic leap */}
        <g stroke="#090d16" strokeLinecap="round" strokeLinejoin="round" transform="translate(145, 45)">
          {/* Tucked legs */}
          <path d="M0,15 L-14,28 L-22,20" fill="none" strokeWidth="6" />
          <path d="M0,15 L10,26 L4,36" fill="none" strokeWidth="6" />
          {/* Torso */}
          <line x1="0" y1="15" x2="0" y2="-12" strokeWidth="7" />
          <circle cx="0" cy="-24" r="12" fill="#090d16" stroke="none" />
          {/* Arms stretched up in victory */}
          <path d="M0,-8 L-18,-24 L-28,-22" fill="none" strokeWidth="5.5" />
          <path d="M0,-8 L18,-24 L28,-22" fill="none" strokeWidth="5.5" />
        </g>
        {/* Sparkles / Bounce Stars */}
        <polygon points="190,30 194,36 200,38 194,40 190,46 186,40 180,38 186,36" fill="#fde047" stroke="#090d16" strokeWidth="1" />
        <polygon points="120,20 123,24 128,25 123,26 120,30 117,26 112,25 117,24" fill="#fde047" stroke="#090d16" strokeWidth="1" />
      </svg>
    );
  }

  // 11. DOUBLE DÉ
  if (norm.includes('DOUBLE DÉ') || norm.includes('DOUBLE DE') || norm.includes('DOPPIO DADO') || cardId === '9') {
    return (
      <svg viewBox="0 0 240 160" className={`w-full h-full ${className}`} preserveAspectRatio="xMidYMid slice">
        <rect width="240" height="160" fill="#15803d" />
        {renderSunburst('#fde047', '#166534', 150, 75, 20)}
        <polygon points="0,122 240,122 240,160 0,160" fill="#14532d" />

        {/* Celebrating Stick Figure */}
        <g stroke="#090d16" strokeLinecap="round" strokeLinejoin="round">
          <path d="M60,98 L44,112 L30,126" fill="none" strokeWidth="6.5" />
          <path d="M60,98 L76,112 L88,126" fill="none" strokeWidth="6.5" />
          <line x1="60" y1="98" x2="60" y2="64" strokeWidth="7.5" />
          <circle cx="60" cy="48" r="13" fill="#090d16" stroke="none" />
          {/* Raising hands rolling dice */}
          <path d="M60,70 L42,54 L36,38" fill="none" strokeWidth="5.5" />
          <path d="M60,70 L78,54 L84,38" fill="none" strokeWidth="5.5" />
        </g>

        {/* Die 1 (Isometric showing 6) */}
        <g transform="translate(108, 65)">
          <polygon points="16,0 36,8 16,16 -4,8" fill="#ffffff" stroke="#090d16" strokeWidth="2.5" />
          <polygon points="-4,8 16,16 16,40 -4,32" fill="#e5e7eb" stroke="#090d16" strokeWidth="2.5" />
          <polygon points="16,16 36,8 36,32 16,40" fill="#d1d5db" stroke="#090d16" strokeWidth="2.5" />
          {/* Red 6 pips on top */}
          <circle cx="8" cy="6" r="2" fill="#dc2626" />
          <circle cx="16" cy="8" r="2" fill="#dc2626" />
          <circle cx="24" cy="10" r="2" fill="#dc2626" />
          <circle cx="8" cy="10" r="2" fill="#dc2626" />
          <circle cx="16" cy="12" r="2" fill="#dc2626" />
          <circle cx="24" cy="14" r="2" fill="#dc2626" />
        </g>

        {/* Die 2 (Isometric showing 6) */}
        <g transform="translate(150, 80)">
          <polygon points="16,0 36,8 16,16 -4,8" fill="#ffffff" stroke="#090d16" strokeWidth="2.5" />
          <polygon points="-4,8 16,16 16,40 -4,32" fill="#e5e7eb" stroke="#090d16" strokeWidth="2.5" />
          <polygon points="16,16 36,8 36,32 16,40" fill="#d1d5db" stroke="#090d16" strokeWidth="2.5" />
          {/* Red 6 pips */}
          <circle cx="8" cy="6" r="2" fill="#dc2626" />
          <circle cx="16" cy="8" r="2" fill="#dc2626" />
          <circle cx="24" cy="10" r="2" fill="#dc2626" />
          <circle cx="8" cy="10" r="2" fill="#dc2626" />
          <circle cx="16" cy="12" r="2" fill="#dc2626" />
          <circle cx="24" cy="14" r="2" fill="#dc2626" />
        </g>

        {/* Giant "×2" Multiplier Badge */}
        <g transform="translate(200, 45)">
          <polygon points="0,-18 12,-4 22,-8 14,4 24,14 10,12 8,24 0,14 -8,22 -6,10 -20,10 -10,0 -18,-10 -4,-5" fill="#facc15" stroke="#090d16" strokeWidth="2" />
          <text x="0" y="6" fill="#090d16" fontSize="15" fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle">×2</text>
        </g>
      </svg>
    );
  }

  // 12. ESQUIVE
  if (norm.includes('ESQUIVE') || norm.includes('SCHIVATA') || cardId === '12') {
    return (
      <svg viewBox="0 0 240 160" className={`w-full h-full ${className}`} preserveAspectRatio="xMidYMid slice">
        <rect width="240" height="160" fill="#0d9488" />
        {renderSunburst('#5eead4', '#115e59', 120, 80, 20)}
        <polygon points="0,122 240,122 240,160 0,160" fill="#134e4a" />

        {/* Blazing Red Laser / Attack whistling overhead */}
        <line x1="20" y1="36" x2="220" y2="36" stroke="#ef4444" strokeWidth="5" strokeLinecap="round" />
        <line x1="40" y1="36" x2="200" y2="36" stroke="#fde047" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="10" y1="28" x2="90" y2="28" stroke="#ffffff" strokeWidth="1.5" opacity="0.7" />

        {/* Stick Figure doing Matrix Limbo Dodge */}
        <g stroke="#090d16" strokeLinecap="round" strokeLinejoin="round">
          {/* Feet planted firmly */}
          <path d="M120,105 L105,116 L90,124" fill="none" strokeWidth="6.5" />
          <path d="M120,105 L135,116 L150,124" fill="none" strokeWidth="6.5" />
          {/* Torso bent almost horizontal backwards */}
          <path d="M120,105 L100,85 L76,75" fill="none" strokeWidth="7.5" />
          <circle cx="62" cy="72" r="12" fill="#090d16" stroke="none" />
          {/* Arms balancing */}
          <path d="M92,82 L80,98 L68,105" fill="none" strokeWidth="5.5" />
          <path d="M92,82 L112,68 L126,58" fill="none" strokeWidth="5.5" />
        </g>
        {/* Forward step bonus arrow "+1" */}
        <g transform="translate(195, 95)">
          <rect x="-18" y="-12" width="36" height="24" rx="6" fill="#ffffff" stroke="#090d16" strokeWidth="2.5" />
          <text x="0" y="5" fill="#0d9488" fontSize="13" fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle">+1</text>
        </g>
      </svg>
    );
  }

  // 13. ÉCHANGE
  if (norm.includes('ÉCHANGE') || norm.includes('ECHANGE') || norm.includes('SCAMBIO') || cardId === '13') {
    return (
      <svg viewBox="0 0 240 160" className={`w-full h-full ${className}`} preserveAspectRatio="xMidYMid slice">
        <rect width="240" height="160" fill="#7c3aed" />
        {renderSunburst('#c4b5fd', '#5b21b6', 120, 75, 20)}
        <polygon points="0,122 240,122 240,160 0,160" fill="#4c1d95" />

        {/* Double Circular Teleportation Vortex */}
        <path d="M75,55 C95,25 145,25 165,55" fill="none" stroke="#38bdf8" strokeWidth="5" strokeLinecap="round" />
        <polygon points="168,55 160,42 152,50" fill="#38bdf8" />

        <path d="M165,100 C145,130 95,130 75,100" fill="none" stroke="#f472b6" strokeWidth="5" strokeLinecap="round" />
        <polygon points="72,100 80,113 88,105" fill="#f472b6" />

        {/* Figure A on Left */}
        <g stroke="#090d16" strokeLinecap="round" strokeLinejoin="round" transform="translate(60, 60)">
          <line x1="0" y1="20" x2="-12" y2="55" strokeWidth="6" />
          <line x1="0" y1="20" x2="12" y2="55" strokeWidth="6" />
          <line x1="0" y1="20" x2="0" y2="-10" strokeWidth="7" />
          <circle cx="0" cy="-22" r="12" fill="#090d16" stroke="none" />
          <line x1="0" y1="-2" x2="-18" y2="15" strokeWidth="5" />
          <line x1="0" y1="-2" x2="18" y2="15" strokeWidth="5" />
        </g>

        {/* Figure B on Right */}
        <g stroke="#090d16" strokeLinecap="round" strokeLinejoin="round" transform="translate(180, 60)">
          <line x1="0" y1="20" x2="-12" y2="55" strokeWidth="6" />
          <line x1="0" y1="20" x2="12" y2="55" strokeWidth="6" />
          <line x1="0" y1="20" x2="0" y2="-10" strokeWidth="7" />
          <circle cx="0" cy="-22" r="12" fill="#090d16" stroke="none" />
          <line x1="0" y1="-2" x2="-18" y2="15" strokeWidth="5" />
          <line x1="0" y1="-2" x2="18" y2="15" strokeWidth="5" />
        </g>
        {/* Magic teleport particles */}
        <circle cx="120" cy="40" r="3" fill="#facc15" />
        <circle cx="120" cy="115" r="3" fill="#facc15" />
      </svg>
    );
  }

  // 14. VOL DE CARTE
  if (norm.includes('VOL DE CARTE') || norm.includes('FURTO DI CARTA') || norm.includes('FURTO') || (norm.includes('VOL') && !norm.includes('POLYVALENT') && !norm.includes('POLIVALENTE')) || cardId === '14') {
    return (
      <svg viewBox="0 0 240 160" className={`w-full h-full ${className}`} preserveAspectRatio="xMidYMid slice">
        <rect width="240" height="160" fill="#6d28d9" />
        {renderSunburst('#a78bfa', '#4c1d95', 80, 75, 20)}
        <polygon points="0,122 240,122 240,160 0,160" fill="#2e1065" />

        {/* Victim on right whistling looking away */}
        <g stroke="#090d16" strokeLinecap="round" strokeLinejoin="round">
          <path d="M165,96 L155,112 L150,125" fill="none" strokeWidth="6.5" />
          <path d="M165,96 L175,112 L185,125" fill="none" strokeWidth="6.5" />
          <line x1="165" y1="96" x2="165" y2="64" strokeWidth="7.5" />
          <circle cx="165" cy="48" r="13" fill="#090d16" stroke="none" />
          <path d="M165,72 L182,78 L190,92" fill="none" strokeWidth="5.5" />
        </g>
        {/* Comic note / question bubble */}
        <text x="180" y="38" fill="#facc15" fontSize="18" fontWeight="900" fontFamily="system-ui, sans-serif">♪</text>

        {/* Thief ninja stick figure tiptoeing on left */}
        <g stroke="#090d16" strokeLinecap="round" strokeLinejoin="round">
          <path d="M85,102 L70,114 L55,124" fill="none" strokeWidth="6.5" />
          <path d="M85,102 L98,114 L108,124" fill="none" strokeWidth="6.5" />
          <line x1="85" y1="102" x2="95" y2="72" strokeWidth="7.5" />
          <circle cx="102" cy="56" r="12.5" fill="#090d16" stroke="none" />
          {/* Long stealthy arm reaching for card */}
          <path d="M92,76 L122,76 L144,82" fill="none" strokeWidth="6" />
        </g>

        {/* Glowing Golden Card being snatched */}
        <g transform="translate(142, 70) rotate(-15)">
          <rect x="-8" y="-12" width="16" height="24" rx="2" fill="#fde047" stroke="#090d16" strokeWidth="2" />
          <circle cx="0" cy="0" r="4" fill="#ea580c" />
        </g>
      </svg>
    );
  }

  // 15. JOKER POLYVALENT
  if (norm.includes('JOKER') || cardId === '15') {
    return (
      <svg viewBox="0 0 240 160" className={`w-full h-full ${className}`} preserveAspectRatio="xMidYMid slice">
        <rect width="240" height="160" fill="#be185d" />
        {renderSunburst('#f472b6', '#9d174d', 120, 75, 22)}
        <polygon points="0,122 240,122 240,160 0,160" fill="#831843" />

        {/* Golden Jester / Crown Stick Figure */}
        <g stroke="#090d16" strokeLinecap="round" strokeLinejoin="round">
          <path d="M120,98 L102,112 L88,126" fill="none" strokeWidth="6.5" />
          <path d="M120,98 L138,112 L152,126" fill="none" strokeWidth="6.5" />
          <line x1="120" y1="98" x2="120" y2="64" strokeWidth="7.5" />
          <circle cx="120" cy="48" r="13" fill="#090d16" stroke="none" />
          {/* Juggling arms outstretched */}
          <path d="M120,70 L95,62 L78,48" fill="none" strokeWidth="5.5" />
          <path d="M120,70 L145,62 L162,48" fill="none" strokeWidth="5.5" />
        </g>
        {/* Golden Jester Hat / Crown */}
        <polygon points="106,40 112,25 120,32 128,25 134,40" fill="#facc15" stroke="#090d16" strokeWidth="2" />
        <circle cx="112" cy="24" r="2.5" fill="#fde047" />
        <circle cx="128" cy="24" r="2.5" fill="#fde047" />

        {/* 3 Juggled Elemental Orbs in Arc */}
        {/* 1. Attack Sword Orb */}
        <g transform="translate(68, 35)">
          <circle cx="0" cy="0" r="14" fill="#ef4444" stroke="#090d16" strokeWidth="2.5" />
          <path d="M-6,6 L6,-6" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
        </g>
        {/* 2. Shield Defense Orb */}
        <g transform="translate(120, 16)">
          <circle cx="0" cy="0" r="14" fill="#3b82f6" stroke="#090d16" strokeWidth="2.5" />
          <path d="M-5,-4 L5,-4 L0,5 Z" fill="#ffffff" />
        </g>
        {/* 3. Timer Bonus Orb */}
        <g transform="translate(172, 35)">
          <circle cx="0" cy="0" r="14" fill="#f59e0b" stroke="#090d16" strokeWidth="2.5" />
          <circle cx="0" cy="0" r="8" fill="#ffffff" />
          <line x1="0" y1="0" x2="3" y2="-4" stroke="#090d16" strokeWidth="2" />
        </g>
      </svg>
    );
  }

  // Fallback for custom or newly created cards
  return (
    <svg viewBox="0 0 240 160" className={`w-full h-full ${className}`} preserveAspectRatio="xMidYMid slice">
      <rect width="240" height="160" fill="#3b82f6" />
      {renderSunburst('#93c5fd', '#1d4ed8', 120, 75, 18)}
      <polygon points="0,122 240,122 240,160 0,160" fill="#1e3a8a" />
      <g stroke="#090d16" strokeLinecap="round" strokeLinejoin="round">
        <path d="M120,98 L104,112 L92,126" fill="none" strokeWidth="6.5" />
        <path d="M120,98 L136,112 L148,126" fill="none" strokeWidth="6.5" />
        <line x1="120" y1="98" x2="120" y2="64" strokeWidth="7.5" />
        <circle cx="120" cy="48" r="13" fill="#090d16" stroke="none" />
        <path d="M120,70 L96,56 L85,42" fill="none" strokeWidth="5.5" />
        <path d="M120,70 L144,56 L155,42" fill="none" strokeWidth="5.5" />
      </g>
      <polygon points="120,15 125,25 136,27 128,34 130,45 120,40 110,45 112,34 104,27 115,25" fill="#facc15" stroke="#090d16" strokeWidth="2" />
    </svg>
  );
};
