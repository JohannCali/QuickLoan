/**
 * Modèle de scoring de crédit hybride pour protocole DeFi
 * Combine analyse off-chain (90%) et on-chain (10%)
 */

/**
 * Interface définissant les paramètres de scoring off-chain
 */
export interface OffChainParams {
  // Revenu mensuel net (après impôts et charges fixes)
  revenuMensuelNet: number;
  
  // Charges mensuelles (dettes existantes, loyers, crédit en cours, etc.)
  chargesMensuelles: number;
  
  // Ancienneté d'emploi (années en poste stable)
  ancienneteEmploi: number;
  
  // Complétude des documents bancaires (true si tous les docs requis sont fournis)
  documentsComplets: boolean;
}

/**
 * Interface définissant les paramètres de scoring on-chain
 */
export interface OnChainParams {
  // Âge du portefeuille crypto (en années)
  walletAge: number;
  
  // Nombre de transactions enregistrées
  txCount: number;
  
  // Niveau de liquidité en stablecoins
  liquiditeStablecoin?: number;
  
  // Diversité d'actifs
  diversiteActifs?: number;
}

/**
 * Interface définissant les paramètres de fidélité/historique
 */
export interface FideliteParams {
  // Ancienneté sur le protocole en années
  ancienneteProtocole: number;
  
  // Nombre total de prêts
  nombrePrets: number;
  
  // Nombre de prêts remboursés à temps
  pretsRembourses: number;
  
  // Retards ou défauts passés
  nombreRetards: number;
}

/**
 * Résultat du calcul de scoring
 */
export interface ScoringResult {
  // Score total (0-100)
  scoreTotal: number;
  
  // Score off-chain (0-100)
  scoreOffChain: number;
  
  // Score on-chain (0-100)
  scoreOnChain: number;
  
  // Pourcentage du revenu autorisé (0.15 - 0.25)
  pourcentageRevenu: number;
  
  // Bonus/malus de fidélité (ex: +0.05 pour +5%)
  bonusMalus: number;
  
  // Montant brut du prêt (avant application du plafond et du bonus/malus)
  montantBrutPret: number;
  
  // Montant final du prêt (après plafond et bonus/malus)
  montantFinalPret: number;
  
  // Mensualité maximale
  mensualiteMax: number;
  
  // Durée du prêt en mois
  dureePretMois: number;
  
  // Facteurs favorables (pour l'explication à l'utilisateur)
  facteursFavorables: string[];
  
  // Facteurs défavorables (pour l'explication à l'utilisateur)
  facteursDefavorables: string[];
  
  // Recommandation générale
  recommendation: string;
}

/**
 * Configuration du modèle de scoring
 */
const CONFIG = {
  // Revenu de référence (pour normalisation)
  REVENU_REFERENCE: 10000,
  
  // Plafond d'ancienneté (en années)
  PLAFOND_ANCIENNETE: 10,
  
  // Plafond du nombre de transactions
  PLAFOND_TX_COUNT: 1000,
  
  // Plafond d'âge du wallet (en années)
  PLAFOND_WALLET_AGE: 3,
  
  // Pondération off-chain
  POIDS_OFF_CHAIN: 0.9,
  
  // Pondération on-chain
  POIDS_ON_CHAIN: 0.1,
  
  // Pourcentage minimum du revenu
  POURCENTAGE_MIN: 0.15,
  
  // Range de pourcentage supplémentaire
  POURCENTAGE_RANGE: 0.10,
  
  // Durée du prêt par défaut (en mois)
  DUREE_PRET_MOIS: 60,
  
  // Plafond du prêt en dollars
  PLAFOND_PRET: 100000,
  
  // Bonus par année d'ancienneté sur le protocole
  BONUS_ANCIENNETE_PAR_AN: 0.01,
  
  // Plafond du bonus d'ancienneté
  PLAFOND_BONUS_ANCIENNETE: 0.05,
  
  // Bonus pour remboursements à l'heure
  BONUS_REMBOURSEMENTS: 0.05,
  
  // Bonus pour nombre de prêts significatif
  BONUS_NOMBRE_PRETS: 0.05,
  
  // Malus par retard
  MALUS_PAR_RETARD: 0.05
};

