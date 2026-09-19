import React, { useState } from 'react';
import { CardBackDesign, CardData, Family, FamilyIconConfig, IconType, Language } from '../types';
import { getCardDisplayTitle, getFamilyDisplayName } from '../data';
import { 
  Trash2, 
  Edit3, 
  Check, 
  RefreshCw, 
  Maximize2, 
  X, 
  Upload, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  Timer, 
  Shield, 
  ShieldCheck, 
  Swords, 
  Zap, 
  Crown, 
  Sparkles, 
  Target, 
  Dice5, 
  Flame, 
  Heart,
  MessageSquare,
  Palette,
  ClipboardPaste,
  Sliders,
  Eye
} from 'lucide-react';
import { VisualCard, getMedallionBackground, isMedallionDark } from './VisualCard';
import { CardBack } from './CardBack';

interface CardEditorProps {
  card: CardData;
  onChange: (card: CardData) => void;
  onDelete: (id: string) => void;
  onUpdateFamilyIcon?: (family: Family, config: FamilyIconConfig) => void;
  language?: Language;
  backDesign?: CardBackDesign;
  customBackUrl?: string;
}

const FAMILY_COLORS: Record<Family, string> = {
  Attaque: 'bg-red-50 text-red-700 border-red-200',
  Défense: 'bg-sky-50 text-sky-700 border-sky-200',
  Progression: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Bonus: 'bg-amber-50 text-amber-800 border-amber-200',
  Contre: 'bg-teal-50 text-teal-700 border-teal-200',
  Spéciale: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  Joker: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200',
};

const AVAILABLE_ICONS: { id: IconType; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { id: 'timer', label: 'Chrono', icon: Timer },
  { id: 'shield', label: 'Bouclier', icon: Shield },
  { id: 'shield-check', label: 'Forteresse', icon: ShieldCheck },
  { id: 'swords', label: 'Épées', icon: Swords },
  { id: 'zap', label: 'Éclair', icon: Zap },
  { id: 'crown', label: 'Couronne', icon: Crown },
  { id: 'sparkles', label: 'Étoiles', icon: Sparkles },
  { id: 'target', label: 'Cible', icon: Target },
  { id: 'dice', label: 'Dé', icon: Dice5 },
  { id: 'flame', label: 'Flamme', icon: Flame },
  { id: 'heart', label: 'Cœur', icon: Heart },
  { id: 'refresh-cw', label: 'Échange', icon: RefreshCw },
];

const PRESET_ILLUSTRATIONS = [
  { id: 'PROLONGATION', label: 'Prolongation (+15 s) • Chronomètre & Bulle BD' },
  { id: 'CONTRE-ATTAQUE', label: 'Contre-Attaque • Bouclier d\'énergie & Déviation' },
  { id: 'BLOCAGE', label: 'Blocage • Mur de briques STOP' },
  { id: 'RALENTISSEMENT', label: 'Ralentissement • Boulet 100t enchaîné & Escargot' },
  { id: 'TEMPS RÉDUIT', label: 'Temps Réduit • Horloge fondante & Panique' },
  { id: 'RECUL FORCÉ', label: 'Recul Forcé • Gant de boxe à ressort' },
  { id: 'BOUCLIER', label: 'Bouclier • Écu saphir parant les flèches' },
  { id: 'IMMUNITÉ', label: 'Immunité • Bulle céleste de méditation' },
  { id: 'ACCÉLÉRATION', label: 'Accélération • Bottes propulsées à réaction' },
  { id: 'REBOND', label: 'Rebond • Trampoline géant sur ressort' },
  { id: 'DOUBLE DÉ', label: 'Double Dé • Dés géants et multiplicateur ×2' },
  { id: 'ESQUIVE', label: 'Esquive • Esquive souple en limbo sous laser' },
  { id: 'ÉCHANGE', label: 'Échange • Double vortex de téléportation' },
  { id: 'VOL DE CARTE', label: 'Vol de Carte • Silhouette ninja furtive' },
  { id: 'JOKER POLYVALENT', label: 'Joker Polyvalent • Bouffon jongleur' },
];

