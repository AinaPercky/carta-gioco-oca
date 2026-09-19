import React, { useState } from 'react';
import { Family, FamilyIconConfig, IconType, Language } from '../types';
import { getFamilyDisplayName } from '../data';
import { HeaderIcon } from './HeaderIcon';
import { getMedallionBackground, isMedallionDark } from './VisualCard';
import { 
  Palette, 
  Upload, 
  ClipboardPaste, 
  Link as LinkIcon, 
  RotateCcw, 
  X, 
  Check, 
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
  RefreshCw 
} from 'lucide-react';

interface FamilyIconManagerProps {
  familyIcons: Record<Family, FamilyIconConfig>;
  onUpdateFamilyIcon: (family: Family, config: FamilyIconConfig) => void;
  cardCounts: Record<Family, number>;
  language?: Language;
}

interface FamilyMeta {
  family: Family;
  label: string;
  code: string;
  defaultIcon: IconType;
  accentBg: string;
  accentBorder: string;
  accentText: string;
  ringColor: string;
}

const FAMILIES_META: FamilyMeta[] = [
  {
    family: 'Attaque',
    label: 'Attaque',
    code: 'ATK',
    defaultIcon: 'swords',
    accentBg: 'bg-red-50 hover:bg-red-100/80',
    accentBorder: 'border-red-200',
    accentText: 'text-red-700',
    ringColor: '#dc2626',
  },
  {
    family: 'Défense',
    label: 'Défense',
    code: 'DEF',
    defaultIcon: 'shield-check',
    accentBg: 'bg-blue-50 hover:bg-blue-100/80',
    accentBorder: 'border-blue-200',
    accentText: 'text-blue-700',
    ringColor: '#2563eb',
  },
  {
    family: 'Contre',
    label: 'Contre',
    code: 'CTR',
    defaultIcon: 'shield',
    accentBg: 'bg-teal-50 hover:bg-teal-100/80',
    accentBorder: 'border-teal-200',
    accentText: 'text-teal-700',
    ringColor: '#0d9488',
  },
  {
    family: 'Progression',
    label: 'Progression',
    code: 'PRG',
    defaultIcon: 'zap',
    accentBg: 'bg-emerald-50 hover:bg-emerald-100/80',
    accentBorder: 'border-emerald-200',
    accentText: 'text-emerald-700',
    ringColor: '#16a34a',
  },
  {
    family: 'Bonus',
    label: 'Bonus',
    code: 'BON',
    defaultIcon: 'timer',
    accentBg: 'bg-amber-50 hover:bg-amber-100/80',
    accentBorder: 'border-amber-200',
    accentText: 'text-amber-800',
    ringColor: '#f59e0b',
  },
  {
    family: 'Spéciale',
    label: 'Spéciale',
    code: 'SPC',
    defaultIcon: 'sparkles',
    accentBg: 'bg-indigo-50 hover:bg-indigo-100/80',
    accentBorder: 'border-indigo-200',
    accentText: 'text-indigo-700',
    ringColor: '#7c3aed',
  },
  {
    family: 'Joker',
    label: 'Joker',
    code: 'JKR',
    defaultIcon: 'crown',
    accentBg: 'bg-fuchsia-50 hover:bg-fuchsia-100/80',
    accentBorder: 'border-fuchsia-200',
    accentText: 'text-fuchsia-700',
    ringColor: '#c026d3',
  },
];

const AVAILABLE_ICONS: { id: IconType; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { id: 'swords', label: 'Épées', icon: Swords },
  { id: 'shield', label: 'Bouclier', icon: Shield },
  { id: 'shield-check', label: 'Forteresse', icon: ShieldCheck },
  { id: 'zap', label: 'Éclair', icon: Zap },
  { id: 'timer', label: 'Chrono', icon: Timer },
  { id: 'crown', label: 'Couronne', icon: Crown },
  { id: 'sparkles', label: 'Étoiles', icon: Sparkles },
  { id: 'target', label: 'Cible', icon: Target },
  { id: 'dice', label: 'Dé', icon: Dice5 },
  { id: 'flame', label: 'Flamme', icon: Flame },
  { id: 'heart', label: 'Cœur', icon: Heart },
  { id: 'refresh-cw', label: 'Échange', icon: RefreshCw },
];