/**
 * Calcule le score off-chain (0-100)
 */
function calculerScoreOffChain(params: OffChainParams): {
  score: number;
  scoreRevenu: number;
  scoreCharges: number;
  scoreEmploi: number;
  scoreDocs: number;
} {
  // Score Revenu (0-40 pts)
  const scoreRevenu = 40 * Math.min(params.revenuMensuelNet / CONFIG.REVENU_REFERENCE, 1);
  
  // Score Charges (0-30 pts) basé sur le ratio charges/revenu
  const ratioCharges = params.chargesMensuelles / params.revenuMensuelNet;
  const scoreCharges = 30 * Math.max(1 - ratioCharges, 0);
  
  // Score Emploi (0-20 pts) basé sur l'ancienneté
  const scoreEmploi = 20 * Math.min(params.ancienneteEmploi / CONFIG.PLAFOND_ANCIENNETE, 1);
  
  // Score Documents (0-10 pts) selon la complétude
  const scoreDocs = params.documentsComplets ? 10 : 0;
  
  // Score total off-chain
  const score = scoreRevenu + scoreCharges + scoreEmploi + scoreDocs;
  
  return {
    score,
    scoreRevenu,
    scoreCharges,
    scoreEmploi,
    scoreDocs
  };
}

/**
 * Calcule le score on-chain (0-100)
 */
function calculerScoreOnChain(params: OnChainParams): {
  score: number;
  scoreTx: number;
  scoreAge: number;
} {
  // Score Transactions (0-50 pts)
  const scoreTx = 50 * Math.min(params.txCount / CONFIG.PLAFOND_TX_COUNT, 1);
  
  // Score Âge du wallet (0-50 pts)
  const scoreAge = 50 * Math.min(params.walletAge / CONFIG.PLAFOND_WALLET_AGE, 1);
  
  // Score total on-chain
  const score = scoreTx + scoreAge;
  
  return {
    score,
    scoreTx,
    scoreAge
  };
}

/**
 * Calcule le facteur de bonus/malus de fidélité
 */
function calculerBonusMalusFidelite(params: FideliteParams): {
  facteur: number;
  details: {
    bonusAnciennete: number;
    bonusRemboursements: number;
    bonusPrets: number;
    malusRetards: number;
  };
} {
  // Bonus d'ancienneté sur le protocole
  const bonusAnciennete = Math.min(
    params.ancienneteProtocole * CONFIG.BONUS_ANCIENNETE_PAR_AN,
    CONFIG.PLAFOND_BONUS_ANCIENNETE
  );
  
  // Bonus de remboursements à l'heure
  let bonusRemboursements = 0;
  if (params.nombrePrets > 0 && params.pretsRembourses === params.nombrePrets) {
    bonusRemboursements = CONFIG.BONUS_REMBOURSEMENTS;
  }
  
  // Bonus pour nombre de prêts significatif
  const bonusPrets = params.nombrePrets >= 3 ? CONFIG.BONUS_NOMBRE_PRETS : 0;
  
  // Malus pour retards
  const malusRetards = params.nombreRetards * CONFIG.MALUS_PAR_RETARD;
  
  // Facteur total
  const facteur = bonusAnciennete + bonusRemboursements + bonusPrets - malusRetards;
  
  return {
    facteur,
    details: {
      bonusAnciennete,
      bonusRemboursements,
      bonusPrets,
      malusRetards
    }
  };
}

/**
 * Génère les facteurs favorables et défavorables pour l'explication
 */
