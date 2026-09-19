import { CardData, Family, Language } from './types';

export const FAMILY_NAMES_IT: Record<Family, string> = {
  Attaque: 'Attacco',
  Défense: 'Difesa',
  Progression: 'Progressione',
  Bonus: 'Bonus',
  Contre: 'Contrattacco',
  Spéciale: 'Speciale',
  Joker: 'Joker',
};

export const FAMILY_NAMES_FR: Record<Family, string> = {
  Attaque: 'Attaque',
  Défense: 'Défense',
  Progression: 'Progression',
  Bonus: 'Bonus',
  Contre: 'Contre',
  Spéciale: 'Spéciale',
  Joker: 'Joker',
};

export const INITIAL_CARDS: CardData[] = [
  {
    id: '1',
    name: 'BLOCAGE',
    nameIt: 'BLOCCO',
    family: 'Attaque',
    quantity: 5,
    effect: 'Choisis un adversaire : il perd son prochain déplacement. Il lance les dés, mais reste sur sa case. Annulable par une défense.',
    effectIt: 'Scegli un avversario: perde il suo prossimo spostamento. Lancia i dadi, ma resta sulla sua casella. Annullabile con una difesa.',
  },
  {
    id: '2',
    name: 'RALENTISSEMENT',
    nameIt: 'RALLENTAMENTO',
    family: 'Attaque',
    quantity: 5,
    effect: 'Choisis un adversaire : à son prochain déplacement, il avance de 2 cases de moins (minimum 0). Annulable par une défense.',
    effectIt: 'Scegli un avversario: al suo prossimo spostamento, avanza di 2 caselle in meno (minimo 0). Annullabile con una difesa.',
  },
  {
    id: '3',
    name: 'TEMPS RÉDUIT',
    nameIt: 'TEMPO RIDOTTO',
    family: 'Attaque',
    quantity: 2,
    effect: 'Choisis un adversaire : pour son prochain exercice d’italien, son temps de parole est réduit de 15 secondes. Annulable par une défense.',
    effectIt: "Scegli un avversario: per il suo prossimo esercizio d'italiano, il suo tempo di parola è ridotto di 15 secondi. Annullabile con una difesa.",
  },
  {
    id: '4',
    name: 'RECUL FORCÉ',
    nameIt: 'RETROCESSIONE FORZATA',
    family: 'Attaque',
    quantity: 4,
    effect: 'Choisis un adversaire : fais-le reculer de 2 cases (sans dépasser la case Départ). Aucun effet de case n’est déclenché. Annulable par une défense.',
    effectIt: 'Scegli un avversario: fallo indietreggiare di 2 caselle (senza superare la casella di Partenza). Nessun effetto di casella viene attivato. Annullabile con una difesa.',
  },
  {
    id: '5',
    name: 'BOUCLIER',
    nameIt: 'SCUDO',
    family: 'Défense',
    quantity: 5,
    effect: 'En réaction, annule une carte Attaque jouée contre toi (Blocage, Ralentissement, Recul forcé, Temps réduit). Défausse les deux cartes.',
    effectIt: 'In reazione, annulla una carta Attacco giocata contro di te (Blocco, Rallentamento, Retrocessione forzata, Tempo ridotto). Scarta entrambe le carte.',
  },
  {
    id: '6',
    name: 'IMMUNITÉ',
    nameIt: 'IMMUNITÀ',
    family: 'Défense',
    quantity: 3,
    effect: 'En réaction, annule l’attaque reçue et te protège de toute attaque jusqu’au début de ton prochain tour. Défausse cette carte.',
    effectIt: "In reazione, annulla l'attacco ricevuto e ti protegge da qualsiasi attacco fino all'inizio del tuo prossimo turno. Scarta questa carta.",
  },
  {
    id: '7',
    name: 'ACCÉLÉRATION',
    nameIt: 'ACCELERAZIONE',
    family: 'Progression',
    quantity: 4,
    effect: 'Après ton déplacement normal, avance de 3 cases supplémentaires. Respecte la règle d’arrivée.',
    effectIt: "Dopo il tuo spostamento normale, avanza di 3 caselle supplementari. Rispetta la regola d'arrivo.",
  },
  {
    id: '8',
    name: 'REBOND',
    nameIt: 'RIMBALZO',
    family: 'Progression',
    quantity: 3,
    effect: 'Après ton déplacement normal, relance les dés et avance du résultat. Ce déplacement ne déclenche pas d’exercice supplémentaire.',
    effectIt: 'Dopo il tuo spostamento normale, rilancia i dadi e avanza del risultato. Questo spostamento non attiva alcun esercizio supplementare.',
  },
  {
    id: '9',
    name: 'DOUBLE DÉ',
    nameIt: 'DOPPIO DADO',
    family: 'Progression',
    quantity: 3,
    effect: 'Avant ton déplacement, lance les dés et double le résultat pour avancer. Tu réalises l’exercice normal de la case d’arrivée.',
    effectIt: "Prima del tuo spostamento, lancia i dadi e raddoppia il risultato per avanzare. Esegui il normale esercizio della casella d'arrivo.",
  },
  {
    id: '10',
    name: 'PROLONGATION (+15 S)',
    nameIt: 'PROLUNGAMENTO (+15 S)',
    family: 'Bonus',
    quantity: 3,
    effect: 'Pendant ton tour, obtiens 15 secondes supplémentaires pour réaliser ton exercice de prise de parole en italien.',
    effectIt: 'Durante il tuo turno, ottieni 15 secondi supplementari per svolgere il tuo esercizio di espressione orale in italiano.',
  },
  {
    id: '11',
    name: 'CONTRE-ATTAQUE',
    nameIt: 'CONTROATTACCO',
    family: 'Contre',
    quantity: 3,
    effect: 'En réaction, annule une attaque et renvoie son effet à son auteur. Celui-ci peut jouer une défense en réaction.',
    effectIt: "In reazione, annulla un attacco e rimanda il suo effetto all'autore. Quest'ultimo può giocare una difesa in reazione.",
  },
  {
    id: '12',
    name: 'ESQUIVE',
    nameIt: 'SCHIVATA',
    family: 'Contre',
    quantity: 2,
    effect: 'En réaction, annule une attaque contre toi, puis avance d’une case. Aucun effet de case n’est déclenché.',
    effectIt: 'In reazione, annulla un attacco contro di te, poi avanza di una casella. Nessun effetto di casella viene attivato.',
  },
  {
    id: '13',
    name: 'ÉCHANGE',
    nameIt: 'SCAMBIO',
    family: 'Spéciale',
    quantity: 2,
    effect: 'Pendant ton tour, échange ta position avec celle d’un adversaire non arrivé. Aucun effet de case n’est déclenché.',
    effectIt: 'Durante il tuo turno, scambia la tua posizione con quella di un avversario non ancora arrivato. Nessun effetto di casella viene attivato.',
  },
  {
    id: '14',
    name: 'VOL DE CARTE',
    nameIt: 'FURTO DI CARTA',
    family: 'Spéciale',
    quantity: 2,
    effect: 'Pendant ton tour, prends au hasard une carte de la main d’un adversaire. Si sa main est vide, l’effet est perdu.',
    effectIt: "Durante il tuo turno, prendi a caso una carta dalla mano di un avversario. Se la sua mano è vuota, l'effetto è perso.",
  },
  {
    id: '15',
    name: 'JOKER POLYVALENT',
    nameIt: 'JOKER POLIVALENTE',
    family: 'Joker',
    quantity: 2,
    effect: 'Choisis un seul effet : annuler une attaque qui te cible ; avancer de 2 cases ; ou obtenir +15 s de temps de parole.',
    effectIt: 'Scegli un solo effetto: annullare un attacco che ti bersaglia; avanzare di 2 caselle; oppure ottenere +15 s di tempo di parola.',
  },
];

export const getCardDisplayTitle = (card: CardData, lang: Language): string => {
  if (lang === 'it') {
    return card.nameIt || card.name;
  }
  return card.name;
};

export const getCardDisplayEffect = (card: CardData, lang: Language): string => {
  if (lang === 'it') {
    return card.effectIt || card.effect;
  }
  return card.effect;
};

export const getFamilyDisplayName = (family: Family, lang: Language): string => {
  if (lang === 'it') {
    return FAMILY_NAMES_IT[family] || family;
  }
  return FAMILY_NAMES_FR[family] || family;
};