export const FamilyIconManager: React.FC<FamilyIconManagerProps> = ({
  familyIcons,
  onUpdateFamilyIcon,
  cardCounts,
  language = 'fr'
}) => {
  const [activeFamily, setActiveFamily] = useState<Family | null>(null);
  const [iconTab, setIconTab] = useState<'preset' | 'custom'>('preset');
  const [pasteNotice, setPasteNotice] = useState('');

  const activeMeta = activeFamily ? FAMILIES_META.find(f => f.family === activeFamily) : null;
  const currentConfig = activeFamily ? familyIcons[activeFamily] : undefined;

  const handleSelectVector = (iconId: IconType) => {
    if (!activeFamily) return;
    onUpdateFamilyIcon(activeFamily, {
      customIcon: iconId,
      customIconUrl: undefined,
    });
  };

  const handleFileUpload = (file: File) => {
    if (!activeFamily) return;
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner un fichier image valide (PNG, SVG, JPG).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        onUpdateFamilyIcon(activeFamily, {
          ...currentConfig,
          customIconUrl: result,
          customIcon: undefined,
        });
        setPasteNotice('Icône importée avec succès !');
        setTimeout(() => setPasteNotice(''), 3000);
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePasteClipboard = async () => {
    if (!activeFamily) return;
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
                onUpdateFamilyIcon(activeFamily, {
                  ...currentConfig,
                  customIconUrl: e.target.result as string,
                  customIcon: undefined,
                });
                setPasteNotice('Icône collée depuis le presse-papier !');
                setTimeout(() => setPasteNotice(''), 3000);
              }
            };
            reader.readAsDataURL(blob);
            return;
          }
        }
      }

      const text = await navigator.clipboard.readText();
      if (text && (text.startsWith('http') || text.startsWith('data:image'))) {
        onUpdateFamilyIcon(activeFamily, {
          ...currentConfig,
          customIconUrl: text.trim(),
          customIcon: undefined,
        });
        setPasteNotice('URL d\'icône collée !');
        setTimeout(() => setPasteNotice(''), 3000);
        return;
      }

      setPasteNotice('Aucune image trouvée dans le presse-papier. Copiez d\'abord une image (Ctrl+C).');
      setTimeout(() => setPasteNotice(''), 4000);
    } catch {
      setPasteNotice('Accès bloqué. Cliquez dans le champ et utilisez Ctrl+V.');
      setTimeout(() => setPasteNotice(''), 4500);
    }
  };

  const handleInputPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (!activeFamily) return;
    const items = e.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            e.preventDefault();
            handleFileUpload(file);
            return;
          }
        }
      }
    }
    const text = e.clipboardData.getData('text');
    if (text && (text.startsWith('http') || text.startsWith('data:image'))) {
      e.preventDefault();
      onUpdateFamilyIcon(activeFamily, {
        ...currentConfig,
        customIconUrl: text.trim(),
        customIcon: undefined,
      });
      setPasteNotice('URL d\'icône appliquée !');
      setTimeout(() => setPasteNotice(''), 3000);
    }
  };

  const handleChangeMedallionBg = (bgColor?: string) => {
    if (!activeFamily) return;
    onUpdateFamilyIcon(activeFamily, {
      ...currentConfig,
      iconBgColor: bgColor,
    });
  };

  const handleApplyBgToAllFamilies = (bgColor?: string) => {
    FAMILIES_META.forEach(meta => {
      const cfg = familyIcons[meta.family];
      onUpdateFamilyIcon(meta.family, {
        ...cfg,
        iconBgColor: bgColor,
      });
    });
    setPasteNotice('Style de fond appliqué à toutes les familles !');
    setTimeout(() => setPasteNotice(''), 3000);
  };

  const handleResetToDefault = () => {
    if (!activeFamily || !activeMeta) return;
    onUpdateFamilyIcon(activeFamily, {
      customIcon: activeMeta.defaultIcon,
      customIconUrl: undefined,
      iconBgColor: undefined,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-sm p-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-neutral-100">
        <div>
          <div className="flex items-center gap-2">
            <Palette size={18} className="text-indigo-600" />
            <h2 className="text-base font-bold text-neutral-900 tracking-tight">
              Icônes des 7 Familles de Cartes
            </h2>
            <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
              Harmonisé par famille
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            Toutes les cartes d'une même famille partagent automatiquement la même icône de médaillon. Cliquez sur une famille pour la personnaliser.
          </p>
        </div>
      </div>

      {/* 7 Families Grid Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5">
        {FAMILIES_META.map(meta => {
          const config = familyIcons[meta.family];
          const count = cardCounts[meta.family] || 0;
          const isSelected = activeFamily === meta.family;

          return (
            <button
              key={meta.family}
              type="button"
              onClick={() => {
                setActiveFamily(meta.family);
                setIconTab('preset');
              }}
              className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between relative group ${
                isSelected
                  ? 'ring-2 ring-indigo-600 bg-white shadow-md border-transparent'
                  : `${meta.accentBg} ${meta.accentBorder}`
              }`}
            >
              {/* Header: Family Name & Count */}
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className={`text-[11px] font-black uppercase tracking-wider ${meta.accentText}`}>
                  {getFamilyDisplayName(meta.family, language)}
                </span>
                <span className="text-[10px] font-bold text-neutral-500 bg-white/80 px-1.5 py-0.5 rounded border border-neutral-200/60">
                  {count} {language === 'it' ? 'carte' : 'ex.'}
                </span>
              </div>

              {/* Medallion Preview */}
              <div className="flex items-center justify-center my-1">
                {(() => {
                  const isDark = isMedallionDark(config?.iconBgColor);
                  const medallionBg = getMedallionBackground(config?.iconBgColor, meta.ringColor);
                  return (
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center relative shadow-[0_1.5px_3px_rgba(0,0,0,0.16)]"
                      style={{ 
                        background: medallionBg,
                        border: `2px solid ${isDark ? '#ffffff' : '#0f172a'}` 
                      }}
                    >
                      {/* Concentric colored accent ring */}
                      <div 
                        className="absolute inset-[1.6px] rounded-full pointer-events-none"
                        style={{ 
                          border: `1.4px solid ${meta.ringColor}`,
                          boxShadow: isDark ? 'inset 0 1px 2px rgba(0,0,0,0.5)' : 'inset 0 1px 2px rgba(255,255,255,0.85)'
                        }}
                      />
                      
                      {/* Specular highlight arc */}
                      <div 
                        className="absolute inset-[2.8px] rounded-full pointer-events-none opacity-40"
                        style={{
                          background: 'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 55%)'
                        }}
                      />

                      <div className="relative z-10 flex items-center justify-center w-full h-full p-2">
                        <HeaderIcon 
                          iconType={config?.customIcon || meta.defaultIcon} 
                          iconUrl={config?.customIconUrl}
                          color={isDark ? '#ffffff' : meta.ringColor}
                          className="w-5 h-5"
                        />
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Edit label */}
              <div className="mt-2 text-center">
                <span className="text-[10px] font-semibold text-neutral-600 group-hover:text-indigo-700 transition-colors">
                  {isSelected ? '✓ En cours' : 'Modifier l\'icône'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Popover / Modal for customizing the chosen family */}
      {activeFamily && activeMeta && (
        <div className="mt-4 p-4 bg-neutral-50/90 rounded-xl border border-neutral-200 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-neutral-200">
            <div className="flex items-center gap-2.5">
              <span className={`px-2.5 py-1 rounded-md text-xs font-black uppercase tracking-wider text-white`} style={{ backgroundColor: activeMeta.ringColor }}>
                Famille {activeMeta.label}
              </span>
              <span className="text-xs text-neutral-600 font-medium">
                Cette icône sera appliquée aux <strong>{cardCounts[activeFamily] || 0} cartes</strong> {activeMeta.label} du deck.
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetToDefault}
                className="flex items-center gap-1 text-xs font-semibold text-neutral-600 hover:text-neutral-900 bg-white px-2.5 py-1 rounded-lg border border-neutral-200 transition-colors"
                title="Rétablir l'icône originale de cette famille"
              >
                <RotateCcw size={13} />
                <span>Rétablir par défaut</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveFamily(null)}
                className="p-1 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors"
                title="Fermer"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Segmented Mode Selector */}
          <div className="flex bg-neutral-200/70 p-1 rounded-lg border border-neutral-300 text-xs font-semibold mb-3 max-w-md">
            <button
              type="button"
              onClick={() => setIconTab('preset')}
              className={`flex-1 py-1 rounded-md transition-all text-center ${
                iconTab === 'preset'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Icônes vectorielles du jeu
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
              {currentConfig?.customIconUrl && <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />}
            </button>
          </div>

          {/* Mode 1: Vector Grid */}
          {iconTab === 'preset' && (
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-2 p-2 bg-white rounded-xl border border-neutral-200 shadow-xs">
              {AVAILABLE_ICONS.map(item => {
                const IconComp = item.icon;
                const isSelected = !currentConfig?.customIconUrl && (currentConfig?.customIcon || activeMeta.defaultIcon) === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectVector(item.id)}
                    title={item.label}
                    className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs scale-105'
                        : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border-neutral-200'
                    }`}
                  >
                    <IconComp size={18} />
                    <span className="text-[10px] mt-1 font-medium truncate max-w-full leading-none">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Mode 2: Upload or Paste from Clipboard */}
          {iconTab === 'custom' && (
            <div className="space-y-3 p-3 bg-white rounded-xl border border-neutral-200 shadow-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handlePasteClipboard}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-lg border border-indigo-200 transition-colors shadow-xs"
                >
                  <ClipboardPaste size={16} />
                  <span>Coller une icône du presse-papier</span>
                </button>

                <label className="flex items-center justify-center gap-2 py-2.5 px-3 bg-white hover:bg-neutral-50 text-neutral-700 font-bold text-xs rounded-lg border border-neutral-300 transition-colors shadow-xs cursor-pointer">
                  <Upload size={16} />
                  <span>Importer un fichier image</span>
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
              </div>

              {/* Paste interactive zone (Ctrl+V) & URL */}
              <div>
                <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1 flex items-center gap-1">
                  <LinkIcon size={12} className="text-neutral-500" />
                  <span>Ou collez une image / URL web ici (Ctrl+V)</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={currentConfig?.customIconUrl?.startsWith('data:') ? '' : (currentConfig?.customIconUrl || '')}
                    onChange={(e) => {
                      if (!activeFamily) return;
                      onUpdateFamilyIcon(activeFamily, {
                        customIconUrl: e.target.value || undefined,
                        customIcon: undefined,
                      });
                    }}
                    onPaste={handleInputPaste}
                    placeholder="Cliquez ici et faites Ctrl+V ou collez une URL d'icône..."
                    className="flex-1 text-xs border-neutral-300 rounded-lg shadow-xs focus:border-indigo-500 focus:ring-indigo-500 py-1.5 px-2.5 bg-neutral-50 focus:bg-white"
                  />
                  {currentConfig?.customIconUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        if (!activeFamily) return;
                        onUpdateFamilyIcon(activeFamily, {
                          customIcon: activeMeta.defaultIcon,
                          customIconUrl: undefined,
                        });
                      }}
                      className="px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-colors"
                      title="Supprimer l'icône personnalisée"
                    >
                      Effacer
                    </button>
                  )}
                </div>
              </div>

              {pasteNotice && (
                <p className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1.5 rounded-lg border border-indigo-200">
                  {pasteNotice}
                </p>
              )}

              {/* Active custom icon preview */}
              {currentConfig?.customIconUrl && (
                <div className="flex items-center gap-3 p-2 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div 
                    className="w-10 h-10 rounded-full border-2 border-emerald-400 p-1.5 flex items-center justify-center shrink-0 shadow-xs"
                    style={{ background: getMedallionBackground(currentConfig.iconBgColor, activeMeta.ringColor) }}
                  >
                    <img 
                      src={currentConfig.customIconUrl} 
                      alt="Aperçu médaillon" 
                      className="max-w-full max-h-full object-contain" 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-emerald-900">
                      Icône personnalisée active pour toute la famille {activeMeta.label}
                    </p>
                    <p className="text-[11px] text-emerald-700 truncate">
                      {currentConfig.customIconUrl.startsWith('data:') ? 'Image importée / collée' : currentConfig.customIconUrl}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mode 3: Medallion Background & Contrast Styling */}
          <div className="mt-3 p-3 bg-white rounded-xl border border-neutral-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
              <div>
                <span className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                  <Palette size={13} className="text-indigo-600" />
                  Couleur et fond du médaillon
                </span>
                <p className="text-[10px] text-neutral-500">
                  Blanc nacré par défaut pour garantir que les icônes noires et illustrations restent toujours visibles.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleApplyBgToAllFamilies(currentConfig?.iconBgColor || 'pearl')}
                className="text-[10px] font-semibold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-md border border-indigo-200 transition-colors"
                title="Appliquer ce fond à toutes les 7 familles du jeu"
              >
                Appliquer à toutes les familles
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {/* Option 1: Blanc Nacré (Default) */}
              <button
                type="button"
                onClick={() => handleChangeMedallionBg('pearl')}
                className={`flex items-center gap-2 p-2 rounded-lg border text-left transition-all ${
                  (!currentConfig?.iconBgColor || currentConfig.iconBgColor === 'pearl' || currentConfig.iconBgColor === 'white')
                    ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600'
                    : 'border-neutral-200 hover:border-neutral-300 bg-neutral-50'
                }`}
              >
                <div 
                  className="w-5 h-5 rounded-full border border-neutral-300 shadow-xs shrink-0" 
                  style={{ background: 'radial-gradient(circle at 35% 30%, #ffffff 0%, #f8fafc 55%, #e2e8f0 100%)' }} 
                />
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-neutral-800 leading-tight">Blanc Nacré</p>
                  <p className="text-[9px] text-neutral-500">Contraste max</p>
                </div>
              </button>

              {/* Option 2: Teinté Famille */}
              <button
                type="button"
                onClick={() => handleChangeMedallionBg('family-tint')}
                className={`flex items-center gap-2 p-2 rounded-lg border text-left transition-all ${
                  currentConfig?.iconBgColor === 'family-tint'
                    ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600'
                    : 'border-neutral-200 hover:border-neutral-300 bg-neutral-50'
                }`}
              >
                <div 
                  className="w-5 h-5 rounded-full border border-neutral-300 shadow-xs shrink-0" 
                  style={{ background: `radial-gradient(circle at 35% 30%, #ffffff 15%, #f8fafc 55%, ${activeMeta.ringColor}33 100%)` }} 
                />
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-neutral-800 leading-tight">Teinté Famille</p>
                  <p className="text-[9px] text-neutral-500">Halo {activeMeta.label}</p>
                </div>
              </button>

              {/* Option 3: Or Prestige */}
              <button
                type="button"
                onClick={() => handleChangeMedallionBg('gold')}
                className={`flex items-center gap-2 p-2 rounded-lg border text-left transition-all ${
                  currentConfig?.iconBgColor === 'gold'
                    ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600'
                    : 'border-neutral-200 hover:border-neutral-300 bg-neutral-50'
                }`}
              >
                <div 
                  className="w-5 h-5 rounded-full border border-amber-300 shadow-xs shrink-0" 
                  style={{ background: 'radial-gradient(circle at 35% 30%, #fffbeb 0%, #fef3c7 45%, #fde68a 100%)' }} 
                />
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-neutral-800 leading-tight">Or Prestige</p>
                  <p className="text-[9px] text-neutral-500">Effet pièce d'or</p>
                </div>
              </button>

              {/* Option 4: Sombre Titane */}
              <button
                type="button"
                onClick={() => handleChangeMedallionBg('dark')}
                className={`flex items-center gap-2 p-2 rounded-lg border text-left transition-all ${
                  currentConfig?.iconBgColor === 'dark'
                    ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600'
                    : 'border-neutral-200 hover:border-neutral-300 bg-neutral-50'
                }`}
              >
                <div 
                  className="w-5 h-5 rounded-full border border-neutral-700 shadow-xs shrink-0" 
                  style={{ background: 'radial-gradient(circle at 35% 30%, #334155 0%, #1e293b 60%, #0f172a 100%)' }} 
                />
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-neutral-800 leading-tight">Sombre Titane</p>
                  <p className="text-[9px] text-neutral-500">Icônes claires</p>
                </div>
              </button>
            </div>
          </div>

          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={() => setActiveFamily(null)}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
            >
              <Check size={14} />
              <span>Valider pour la famille {activeMeta.label}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