function genererFacteurs(
  offChainParams: OffChainParams,
  onChainParams: OnChainParams,
  fideliteParams: FideliteParams,
  bonusMalusDetails: any
): { favorables: string[]; defavorables: string[] } {
  const favorables: string[] = [];
  const defavorables: string[] = [];
  
  // Facteurs liés au revenu
  if (offChainParams.revenuMensuelNet >= CONFIG.REVENU_REFERENCE * 0.8) {
    favorables.push("Revenu mensuel élevé");
  } else if (offChainParams.revenuMensuelNet <= CONFIG.REVENU_REFERENCE * 0.3) {
    defavorables.push("Revenu mensuel limité");
  }
  
  // Facteurs liés aux charges
  const ratioCharges = offChainParams.chargesMensuelles / offChainParams.revenuMensuelNet;
  if (ratioCharges <= 0.2) {
    favorables.push("Faible taux d'endettement");
  } else if (ratioCharges >= 0.5) {
    defavorables.push("Taux d'endettement élevé");
  }
  
  // Facteurs liés à l'emploi
  if (offChainParams.ancienneteEmploi >= 3) {
    favorables.push("Stabilité professionnelle");
  } else if (offChainParams.ancienneteEmploi < 1) {
    defavorables.push("Ancienneté professionnelle faible");
  }
  
  // Facteurs liés aux documents
  if (offChainParams.documentsComplets) {
    favorables.push("Dossier de documents complet");
  } else {
    defavorables.push("Documents incomplets");
  }
  
  // Facteurs on-chain
  if (onChainParams.walletAge >= 2) {
    favorables.push("Portefeuille crypto mature");
  }
  if (onChainParams.txCount >= 500) {
    favorables.push("Activité blockchain significative");
  }
  
  // Facteurs de fidélité
  if (fideliteParams.ancienneteProtocole >= 1) {
    favorables.push(`${fideliteParams.ancienneteProtocole} an(s) d'ancienneté sur le protocole`);
  }
  if (fideliteParams.nombrePrets >= 3 && fideliteParams.pretsRembourses === fideliteParams.nombrePrets) {
    favorables.push("Historique de remboursement exemplaire");
  }
  if (fideliteParams.nombreRetards > 0) {
    defavorables.push(`${fideliteParams.nombreRetards} retard(s) de paiement dans l'historique`);
  }
  
  return { favorables, defavorables };
}

/**
 * Fonction principale pour calculer le score de crédit et le montant du prêt
 */
export function calculerScoreCredit(
  offChainParams: OffChainParams,
  onChainParams: OnChainParams,
  fideliteParams: FideliteParams,
  dureePretMois: number = CONFIG.DUREE_PRET_MOIS
): ScoringResult {
  // Calculer le score off-chain
  const scoreOffChainResult = calculerScoreOffChain(offChainParams);
  
  // Calculer le score on-chain
  const scoreOnChainResult = calculerScoreOnChain(onChainParams);
  
  // Calculer le score total pondéré
  const scoreTotal = 
    CONFIG.POIDS_OFF_CHAIN * scoreOffChainResult.score +
    CONFIG.POIDS_ON_CHAIN * scoreOnChainResult.score;
  
  // Déterminer le pourcentage du revenu autorisé
  const pourcentageRevenu = 
    CONFIG.POURCENTAGE_MIN + 
    CONFIG.POURCENTAGE_RANGE * (scoreTotal / 100);
  
  // Calculer le paiement mensuel maximum
  const mensualiteMax = pourcentageRevenu * offChainParams.revenuMensuelNet;
  
  // Calculer le montant brut du prêt
  const montantBrutPret = mensualiteMax * dureePretMois;
  
  // Appliquer le plafond
  const montantPretPlafonne = Math.min(montantBrutPret, CONFIG.PLAFOND_PRET);
  
  // Calculer le bonus/malus de fidélité
  const bonusMalusResult = calculerBonusMalusFidelite(fideliteParams);
  
  // Appliquer le bonus/malus au montant plafonné
  const montantFinalPret = Math.min(
    montantPretPlafonne * (1 + bonusMalusResult.facteur),
    CONFIG.PLAFOND_PRET
  );
  
  // Générer les facteurs pour l'explication
  const facteurs = genererFacteurs(
    offChainParams,
    onChainParams,
    fideliteParams,
    bonusMalusResult.details
  );
  
  // Générer une recommandation
  let recommendation = "";
  if (scoreTotal >= 75) {
    recommendation = "Profil solide: prêt recommandé aux conditions standards.";
  } else if (scoreTotal >= 50) {
    recommendation = "Profil satisfaisant: prêt recommandé avec suivi régulier.";
  } else if (scoreTotal >= 30) {
    recommendation = "Profil moyen: prêt possible avec garanties supplémentaires recommandées.";
  } else {
    recommendation = "Profil à risque: prêt limité ou déconseillé sans garanties substantielles.";
  }
  
  // Si le taux d'endettement est déjà élevé, ajouter un avertissement
  const ratioCharges = offChainParams.chargesMensuelles / offChainParams.revenuMensuelNet;
  if (ratioCharges >= 0.4) {
    recommendation += " Attention au taux d'endettement déjà élevé.";
  }
  
  // Si la capacité d'emprunt est limitée par le plafond, le mentionner
  if (montantBrutPret > CONFIG.PLAFOND_PRET) {
    recommendation += ` Le montant est limité au plafond de ${CONFIG.PLAFOND_PRET}$.`;
  }
  
  return {
    scoreTotal,
    scoreOffChain: scoreOffChainResult.score,
    scoreOnChain: scoreOnChainResult.score,
    pourcentageRevenu,
    bonusMalus: bonusMalusResult.facteur,
    montantBrutPret,
    montantFinalPret,
    mensualiteMax,
    dureePretMois,
    facteursFavorables: facteurs.favorables,
    facteursDefavorables: facteurs.defavorables,
    recommendation
  };
}