export const CardEditor: React.FC<CardEditorProps> = ({ 
  card, 
  onChange, 
  onDelete, 
  onUpdateFamilyIcon, 
  language = 'fr',
  backDesign = 'espresso',
  customBackUrl
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isBackView, setIsBackView] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [imageTab, setImageTab] = useState<'preset' | 'custom'>('preset');
  const [iconTab, setIconTab] = useState<'preset' | 'custom'>('preset');
  const [editLang, setEditLang] = useState<Language>(language);
  const [dragOver, setDragOver] = useState(false);
  const [iconPasteNotice, setIconPasteNotice] = useState('');

  // Keep form edit language in sync when global language changes
  React.useEffect(() => {
    setEditLang(language);
  }, [language]);

  const currentOpacity = card.containerOpacity !== undefined ? card.containerOpacity : 0.35;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onChange({
      ...card,
      [name]: name === 'quantity' ? parseInt(value) || 0 : value,
    });
  };

  // Helper to update icon and medallion background for all cards in this family
  const handleUpdateFamilyIcon = (newIcon?: IconType, newIconUrl?: string, newIconBgColor?: string) => {
    const finalBg = newIconBgColor !== undefined ? newIconBgColor : card.iconBgColor;
    if (onUpdateFamilyIcon) {
      onUpdateFamilyIcon(card.family, {
        customIcon: newIcon,
        customIconUrl: newIconUrl,
        iconBgColor: finalBg,
      });
    } else {
      onChange({
        ...card,
        customIcon: newIcon,
        customIconUrl: newIconUrl,
        iconBgColor: finalBg,
      });
    }
  };

  // Upload central image
  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner un fichier image valide (PNG, JPG, SVG, WebP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        onChange({
          ...card,
          customImageUrl: result,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  // Upload medallion header icon (shared across family)
  const handleIconFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner un fichier image pour l\'icône (PNG, SVG, JPG).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        handleUpdateFamilyIcon(undefined, result);
        setIconPasteNotice(`Icône appliquée à toutes les cartes ${card.family} !`);
        setTimeout(() => setIconPasteNotice(''), 3000);
      }
    };
    reader.readAsDataURL(file);
  };

  // Paste medallion header icon from clipboard (shared across family)
  const handlePasteIconFromClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.read) {
        const items = await navigator.clipboard.read();
        for (const item of items) {
          const imageType = item.types.find(type => type.startsWith('image/'));
          if (imageType) {
            const blob = await item.getType(imageType);
            const reader = new FileReader();
            reader.onload = (e) => {
              if (e.target?.result) {
                handleUpdateFamilyIcon(undefined, e.target.result as string);
                setIconPasteNotice(`Icône appliquée à toutes les cartes ${card.family} !`);
                setTimeout(() => setIconPasteNotice(''), 3000);
              }
            };
            reader.readAsDataURL(blob);
            return;
          }
        }
      }

      // Check text in clipboard if it contains image URL
      const text = await navigator.clipboard.readText();
      if (text && (text.startsWith('http') || text.startsWith('data:image'))) {
        handleUpdateFamilyIcon(undefined, text.trim());
        setIconPasteNotice(`URL appliquée à toutes les cartes ${card.family} !`);
        setTimeout(() => setIconPasteNotice(''), 3000);
        return;
      }

      setIconPasteNotice('Aucune image trouvée dans le presse-papier. Copiez d\'abord une image (Ctrl+C).');
      setTimeout(() => setIconPasteNotice(''), 4000);
    } catch {
      setIconPasteNotice('Accès presse-papier bloqué par le navigateur. Utilisez Ctrl+V dans le champ ci-dessous.');
      setTimeout(() => setIconPasteNotice(''), 5000);
    }
  };

  // Clipboard paste event handler on input
  const handleIconPasteEvent = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const items = e.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            e.preventDefault();
            handleIconFileUpload(file);
            return;
          }
        }
      }
    }
    // If text pasted is an image URL
    const pastedText = e.clipboardData.getData('text');
    if (pastedText && (pastedText.startsWith('http') || pastedText.startsWith('data:image'))) {
      e.preventDefault();
      handleUpdateFamilyIcon(undefined, pastedText.trim());
      setIconPasteNotice(`URL appliquée à toutes les cartes ${card.family} !`);
      setTimeout(() => setIconPasteNotice(''), 3000);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group">
      {/* Top action header */}
      <div className="px-4 py-2.5 bg-neutral-50/90 border-b border-neutral-200 flex justify-between items-center gap-2">
        <div className="flex items-center gap-2 truncate">
          <span className={`px-2 py-0.5 rounded text-[11px] font-bold border uppercase tracking-wider ${FAMILY_COLORS[card.family]}`}>
            {getFamilyDisplayName(card.family, language)}
          </span>
          <span className="text-xs font-semibold text-neutral-500 truncate">
            {getCardDisplayTitle(card, language)}
          </span>
          <span className="text-xs text-neutral-400 font-mono">
            ({card.quantity} ex.)
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {/* Flip Card Face/Back toggle */}
          <button
            onClick={() => setIsBackView(!isBackView)}
            className="p-1.5 text-neutral-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            title={isBackView ? 'Voir la face de la carte' : 'Voir le dos de la carte'}
          >
            <RefreshCw size={15} className={`transition-transform duration-300 ${isBackView ? 'rotate-180 text-indigo-600' : ''}`} />
          </button>

          {/* Zoom Modal toggle */}
          <button
            onClick={() => setIsZoomed(true)}
            className="p-1.5 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors"
            title="Agrandir la carte en haute définition"
          >
            <Maximize2 size={15} />
          </button>

          {/* Edit toggle */}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
              isEditing 
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm' 
                : 'bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200'
            }`}
            title={isEditing ? 'Terminer la modification' : 'Personnaliser textes, images, icônes et transparence'}
          >
            {isEditing ? (
              <>
                <Check size={14} />
                <span>Valider</span>
              </>
            ) : (
              <>
                <Edit3 size={14} />
                <span>Personnaliser</span>
              </>
            )}
          </button>
          
          <button
            onClick={() => onDelete(card.id)}
            className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Supprimer la carte"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Visual Card Showcase */}
      <div 
        onClick={() => setIsZoomed(true)}
        className="p-4 bg-gradient-to-b from-neutral-100/70 to-neutral-200/40 flex items-center justify-center flex-1 border-b border-neutral-100 cursor-pointer relative"
        title="Cliquez pour agrandir la carte"
      >
        <div className="transform transition-transform group-hover:scale-[1.02] duration-200">
          {isBackView ? (
            <CardBack 
              showCropMarks={false} 
              language={language} 
              design={backDesign}
              customImageUrl={customBackUrl}
            />
          ) : (
            <VisualCard card={card} showCropMarks={false} language={language} />
          )}
        </div>
      </div>

      {/* Edit Form Panel */}
      {isEditing && (
        <div className="p-4 bg-white flex flex-col gap-4 border-t border-neutral-200 animate-in fade-in duration-200">
          
          {/* 1. Basic Info with Bilingual Tab (FR / IT) */}
          <div className="space-y-3">
            {/* Language Edit Tab */}
            <div className="flex items-center justify-between bg-neutral-100 p-1 rounded-lg border border-neutral-200">
              <span className="text-[11px] font-bold text-neutral-600 px-2 uppercase tracking-wider">
                Langue éditée :
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setEditLang('fr')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold transition-all ${
                    editLang === 'fr' 
                      ? 'bg-white text-indigo-700 shadow-xs' 
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <span>🇫🇷</span>
                  <span>Français</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditLang('it')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold transition-all ${
                    editLang === 'it' 
                      ? 'bg-white text-emerald-700 shadow-xs' 
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <span>🇮🇹</span>
                  <span>Italiano</span>
                </button>
              </div>
            </div>

            {/* Title & Effect according to editLang */}
            {editLang === 'fr' ? (
              <>
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Titre de la carte (Français)
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={card.name}
                    onChange={handleChange}
                    className="w-full text-sm font-bold border-neutral-300 rounded-lg shadow-xs focus:border-indigo-500 focus:ring-indigo-500 py-1.5 px-2.5"
                    placeholder="Ex: PROLONGATION (+15 S), BLOCAGE..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-1">
                      Famille
                    </label>
                    <select
                      name="family"
                      value={card.family}
                      onChange={handleChange}
                      className="w-full text-xs font-semibold border-neutral-300 rounded-lg shadow-xs focus:border-indigo-500 focus:ring-indigo-500 py-1.5 px-2.5 bg-white"
                    >
                      <option value="Attaque">Attaque</option>
                      <option value="Défense">Défense</option>
                      <option value="Progression">Progression</option>
                      <option value="Bonus">Bonus</option>
                      <option value="Contre">Contre</option>
                      <option value="Spéciale">Spéciale</option>
                      <option value="Joker">Joker</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-1">
                      Quantité dans le deck
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      min="1"
                      max="12"
                      value={card.quantity}
                      onChange={handleChange}
                      className="w-full text-xs font-bold border-neutral-300 rounded-lg shadow-xs focus:border-indigo-500 focus:ring-indigo-500 py-1.5 px-2.5"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Texte de l'effet (Français)
                  </label>
                  <textarea
                    name="effect"
                    rows={2}
                    value={card.effect}
                    onChange={handleChange}
                    className="w-full text-xs font-medium border-neutral-300 rounded-lg shadow-xs focus:border-indigo-500 focus:ring-indigo-500 py-1.5 px-2.5 leading-relaxed"
                    placeholder="Description détaillée de l'effet en français..."
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-1">
                    Titolo della carta (Italiano)
                  </label>
                  <input
                    type="text"
                    name="nameIt"
                    value={card.nameIt || ''}
                    onChange={handleChange}
                    className="w-full text-sm font-bold border-emerald-300 rounded-lg shadow-xs focus:border-emerald-500 focus:ring-emerald-500 py-1.5 px-2.5 bg-emerald-50/20"
                    placeholder="Ex: PROLUNGAMENTO (+15 S), BLOCCO..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-1">
                      Famiglia ({getFamilyDisplayName(card.family, 'it')})
                    </label>
                    <select
                      name="family"
                      value={card.family}
                      onChange={handleChange}
                      className="w-full text-xs font-semibold border-neutral-300 rounded-lg shadow-xs focus:border-indigo-500 focus:ring-indigo-500 py-1.5 px-2.5 bg-white"
                    >
                      <option value="Attaque">Attaque / Attacco</option>
                      <option value="Défense">Défense / Difesa</option>
                      <option value="Progression">Progression / Progressione</option>
                      <option value="Bonus">Bonus</option>
                      <option value="Contre">Contre / Controattacco</option>
                      <option value="Spéciale">Spéciale / Speciale</option>
                      <option value="Joker">Joker</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-1">
                      Quantità nel mazzo
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      min="1"
                      max="12"
                      value={card.quantity}
                      onChange={handleChange}
                      className="w-full text-xs font-bold border-neutral-300 rounded-lg shadow-xs focus:border-indigo-500 focus:ring-indigo-500 py-1.5 px-2.5"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-1">
                    Testo dell'effetto (Italiano)
                  </label>
                  <textarea
                    name="effectIt"
                    rows={2}
                    value={card.effectIt || ''}
                    onChange={handleChange}
                    className="w-full text-xs font-medium border-emerald-300 rounded-lg shadow-xs focus:border-emerald-500 focus:ring-emerald-500 py-1.5 px-2.5 leading-relaxed bg-emerald-50/20"
                    placeholder="Descrizione dettagliata dell'effetto in italiano..."
                  />
                </div>
              </>
            )}
          </div>

          {/* 2. Transparency Slider for Title and Rules Containers */}
          <div className="pt-3 pb-1 border-t border-neutral-100 bg-neutral-50/70 p-3 rounded-xl border">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders size={13} className="text-indigo-600" />
                <span>Transparence des conteneurs (Titre & Règles)</span>
              </label>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                {Math.round((1 - currentOpacity) * 100)}% transparent
              </span>
            </div>

            <p className="text-[10px] text-neutral-500 mb-2">
              Laisse transparaître l'illustration d'arrière-plan sous les cartouches de texte.
            </p>

            <div className="flex items-center gap-2.5">
              <span className="text-[10px] text-neutral-400 font-bold shrink-0">Opaque (100%)</span>
              <input 
                type="range"
                min="0.05"
                max="1"
                step="0.05"
                value={currentOpacity}
                onChange={(e) => onChange({ ...card, containerOpacity: parseFloat(e.target.value) })}
                className="w-full accent-indigo-600 cursor-pointer h-2 bg-neutral-200 rounded-lg"
              />
              <span className="text-[10px] text-neutral-400 font-bold shrink-0">Transparent (5%)</span>
            </div>

            {/* Quick preset chips */}
            <div className="flex justify-between items-center text-[10px] text-neutral-500 mt-2 pt-1 border-t border-neutral-200/60">
              <button 
                type="button" 
                onClick={() => onChange({ ...card, containerOpacity: 0.15 })}
                className={`hover:text-indigo-600 px-1.5 py-0.5 rounded ${currentOpacity === 0.15 ? 'bg-indigo-100 font-bold text-indigo-700' : ''}`}
              >
                Très transparent (15%)
              </button>
              <button 
                type="button" 
                onClick={() => onChange({ ...card, containerOpacity: 0.35 })}
                className={`hover:text-indigo-600 px-1.5 py-0.5 rounded ${currentOpacity === 0.35 ? 'bg-indigo-100 font-bold text-indigo-700' : 'text-indigo-600 font-semibold'}`}
              >
                Défaut (35%)
              </button>
              <button 
                type="button" 
                onClick={() => onChange({ ...card, containerOpacity: 0.65 })}
                className={`hover:text-indigo-600 px-1.5 py-0.5 rounded ${currentOpacity === 0.65 ? 'bg-indigo-100 font-bold text-indigo-700' : ''}`}
              >
                Moyen (65%)
              </button>
              <button 
                type="button" 
                onClick={() => onChange({ ...card, containerOpacity: 1.0 })}
                className={`hover:text-indigo-600 px-1.5 py-0.5 rounded ${currentOpacity === 1.0 ? 'bg-indigo-100 font-bold text-indigo-700' : ''}`}
              >
                Opaque (100%)
              </button>
            </div>
          </div>

          {/* 3. Custom Header Medallion Icon Form (Vectors, File Upload, Clipboard Paste) - Grouped by Family */}
          <div className="pt-2 border-t border-neutral-100">
            <div className="flex items-start justify-between mb-2">
              <div>
                <label className="text-[11px] font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Palette size={13} className="text-indigo-600" />
                  <span>Icône de la famille {card.family}</span>
                </label>
                <p className="text-[10px] text-neutral-500 mt-0.5">
                  Partagée par toutes les cartes de la famille <strong>{card.family}</strong>.
                </p>
              </div>
              {(card.customIcon || card.customIconUrl) && (
                <button
                  type="button"
                  onClick={() => handleUpdateFamilyIcon(undefined, undefined)}
                  className="text-[10px] text-neutral-500 hover:text-neutral-900 underline font-medium"
                >
                  Rétablir par défaut
                </button>
              )}
            </div>

            {/* Segmented Tab: Preset Vector vs Custom Upload/Paste */}
            <div className="flex bg-neutral-100 p-0.5 rounded-lg border border-neutral-200 text-xs font-semibold mb-2.5">
              <button
                type="button"
                onClick={() => setIconTab('preset')}
                className={`flex-1 py-1 rounded-md transition-all text-center ${
                  iconTab === 'preset'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Icônes vectorielles
              </button>
              <button
                type="button"
                onClick={() => setIconTab('custom')}
                className={`flex-1 py-1 rounded-md transition-all text-center flex items-center justify-center gap-1 ${
                  iconTab === 'custom'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <span>Télécharger / Coller (Presse-papier)</span>
                {card.customIconUrl && <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />}
              </button>
            </div>

            {/* Mode A: Vector Presets */}
            {iconTab === 'preset' && (
              <div className="grid grid-cols-6 gap-1.5 p-2 bg-neutral-50 rounded-xl border border-neutral-200/80">
                {AVAILABLE_ICONS.map(item => {
                  const IconComp = item.icon;
                  const isSelected = !card.customIconUrl && card.customIcon === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleUpdateFamilyIcon(item.id, undefined)}
                      title={`${item.label} (s'applique à toute la famille ${card.family})`}
                      className={`flex flex-col items-center justify-center p-1.5 rounded-lg border transition-all ${
                        isSelected 
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs' 
                          : 'bg-white hover:bg-neutral-100 text-neutral-700 border-neutral-200'
                      }`}
                    >
                      <IconComp size={16} />
                      <span className="text-[9px] mt-0.5 font-medium truncate max-w-full leading-none">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Mode B: Upload or Paste from Clipboard */}
            {iconTab === 'custom' && (
              <div className="space-y-2.5 p-2.5 bg-neutral-50 rounded-xl border border-neutral-200/80">
                {/* Action buttons: Clipboard Paste + File Upload */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handlePasteIconFromClipboard}
                    className="flex items-center justify-center gap-1.5 py-2 px-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-lg border border-indigo-200 transition-colors shadow-xs"
                  >
                    <ClipboardPaste size={14} />
                    <span>Coller du presse-papier</span>
                  </button>

                  <label className="flex items-center justify-center gap-1.5 py-2 px-2.5 bg-white hover:bg-neutral-100 text-neutral-700 font-bold text-xs rounded-lg border border-neutral-300 transition-colors shadow-xs cursor-pointer">
                    <Upload size={14} />
                    <span>Importer un fichier</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleIconFileUpload(f);
                      }}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Paste interactive zone (Ctrl+V) & URL */}
                <div>
                  <label className="block text-[10px] font-bold text-neutral-600 uppercase mb-1 flex items-center gap-1">
                    <LinkIcon size={11} className="text-neutral-500" />
                    <span>Ou collez une image / URL ici (Ctrl+V)</span>
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={card.customIconUrl?.startsWith('data:') ? '' : (card.customIconUrl || '')}
                      onChange={(e) => handleUpdateFamilyIcon(undefined, e.target.value || undefined)}
                      onPaste={handleIconPasteEvent}
                      placeholder="Cliquez ici et faites Ctrl+V ou collez un lien..."
                      className="flex-1 text-xs border-neutral-300 rounded-lg shadow-xs focus:border-indigo-500 focus:ring-indigo-500 py-1.5 px-2 bg-white"
                    />
                    {card.customIconUrl && (
                      <button
                        type="button"
                        onClick={() => handleUpdateFamilyIcon(undefined, undefined)}
                        className="px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-colors"
                        title="Effacer l'icône personnalisée"
                      >
                        Effacer
                      </button>
                    )}
                  </div>
                </div>

                {iconPasteNotice && (
                  <p className="text-[11px] font-semibold text-indigo-700 bg-indigo-50/80 px-2 py-1 rounded border border-indigo-200">
                    {iconPasteNotice}
                  </p>
                )}

                {/* Active custom icon preview */}
                {card.customIconUrl && (
                  <div className="flex items-center gap-2.5 p-2 bg-emerald-50 rounded-lg border border-emerald-200">
                    <div 
                      className="w-8 h-8 rounded-full border-2 border-emerald-400 p-1 flex items-center justify-center shrink-0 shadow-xs"
                      style={{ background: getMedallionBackground(card.iconBgColor) }}
                    >
                      <img 
                        src={card.customIconUrl} 
                        alt="Aperçu médaillon" 
                        className="max-w-full max-h-full object-contain" 
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-emerald-900">
                        Icône active pour toute la famille {card.family}
                      </p>
                      <p className="text-[10px] text-emerald-700 truncate">
                        {card.customIconUrl.startsWith('data:') ? 'Image importée / collée' : card.customIconUrl}
                      </p>
                    </div>
                  </div>
                )}

                {/* Medallion Background Selector */}
                <div className="pt-2 border-t border-neutral-200/70">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold text-neutral-700 uppercase tracking-wider flex items-center gap-1">
                      <Palette size={11} className="text-indigo-600" />
                      <span>Fond du médaillon</span>
                    </span>
                    <span className="text-[9px] text-neutral-400">
                      Partagé avec toute la famille {card.family}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleUpdateFamilyIcon(card.customIcon, card.customIconUrl, 'pearl')}
                      className={`flex flex-col items-center p-1.5 rounded-lg border text-center transition-all ${
                        (!card.iconBgColor || card.iconBgColor === 'pearl' || card.iconBgColor === 'white')
                          ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600'
                          : 'border-neutral-200 bg-neutral-50 hover:bg-white'
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full border border-neutral-300 shadow-xs mb-1" style={{ background: 'radial-gradient(circle at 35% 30%, #ffffff 0%, #f8fafc 55%, #e2e8f0 100%)' }} />
                      <span className="text-[9px] font-bold text-neutral-800 leading-tight">Blanc</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleUpdateFamilyIcon(card.customIcon, card.customIconUrl, 'family-tint')}
                      className={`flex flex-col items-center p-1.5 rounded-lg border text-center transition-all ${
                        card.iconBgColor === 'family-tint'
                          ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600'
                          : 'border-neutral-200 bg-neutral-50 hover:bg-white'
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full border border-neutral-300 shadow-xs mb-1" style={{ background: 'radial-gradient(circle at 35% 30%, #ffffff 15%, #f8fafc 55%, #94a3b8 100%)' }} />
                      <span className="text-[9px] font-bold text-neutral-800 leading-tight">Teinté</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleUpdateFamilyIcon(card.customIcon, card.customIconUrl, 'gold')}
                      className={`flex flex-col items-center p-1.5 rounded-lg border text-center transition-all ${
                        card.iconBgColor === 'gold'
                          ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600'
                          : 'border-neutral-200 bg-neutral-50 hover:bg-white'
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full border border-amber-300 shadow-xs mb-1" style={{ background: 'radial-gradient(circle at 35% 30%, #fffbeb 0%, #fef3c7 45%, #fde68a 100%)' }} />
                      <span className="text-[9px] font-bold text-neutral-800 leading-tight">Doré</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleUpdateFamilyIcon(card.customIcon, card.customIconUrl, 'dark')}
                      className={`flex flex-col items-center p-1.5 rounded-lg border text-center transition-all ${
                        card.iconBgColor === 'dark'
                          ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600'
                          : 'border-neutral-200 bg-neutral-50 hover:bg-white'
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full border border-neutral-700 shadow-xs mb-1" style={{ background: 'radial-gradient(circle at 35% 30%, #334155 0%, #1e293b 60%, #0f172a 100%)' }} />
                      <span className="text-[9px] font-bold text-neutral-800 leading-tight">Titane</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 4. Central Image Customization Form */}
          <div className="pt-2 border-t border-neutral-100">
            <label className="text-[11px] font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <ImageIcon size={13} className="text-indigo-600" />
              <span>Image centrale de la carte</span>
            </label>

            {/* Segmented Tab Selector */}
            <div className="flex bg-neutral-100 p-0.5 rounded-lg border border-neutral-200 text-xs font-semibold mb-3">
              <button
                type="button"
                onClick={() => setImageTab('preset')}
                className={`flex-1 py-1 rounded-md transition-all text-center ${
                  imageTab === 'preset'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Illustration vectorielle
              </button>
              <button
                type="button"
                onClick={() => setImageTab('custom')}
                className={`flex-1 py-1 rounded-md transition-all text-center flex items-center justify-center gap-1 ${
                  imageTab === 'custom'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <span>Image perso / Fichier</span>
                {card.customImageUrl && <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />}
              </button>
            </div>

            {/* Tab A: Preset Vector Illustration */}
            {imageTab === 'preset' && (
              <div className="space-y-2.5">
                <div>
                  <label className="block text-[10px] font-bold text-neutral-600 uppercase mb-1">
                    Scène vectorielle du jeu
                  </label>
                  <select
                    value={card.illustrationPreset || ''}
                    onChange={(e) => onChange({
                      ...card,
                      illustrationPreset: e.target.value || undefined,
                      customImageUrl: undefined
                    })}
                    className="w-full text-xs font-medium border-neutral-300 rounded-lg shadow-xs focus:border-indigo-500 focus:ring-indigo-500 py-1.5 px-2 bg-white"
                  >
                    <option value="">Automatique (selon le nom de la carte)</option>
                    {PRESET_ILLUSTRATIONS.map(preset => (
                      <option key={preset.id} value={preset.id}>
                        {preset.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-neutral-600 uppercase mb-1 flex items-center gap-1">
                    <MessageSquare size={11} className="text-neutral-500" />
                    <span>Texte de la bulle BD (ex: pour Prolongation)</span>
                  </label>
                  <input
                    type="text"
                    value={card.customSpeechBubble || ''}
                    onChange={(e) => onChange({
                      ...card,
                      customSpeechBubble: e.target.value || undefined
                    })}
                    placeholder="Ex: PARLARE!, PRESTO!, ANDIAMO!, VAI!..."
                    className="w-full text-xs font-medium border-neutral-300 rounded-lg shadow-xs focus:border-indigo-500 focus:ring-indigo-500 py-1 px-2"
                  />
                </div>
              </div>
            )}

            {/* Tab B: Custom File Upload or URL */}
            {imageTab === 'custom' && (
              <div className="space-y-2.5">
                {/* Drag & Drop File Upload Box */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-3 text-center transition-colors ${
                    dragOver 
                      ? 'border-indigo-500 bg-indigo-50/60' 
                      : 'border-neutral-300 hover:border-neutral-400 bg-neutral-50/70'
                  }`}
                >
                  <Upload size={20} className="mx-auto text-neutral-400 mb-1" />
                  <p className="text-xs text-neutral-700 font-semibold">
                    Glissez-déposez une image ou{' '}
                    <label className="text-indigo-600 hover:text-indigo-700 cursor-pointer underline">
                      parcourez vos fichiers
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleFileUpload(f);
                        }}
                        className="hidden"
                      />
                    </label>
                  </p>
                  <p className="text-[10px] text-neutral-400 mt-0.5">
                    Formats acceptés : PNG, JPG, SVG, WebP
                  </p>
                </div>

                {/* Direct Image URL Input */}
                <div>
                  <label className="block text-[10px] font-bold text-neutral-600 uppercase mb-1 flex items-center gap-1">
                    <LinkIcon size={11} className="text-neutral-500" />
                    <span>Ou collez une URL d'image</span>
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      type="url"
                      value={card.customImageUrl?.startsWith('data:') ? '' : (card.customImageUrl || '')}
                      onChange={(e) => onChange({
                        ...card,
                        customImageUrl: e.target.value || undefined
                      })}
                      placeholder="https://exemple.com/mon-illustration.png"
                      className="flex-1 text-xs border-neutral-300 rounded-lg shadow-xs focus:border-indigo-500 focus:ring-indigo-500 py-1 px-2"
                    />
                    {card.customImageUrl && (
                      <button
                        type="button"
                        onClick={() => onChange({ ...card, customImageUrl: undefined })}
                        className="px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-colors"
                        title="Supprimer l'image personnalisée et revenir à l'illustration vectorielle"
                      >
                        Effacer
                      </button>
                    )}
                  </div>
                </div>

                {/* Image Preview & Status */}
                {card.customImageUrl && (
                  <div className="flex items-center gap-3 p-2 bg-emerald-50 rounded-lg border border-emerald-200">
                    <img 
                      src={card.customImageUrl} 
                      alt="Aperçu" 
                      className="w-10 h-10 object-cover rounded-md border border-emerald-300 shrink-0" 
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-emerald-900">Image personnalisée active</p>
                      <p className="text-[10px] text-emerald-700 truncate">
                        {card.customImageUrl.startsWith('data:') ? 'Fichier image importé' : card.customImageUrl}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>
      )}

      {/* HD Zoom Inspection Modal */}
      {isZoomed && (
        <div 
          className="fixed inset-0 z-50 bg-neutral-950/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setIsZoomed(false)}
        >
          <div 
            className="bg-neutral-900 border border-neutral-700 rounded-3xl p-6 shadow-2xl flex flex-col items-center gap-4 max-w-lg w-full"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Top Bar */}
            <div className="w-full flex items-center justify-between text-white border-b border-neutral-800 pb-3">
              <div>
                <h3 className="font-bold text-lg">{getCardDisplayTitle(card, language)}</h3>
                <p className="text-xs text-neutral-400">
                  {language === 'it' ? 'Famiglia' : 'Famille'} : {getFamilyDisplayName(card.family, language)} • {card.quantity} {language === 'it' ? 'esemplari nel mazzo' : 'exemplaires dans le deck'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsBackView(!isBackView)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-xs font-medium rounded-lg text-neutral-200 transition-colors"
                >
                  <RefreshCw size={14} className={isBackView ? 'rotate-180 text-amber-400' : ''} />
                  <span>{isBackView ? (language === 'it' ? 'Vedi Faccia' : 'Voir la Face') : (language === 'it' ? 'Vedi Dorso' : 'Voir le Dos')}</span>
                </button>
                <button
                  onClick={() => setIsZoomed(false)}
                  className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* High-res Scaled Card View (scale 1.38x) */}
            <div className="py-6 flex items-center justify-center">
              <div className="transform scale-[1.38] origin-center shadow-2xl rounded-[6mm]">
                {isBackView ? (
                  <CardBack 
                    showCropMarks={false} 
                    language={language} 
                    design={backDesign}
                    customImageUrl={customBackUrl}
                  />
                ) : (
                  <VisualCard card={card} showCropMarks={false} language={language} />
                )}
              </div>
            </div>

            {/* Hint footer */}
            <p className="text-xs text-neutral-400 text-center mt-2">
              Format standard de jeu : 63 mm × 90 mm • Rendu haute fidélité
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
