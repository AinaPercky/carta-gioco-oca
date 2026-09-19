import React from 'react';
import { CardBackDesign, CardData, Language } from '../types';
import { VisualCard } from './VisualCard';
import { CardBack } from './CardBack';

interface PrintableCardProps {
  card: CardData;
  printBacks?: boolean;
  language?: Language;
  backDesign?: CardBackDesign;
  customBackUrl?: string;
}

export const PrintableCard: React.FC<PrintableCardProps> = ({ 
  card, 
  printBacks = false,
  language = 'fr',
  backDesign = 'espresso',
  customBackUrl
}) => {
  return (
    <div 
      className="relative flex items-center justify-center break-inside-avoid" 
      style={{ width: '69mm', height: '96mm' }}
    >
      {printBacks ? (
        <CardBack 
          showCropMarks={true} 
          language={language} 
          design={backDesign}
          customImageUrl={customBackUrl}
        />
      ) : (
        <VisualCard card={card} showCropMarks={true} language={language} />
      )}
    </div>
  );
};
