import React, { useState } from 'react';
import { INITIAL_CARDS } from './data';
import { CardData, Family, FamilyIconConfig, Language } from './types';
import { CardEditor } from './components/CardEditor';
import { FamilyIconManager } from './components/FamilyIconManager';
import { PrintableCard } from './components/PrintableCard';
import { Printer, Plus, Download, Info, RotateCcw, ShieldAlert, Swords, ShieldCheck, Zap } from 'lucide-react';

const DEFAULT_FAMILY_ICONS: Record<Family, FamilyIconConfig> = {
  Attaque: { customIcon: 'swords' },
  Défense: { customIcon: 'shield-check' },
  Contre: { customIcon: 'shield' },
  Progression: { customIcon: 'zap' },
  Bonus: { customIcon: 'timer' },
  Spéciale: { customIcon: 'sparkles' },
  Joker: { customIcon: 'crown' },
};

export default function App() {
  const [cards, setCards] = useState<CardData[]>(INITIAL_CARDS);
  const [familyIcons, setFamilyIcons] = useState<Record<Family, FamilyIconConfig>>(DEFAULT_FAMILY_ICONS);
  const [language, setLanguage] = useState<Language>('fr');
  const [showRules, setShowRules] = useState(false);
  const [showIframeWarning, setShowIframeWarning] = useState(false);
  const [printSide, setPrintSide] = useState<'front' | 'back'>('front');

  const handleUpdateFamilyIcon = (family: Family, config: FamilyIconConfig) => {
    setFamilyIcons(prev => ({
      ...prev,
      [family]: config,
    }));

    setCards(prevCards => prevCards.map(c => {
      if (c.family === family) {
        return {
          ...c,
          customIcon: config.customIcon,
          customIconUrl: config.customIconUrl,
          iconBgColor: config.iconBgColor,
        };
      }
      return c;
    }));
  };

  const handleUpdateCard = (updatedCard: CardData) => {
    const oldCard = cards.find(c => c.id === updatedCard.id);
    const familyChanged = oldCard && oldCard.family !== updatedCard.family;

    const finalCard = familyChanged ? {
      ...updatedCard,
      customIcon: familyIcons[updatedCard.family]?.customIcon,
      customIconUrl: familyIcons[updatedCard.family]?.customIconUrl,
      iconBgColor: familyIcons[updatedCard.family]?.iconBgColor,
    } : updatedCard;

    setCards(cards.map(c => c.id === finalCard.id ? finalCard : c));
  };

  const handleDeleteCard = (id: string) => {
    setCards(cards.filter(c => c.id !== id));
  };

  const handleResetToBalanced = () => {
    setFamilyIcons(DEFAULT_FAMILY_ICONS);
    setCards(INITIAL_CARDS.map(c => ({
      ...c,
      customIcon: DEFAULT_FAMILY_ICONS[c.family]?.customIcon,
      customIconUrl: undefined,
    })));
  };

  const handleAddCard = () => {
    const newCard: CardData = {
      id: Date.now().toString(),
      name: 'NOUVELLE CARTE',
      family: 'Spéciale',
      quantity: 1,
      effect: 'Description de la carte...',
      customIcon: familyIcons['Spéciale']?.customIcon,
      customIconUrl: familyIcons['Spéciale']?.customIconUrl,
    };
    setCards([...cards, newCard]);
  };

  const handlePrint = () => {
    // Si l'application est exécutée dans un iFrame (comme l'aperçu AI Studio)
    if (window !== window.parent) {
      setShowIframeWarning(true);
    } else {
      window.print();
    }
  };

  const totalCards = cards.reduce((acc, card) => acc + card.quantity, 0);

  // Calculs d'équilibrage
  const attackCount = cards
    .filter(c => c.family === 'Attaque')
    .reduce((acc, c) => acc + c.quantity, 0);
  const defenseCount = cards
    .filter(c => c.family === 'Défense')
    .reduce((acc, c) => acc + c.quantity, 0);
  const counterCount = cards
    .filter(c => c.family === 'Contre')
    .reduce((acc, c) => acc + c.quantity, 0);
  const reactionCount = defenseCount + counterCount;
  const progressionCount = cards
    .filter(c => c.family === 'Progression')
    .reduce((acc, c) => acc + c.quantity, 0);
  const bonusCount = cards
    .filter(c => c.family === 'Bonus')
    .reduce((acc, c) => acc + c.quantity, 0);
  const progBonusCount = progressionCount + bonusCount;
  const specialCount = cards
    .filter(c => c.family === 'Spéciale')
    .reduce((acc, c) => acc + c.quantity, 0);
  const jokerCount = cards
    .filter(c => c.family === 'Joker')
    .reduce((acc, c) => acc + c.quantity, 0);
  const specialJokerCount = specialCount + jokerCount;

  const cardCounts: Record<Family, number> = {
    Attaque: attackCount,
    Défense: defenseCount,
    Contre: counterCount,
    Progression: progressionCount,
    Bonus: bonusCount,
    Spéciale: specialCount,
    Joker: jokerCount,
  };

  // Generate an array of cards based on their quantities for printing
  const printDeck = cards.flatMap(card => 
    Array.from({ length: card.quantity }, () => card)
  );

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans">
      {/* --- UI (Screen Only) --- */}
      <div className="screen-only">
        <header className="bg-white border-b border-neutral-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Jeu de l'Oie : Deck Universel (12 Joueurs)</h1>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${totalCards === 48 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                  {totalCards} cartes {totalCards === 48 ? '(48/48 parfait • 12×4)' : '(écart de deck)'}
                </span>
              </div>
              <p className="text-sm text-neutral-500 font-medium mt-1">
                Équilibré : {attackCount} Attaques • {reactionCount} Défenses & Contres • {progBonusCount} Progression & Bonus • {specialJokerCount} Spéciales & Jokers
              </p>
            </div>
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Language Switcher (Français / Italiano) */}
              <div className="flex items-center bg-neutral-100 p-1 rounded-lg border border-neutral-200 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setLanguage('fr')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
                    language === 'fr' 
                      ? 'bg-white text-indigo-700 shadow-xs ring-1 ring-neutral-300/50 font-bold' 
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                  title="Afficher et imprimer les cartes en Français"
                >
                  <span className="text-sm">🇫🇷</span>
                  <span>Français</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('it')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
                    language === 'it' 
                      ? 'bg-white text-emerald-700 shadow-xs ring-1 ring-neutral-300/50 font-bold' 
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                  title="Visualizza e stampa le carte in Italiano"
                >
                  <span className="text-sm">🇮🇹</span>
                  <span>Italiano</span>
                </button>
              </div>

              <button
                onClick={handleResetToBalanced}
                title="Rétablir la composition équilibrée pour 12 joueurs (48 cartes, 4 par joueur)"
                className="flex items-center gap-1.5 px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg font-medium transition-colors text-sm"
              >
                <RotateCcw size={16} />
                Réinitialiser (48)
              </button>
              <button
                onClick={() => setShowRules(!showRules)}
                className="flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg font-medium transition-colors text-sm"
              >
                <Info size={18} />
                Règles & Équilibre
              </button>

              {/* Recto / Verso Selector for Print */}
              <div className="flex items-center bg-neutral-100 p-1 rounded-lg border border-neutral-200 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setPrintSide('front')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    printSide === 'front' 
                      ? 'bg-white text-indigo-700 shadow-xs' 
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                  title="Imprimer les faces des cartes"
                >
                  Faces (Recto)
                </button>
                <button
                  type="button"
                  onClick={() => setPrintSide('back')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    printSide === 'back' 
                      ? 'bg-white text-indigo-700 shadow-xs' 
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                  title="Imprimer les dos des cartes pour un tirage recto-verso"
                >
                  Dos (Verso)
                </button>
              </div>

              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors text-sm shadow-sm"
              >
                <Printer size={18} />
                <span>Imprimer {printSide === 'front' ? 'Faces' : 'Dos'} (PDF)</span>
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Balance summary pill bar */}
          <div className="mb-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-3">
              <div className="p-2 bg-red-100 text-red-700 rounded-lg">
                <Swords size={20} />
              </div>
              <div>
                <div className="text-xs text-red-600 font-medium uppercase tracking-wider">Attaques (1/3)</div>
                <div className="text-lg font-bold text-red-900">{attackCount} cartes <span className="text-xs font-normal text-red-700">(5 Bloc, 5 Ral., 2 Tps., 4 Rec.)</span></div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center gap-3">
              <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                <ShieldCheck size={20} />
              </div>
              <div>
                <div className="text-xs text-blue-600 font-medium uppercase tracking-wider">Défenses & Contres</div>
                <div className="text-lg font-bold text-blue-900">{reactionCount} cartes <span className="text-xs font-normal text-blue-700">(8 Déf. + 5 Contres)</span></div>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-3">
              <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                <Zap size={20} />
              </div>
              <div>
                <div className="text-xs text-emerald-600 font-medium uppercase tracking-wider">Progression & Bonus</div>
                <div className="text-lg font-bold text-emerald-900">{progBonusCount} cartes <span className="text-xs font-normal text-emerald-700">(10 Prog. + 3 Bonus)</span></div>
              </div>
            </div>

            <div className="bg-fuchsia-50 border border-fuchsia-200 rounded-xl p-3 flex items-center gap-3">
              <div className="p-2 bg-fuchsia-100 text-fuchsia-700 rounded-lg">
                <ShieldAlert size={20} />
              </div>
              <div>
                <div className="text-xs text-fuchsia-600 font-medium uppercase tracking-wider">Spéciales & Jokers</div>
                <div className="text-lg font-bold text-fuchsia-900">{specialJokerCount} cartes <span className="text-xs font-normal text-fuchsia-700">(4 Spé. + 2 Jokers)</span></div>
              </div>
            </div>
          </div>

          {showIframeWarning && (
            <div className="mb-8 bg-amber-50 border border-amber-200 p-5 rounded-xl text-amber-900 flex items-start gap-4">
              <Info className="shrink-0 mt-0.5 text-amber-600" size={24} />
              <div>
                <h3 className="font-bold text-lg">Impression bloquée dans l'aperçu</h3>
                <p className="text-sm mt-1 text-amber-800">
                  Le système de sécurité de cet aperçu bloque la boîte de dialogue d'impression. 
                  Pour imprimer ou sauvegarder vos cartes en PDF, vous devez <strong>ouvrir cette application dans un nouvel onglet</strong>. 
                  Cliquez sur l'icône <span className="inline-block px-1.5 py-0.5 bg-amber-100 rounded text-amber-900 border border-amber-200 font-mono text-xs">Ouvrir dans un nouvel onglet</span> en haut à droite de cet écran, puis réessayez de cliquer sur "Imprimer / PDF".
                </p>
                <button 
                  onClick={() => setShowIframeWarning(false)}
                  className="mt-4 text-sm font-semibold bg-amber-200 text-amber-900 px-4 py-2 rounded-lg hover:bg-amber-300 transition-colors"
                >
                  J'ai compris
                </button>
              </div>
            </div>
          )}

          {showRules && (
            <div className="mb-8 bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">Règles du Jeu & Équilibrage du Deck (12 Joueurs)</h2>
              <div className="prose prose-sm max-w-none text-neutral-700 space-y-4">
                
                <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                  <h3 className="font-bold text-indigo-950 text-base mb-1">⚖️ Équilibrage 48 cartes : 4 cartes par joueur pour 12 joueurs</h3>
                  <div className="text-indigo-900 text-sm space-y-1 mt-2">
                    <p>Ce paquet a été calibré avec précision pour <strong>12 joueurs</strong> (4 cartes chacun, distribution intégrale au départ) :</p>
                    <ul className="list-disc pl-5 space-y-0.5 mt-1">
                      <li><strong>16 Attaques (33,3%) :</strong> 5 Blocages, 5 Ralentissements, 2 Temps réduit, 4 Reculs forcés.</li>
                      <li><strong>13 Réactions (Défenses & Contres) :</strong> 5 Boucliers, 3 Immunités, 3 Contre-attaques, 2 Esquives.</li>
                      <li><strong>13 Progression & Bonus :</strong> 4 Accélérations, 3 Rebonds, 3 Doubles dés, 3 Prolongations (+15 s).</li>
                      <li><strong>6 Spéciales & Jokers :</strong> 2 Échanges de place, 2 Vols de carte, 2 Jokers polyvalents.</li>
                    </ul>
                  </div>
                </div>

                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h3 className="font-bold text-red-950 text-base mb-1">⚡ Règle Importante : Anti-réaction en chaîne</h3>
                  <p className="text-red-900 text-sm">
                    <strong>Une seule carte de réaction peut être jouée par joueur contre une même attaque.</strong> Si une <em>Contre-attaque</em> renvoie l'attaque à son auteur d'origine, celui-ci peut jouer une carte de défense (Bouclier ou Immunité), mais <strong>il ne peut pas renvoyer à nouveau l'attaque avec une autre Contre-attaque</strong>. Ainsi, les joueurs ne passent pas de longues minutes à enchaîner les cartes au lieu de pratiquer leur italien.
                  </p>
                </div>

                <p><strong>Concept :</strong> Un seul paquet partagé par les six plateaux. Toutes les 48 cartes sont distribuées au début (4 par joueur pour 12 participants). Aucune pioche pendant la partie : chaque joueur doit gérer stratégiquement sa main tout au long du parcours.</p>

                <h3 className="font-bold text-neutral-900 mt-4 mb-2">Mise en place et tour de jeu</h3>
                <ol className="list-decimal pl-5 space-y-1.5">
                  <li><strong>Distribution :</strong> Mélanger les 48 cartes et en distribuer exactement 4 à chaque joueur (pour 12 joueurs). Pour un effectif différent, distribuer toutes les cartes aussi équitablement que possible.</li>
                  <li><strong>Main secrète :</strong> Garder sa main secrète. Il n'y a pas de pioche. Les cartes jouées vont dans une défausse commune et ne reviennent pas en jeu.</li>
                  <li><strong>Tour actif :</strong> À son tour, le joueur lance les dés et applique le déplacement normal, puis réalise l'exercice de la case.</li>
                  <li><strong>Limite de cartes :</strong> Un joueur peut jouer au maximum une carte pendant son tour. Les cartes de réaction (défenses/contres) peuvent être jouées hors tour lorsqu'une attaque le cible.</li>
                  <li><strong>Priorité linguistique :</strong> Les cartes ne dispensent jamais de parler italien. Les déplacements provoqués par une carte ne déclenchent pas d'exercice ni d'effet de case, sauf mention contraire.</li>
                  <li><strong>Respect des limites du plateau :</strong> Une carte ne peut pas cibler un joueur qui a terminé. Les effets ne peuvent pas faire reculer un joueur au-delà du départ ni contourner les règles d'arrivée du plateau.</li>
                  <li><strong>Résolution des conflits :</strong> En cas de conflit, résoudre dans cet ordre : attaque annoncée → réaction défensive → effet restant → défausse.</li>
                </ol>
              </div>
            </div>
          )}

          {/* Gestionnaire d'icônes par famille */}
          <FamilyIconManager
            familyIcons={familyIcons}
            onUpdateFamilyIcon={handleUpdateFamilyIcon}
            cardCounts={cardCounts}
            language={language}
          />

          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-neutral-800">
                {language === 'it' ? 'Modelli delle Carte (48)' : 'Éditeur de modèles (48)'}
              </h2>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold border ${
                language === 'it' 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                  : 'bg-indigo-50 text-indigo-800 border-indigo-200'
              }`}>
                {language === 'it' ? '🇮🇹 Versione Italiana attiva' : '🇫🇷 Version Française active'}
              </span>
            </div>
            <button
              onClick={handleAddCard}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
            >
              <Plus size={16} />
              {language === 'it' ? 'Aggiungi una carta' : 'Ajouter une carte'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {cards.map(card => (
              <CardEditor
                key={card.id}
                card={card}
                onChange={handleUpdateCard}
                onDelete={handleDeleteCard}
                onUpdateFamilyIcon={handleUpdateFamilyIcon}
                language={language}
              />
            ))}
          </div>
        </main>
      </div>

      {/* --- Print Layout (Hidden on screen) --- */}
      <div className="print-only hidden">
        <div className="print-grid">
          {printDeck.map((card, index) => (
            <PrintableCard 
              key={`${card.id}-${index}`} 
              card={card} 
              printBacks={printSide === 'back'} 
              language={language}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
