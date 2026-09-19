export type Language = 'fr' | 'it';

export type CardBackDesign = 'espresso' | 'classic';

export type Family = 'Attaque' | 'Défense' | 'Progression' | 'Bonus' | 'Contre' | 'Spéciale' | 'Joker';

export type IconType = 
  | 'timer' 
  | 'shield' 
  | 'shield-check' 
  | 'swords' 
  | 'zap' 
  | 'sparkles' 
  | 'crown'
  | 'target'
  | 'dice'
  | 'flame'
  | 'heart'
  | 'goose'
  | 'refresh-cw';

export interface FamilyIconConfig {
  customIcon?: IconType;
  customIconUrl?: string;
  iconBgColor?: string;
}

export interface CardData {
  id: string;
  name: string;
  family: Family;
  quantity: number;
  effect: string;
  nameIt?: string;
  effectIt?: string;
  customIcon?: IconType;
  customIconUrl?: string;
  iconBgColor?: string;
  customImageUrl?: string;
  illustrationPreset?: string;
  customSpeechBubble?: string;
  containerOpacity?: number; // Background opacity for title and rules containers (0.0 to 1.0, default 0.35)
}