/**
 * Converti les données extraites des documents en paramètres pour le scoring
 */
export function convertirDonneesDocumentsPourScoring(documentData: any): {
  offChainParams: OffChainParams,
  estimationOnChain: OnChainParams,
  estimationFidelite: FideliteParams
} {
  // Paramètres off-chain basés sur les documents
  const offChainParams: OffChainParams = {
    // Revenu mensuel net (du bulletin de salaire)
    revenuMensuelNet: documentData.bulletin.salaireNet || 0,
    
    // Charges mensuelles (estimation à partir des données)
    chargesMensuelles: documentData.bulletin.chargesSalariales || 0,
    
    // Ancienneté d'emploi (calculée à partir de la date d'ancienneté)
    ancienneteEmploi: calculerAnciennete(documentData.bulletin.anciennete),
    
    // Documents complets (nous avons les deux documents nécessaires)
    documentsComplets: true
  };
  
  // Paramètres on-chain (valeurs par défaut simulées pour la démonstration)
  const estimationOnChain: OnChainParams = {
    walletAge: 1.5,  // 1.5 ans par défaut
    txCount: 250     // 250 transactions par défaut
  };
  
  // Paramètres de fidélité (valeurs par défaut simulées pour la démonstration)
  const estimationFidelite: FideliteParams = {
    ancienneteProtocole: 0.5,  // 6 mois par défaut
    nombrePrets: 1,           // 1 prêt par défaut
    pretsRembourses: 1,       // 1 prêt remboursé par défaut
    nombreRetards: 0          // Aucun retard par défaut
  };
  
  return {
    offChainParams,
    estimationOnChain,
    estimationFidelite
  };
}

/**
 * Calcule l'ancienneté en années à partir d'une date au format string ou d'une durée au format "X ans Y mois"
 */
function calculerAnciennete(ancienneteStr: string): number {
  // Si le format est une date (ex: "22/01/2024")
  if (ancienneteStr.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
    const [jour, mois, annee] = ancienneteStr.split('/').map(Number);
    const dateAnciennete = new Date(annee, mois - 1, jour);
    const maintenant = new Date();
    
    // Calculer la différence en années
    const diffAnnees = (maintenant.getTime() - dateAnciennete.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    return Math.max(0, diffAnnees);
  }
  
  // Si le format est "X ans Y mois"
  const matchAnneesMois = ancienneteStr.match(/(\d+)\s+ans?\s+(\d+)\s+mois?/i);
  if (matchAnneesMois) {
    const annees = parseInt(matchAnneesMois[1]);
    const mois = parseInt(matchAnneesMois[2]);
    return annees + mois / 12;
  }
  
  // Si le format est "X ans"
  const matchAnnees = ancienneteStr.match(/(\d+)\s+ans?/i);
  if (matchAnnees) {
    return parseInt(matchAnnees[1]);
  }
  
  // Si le format est "X mois"
  const matchMois = ancienneteStr.match(/(\d+)\s+mois?/i);
  if (matchMois) {
    return parseInt(matchMois[1]) / 12;
  }
  
  // Par défaut, retourner 0
  return 0;
} 