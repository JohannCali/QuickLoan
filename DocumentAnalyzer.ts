import { z } from 'zod';
import { generateText } from "ai";
import { openai_model } from "./models/openai_model";
import * as fs from 'fs';
import * as path from 'path';
import pdfParse from 'pdf-parse';
import { calculerScoreCredit, convertirDonneesDocumentsPourScoring, ScoringResult } from './CreditScoring';

// Type pour les données du bulletin de paie
export interface PayslipData {
  salaireBrut: number;
  salaireNet: number;
  chargesSalariales: number;
  typeContrat: string;
  anciennete: string;
  employeur: string;
  primes: number;
  [key: string]: any;
}

// Type pour les données de déclaration fiscale
export interface TaxReturnData {
  revenuAnnuel: number;
  impotRevenu: number;
  revenuFiscalReference: number;
  nombreParts: number;
  situationFamiliale: string;
  autresRevenus: number;
  [key: string]: any;
}

// Type pour les données combinées
export interface CombinedData {
  bulletin: PayslipData;
  impots: TaxReturnData;
  [key: string]: any;
}

/**
 * Analyse un bulletin de salaire via PDF
 */
export async function analyzePayslip(filePath: string): Promise<PayslipData> {
  try {
    console.log(`Analyse du bulletin de salaire: ${filePath}`);
    
    // Lire le fichier PDF
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    const textContent = pdfData.text;
    
    console.log("Contenu extrait du bulletin de salaire, analyse en cours...");
    
    // Analyser le texte avec l'IA
    const { text } = await generateText({
      model: openai_model,
      system: `Tu es un expert en analyse de bulletins de salaire.
Extrais toutes les informations pertinentes du bulletin de salaire fourni.
Réponds uniquement au format JSON structuré comme suit:
{
  "salaireBrut": 0000.00,
  "salaireNet": 0000.00,
  "chargesSalariales": 000.00,
  "typeContrat": "CDI/CDD/autre",
  "anciennete": "X ans Y mois" ou "JJ/MM/AAAA",
  "employeur": "Nom de l'employeur",
  "primes": 000.00
}`,
      prompt: `Voici le contenu d'un bulletin de salaire à analyser:\n\n${textContent}\n\nExtrais-en les informations clés au format demandé.`
    });
    
    // Nettoyer et parser le résultat
    const cleanedJson = cleanJsonResponse(text);
    const payslipData = JSON.parse(cleanedJson) as PayslipData;
    
    console.log("Analyse du bulletin de salaire terminée:", payslipData);
    
    // Si des données essentielles sont manquantes, utiliser des valeurs par défaut
    if (!payslipData.salaireBrut) payslipData.salaireBrut = 3500;
    if (!payslipData.salaireNet) payslipData.salaireNet = 2800;
    if (!payslipData.chargesSalariales) payslipData.chargesSalariales = 700;
    if (!payslipData.typeContrat) payslipData.typeContrat = "CDI";
    if (!payslipData.anciennete) payslipData.anciennete = "3 ans";
    if (!payslipData.employeur) payslipData.employeur = "Entreprise";
    if (!payslipData.primes) payslipData.primes = 0;
    
    return payslipData;
  } catch (error) {
    console.error("Erreur lors de l'analyse du bulletin de salaire:", error);
    
    // En cas d'erreur, retourner des données par défaut
    return {
      salaireBrut: 3500,
      salaireNet: 2800,
      chargesSalariales: 700,
      typeContrat: "CDI",
      anciennete: "3 ans",
      employeur: "Entreprise",
      primes: 0
    };
  }
}

/**
 * Analyse une déclaration fiscale via PDF
 */
export async function analyzeTaxReturn(filePath: string): Promise<TaxReturnData> {
  try {
    console.log(`Analyse de la déclaration d'impôts: ${filePath}`);
    
    // Lire le fichier PDF
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    const textContent = pdfData.text;
    
    console.log("Contenu extrait de la déclaration d'impôts, analyse en cours...");
    
    // Analyser le texte avec l'IA
    const { text } = await generateText({
      model: openai_model,
      system: `Tu es un expert en analyse de déclarations d'impôts.
Extrais toutes les informations pertinentes de la déclaration d'impôts fournie.
Réponds uniquement au format JSON structuré comme suit:
{
  "revenuAnnuel": 00000.00,
  "impotRevenu": 0000.00,
  "revenuFiscalReference": 00000.00,
  "nombreParts": 0.0,
  "situationFamiliale": "célibataire/marié/pacsé/etc.",
  "autresRevenus": 0000.00
}`,
      prompt: `Voici le contenu d'une déclaration d'impôts à analyser:\n\n${textContent}\n\nExtrais-en les informations clés au format demandé.`
    });
    
    // Nettoyer et parser le résultat
    const cleanedJson = cleanJsonResponse(text);
    const taxReturnData = JSON.parse(cleanedJson) as TaxReturnData;
    
    console.log("Analyse de la déclaration d'impôts terminée:", taxReturnData);
    
    // Si des données essentielles sont manquantes, utiliser des valeurs par défaut
    if (!taxReturnData.revenuAnnuel) taxReturnData.revenuAnnuel = 35000;
    if (!taxReturnData.impotRevenu) taxReturnData.impotRevenu = 2800;
    if (!taxReturnData.revenuFiscalReference) taxReturnData.revenuFiscalReference = 33000;
    if (!taxReturnData.nombreParts) taxReturnData.nombreParts = 1;
    if (!taxReturnData.situationFamiliale) taxReturnData.situationFamiliale = "célibataire";
    if (!taxReturnData.autresRevenus) taxReturnData.autresRevenus = 0;
    
    return taxReturnData;
  } catch (error) {
    console.error("Erreur lors de l'analyse de la déclaration d'impôts:", error);
    
    // En cas d'erreur, retourner des données par défaut
    return {
      revenuAnnuel: 35000,
      impotRevenu: 2800,
      revenuFiscalReference: 33000,
      nombreParts: 1,
      situationFamiliale: "célibataire",
      autresRevenus: 0
    };
  }
}

/**
 * Analyse l'ensemble des documents financiers
 */
export async function analyzeFinancialDocuments(payslipPath: string, taxReturnPath: string): Promise<CombinedData> {
  try {
    console.log("Analyse combinée des documents financiers...");
    
    // Vérifier si les fichiers existent
    const payslipExists = fs.existsSync(payslipPath);
    const taxReturnExists = fs.existsSync(taxReturnPath);
    
    if (!payslipExists) {
      console.warn(`Le bulletin de salaire n'existe pas à l'emplacement: ${payslipPath}`);
    }
    
    if (!taxReturnExists) {
      console.warn(`La déclaration d'impôts n'existe pas à l'emplacement: ${taxReturnPath}`);
    }
    
    // Analyser chaque document s'il existe
    const payslipData = payslipExists ? await analyzePayslip(payslipPath) : getDefaultPayslipData();
    const taxReturnData = taxReturnExists ? await analyzeTaxReturn(taxReturnPath) : getDefaultTaxReturnData();
    
    // Combiner les données
    const combinedData: CombinedData = {
      bulletin: payslipData,
      impots: taxReturnData
    };
    
    console.log("Analyse combinée terminée:", combinedData);
    
    return combinedData;
  } catch (error) {
    console.error("Erreur lors de l'analyse combinée des documents:", error);
    
    // En cas d'erreur, retourner des données par défaut
    return getDefaultCombinedData();
  }
}

/**
 * Obtient des données par défaut pour un bulletin de paie
 */
function getDefaultPayslipData(): PayslipData {
  return {
    salaireBrut: 3500,
    salaireNet: 2800,
    chargesSalariales: 700,
    typeContrat: "CDI",
    anciennete: "3 ans",
    employeur: "Entreprise",
    primes: 0
  };
}

/**
 * Obtient des données par défaut pour une déclaration d'impôts
 */
function getDefaultTaxReturnData(): TaxReturnData {
  return {
    revenuAnnuel: 35000,
    impotRevenu: 2800,
    revenuFiscalReference: 33000,
    nombreParts: 1,
    situationFamiliale: "célibataire",
    autresRevenus: 0
  };
}

/**
 * Obtient des données combinées par défaut
 */
function getDefaultCombinedData(): CombinedData {
  return {
    bulletin: getDefaultPayslipData(),
    impots: getDefaultTaxReturnData()
  };
}

/**
 * Nettoie une réponse JSON d'un LLM
 */
function cleanJsonResponse(text: string): string {
  // Enlever les backticks et l'indication json si présente
  let cleaned = text.replace(/```json\s*|\s*```/g, '');
  
  // Enlever les explications textuelles avant ou après le JSON
  const jsonStart = cleaned.indexOf('{');
  const jsonEnd = cleaned.lastIndexOf('}');
  
  if (jsonStart >= 0 && jsonEnd >= 0) {
    cleaned = cleaned.substring(jsonStart, jsonEnd + 1);
  }
  
  return cleaned;
}

/**
 * Utilise l'IA pour analyser la situation financière et calculer une capacité d'emprunt
 * @param combinedData Les données combinées des bulletins de salaire et déclarations d'impôts
 * @returns Analyse financière incluant capacité d'emprunt et recommandations
 */
export async function calculateLoanCapacity(combinedData: CombinedData): Promise<any> {
  try {
    console.log("Analyse de la capacité d'emprunt via le modèle de scoring DeFi...");
    
    // Convertir les données extraites en paramètres pour le scoring
    const { offChainParams, estimationOnChain, estimationFidelite } = convertirDonneesDocumentsPourScoring(combinedData);
    
    // Appliquer le modèle de scoring pour obtenir la capacité d'emprunt
    const resultatScoring: ScoringResult = calculerScoreCredit(
      offChainParams,
      estimationOnChain,
      estimationFidelite
    );
    
    console.log("Analyse par modèle de scoring:", JSON.stringify(resultatScoring, null, 2));
    
    // Créer l'objet de retour au format attendu par l'interface
    return {
      capaciteEmprunt: Math.round(resultatScoring.montantFinalPret),
      mensualiteMax: Math.round(resultatScoring.mensualiteMax),
      tauxEndettement: parseFloat((offChainParams.chargesMensuelles / offChainParams.revenuMensuelNet).toFixed(2)),
      dureeRecommandee: `${resultatScoring.dureePretMois / 12} ans`,
      facteursFavorables: resultatScoring.facteursFavorables,
      facteursDefavorables: resultatScoring.facteursDefavorables,
      recommendation: resultatScoring.recommendation,
      scoringDetails: {
        scoreTotal: parseFloat(resultatScoring.scoreTotal.toFixed(2)),
        scoreOffChain: parseFloat(resultatScoring.scoreOffChain.toFixed(2)),
        scoreOnChain: parseFloat(resultatScoring.scoreOnChain.toFixed(2)),
        pourcentageRevenu: parseFloat((resultatScoring.pourcentageRevenu * 100).toFixed(2)),
        bonusMalus: parseFloat((resultatScoring.bonusMalus * 100).toFixed(2)),
      }
    };
  } catch (error) {
    console.error("Erreur lors de l'analyse de la capacité d'emprunt:", error);
    
    // En cas d'erreur, utiliser l'IA comme fallback (méthode originale)
    console.log("Utilisation de l'IA comme fallback pour l'analyse...");
    return calculateLoanCapacityWithAI(combinedData);
  }
}

/**
 * Méthode originale utilisant l'IA pour calculer la capacité d'emprunt
 * Utilisée comme fallback en cas d'erreur avec le modèle de scoring
 */
async function calculateLoanCapacityWithAI(combinedData: CombinedData): Promise<any> {
  try {
    console.log("Analyse de la capacité d'emprunt par l'IA (fallback)...");
    
    // Formater les données pour l'IA
    const financialSummary = {
      bulletin: {
        salaireBrut: combinedData.bulletin.salaireBrut,
        salaireNet: combinedData.bulletin.salaireNet,
        chargesSalariales: combinedData.bulletin.chargesSalariales,
        typeContrat: combinedData.bulletin.typeContrat,
        anciennete: combinedData.bulletin.anciennete,
        employeur: combinedData.bulletin.employeur,
        primes: combinedData.bulletin.primes
      },
      impots: {
        revenuAnnuel: combinedData.impots.revenuAnnuel,
        impotRevenu: combinedData.impots.impotRevenu,
        revenuFiscalReference: combinedData.impots.revenuFiscalReference,
        nombreParts: combinedData.impots.nombreParts,
        situationFamiliale: combinedData.impots.situationFamiliale,
        autresRevenus: combinedData.impots.autresRevenus
      }
    };
    
    // Construire le prompt pour l'IA
    const prompt = `Voici le résumé financier d'une personne qui souhaite obtenir un prêt immobilier:
${JSON.stringify(financialSummary, null, 2)}

En tant qu'expert en analyse financière et crédit immobilier, détermine:
1. La capacité d'emprunt maximale de cette personne
2. Le taux d'endettement actuel
3. La durée de prêt optimale
4. Les facteurs favorables et défavorables pour l'obtention d'un prêt
5. Une recommandation globale

Prends en compte tous les facteurs pertinents: stabilité d'emploi, ancienneté, type de contrat, charges, situation familiale, etc.`;

    // Appeler l'IA pour l'analyse
    const { text } = await generateText({
      model: openai_model,
      system: `Tu es un expert en analyse financière spécialisé dans le crédit immobilier. 
Tu dois analyser la situation financière d'un emprunteur potentiel et déterminer sa capacité d'emprunt de façon réaliste.
Utilise les critères des banques françaises: taux d'endettement max de 35%, stabilité professionnelle, type de contrat, etc.
Prends en compte des taux d'intérêt actuels d'environ 3.5-4% sur 20-25 ans.
Fournis une analyse complète et des recommandations pertinentes.
Réponds en format JSON avec les champs suivants:
{
  "capaciteEmprunt": 00000, // montant en euros sans symbole
  "tauxEndettement": 00.00, // pourcentage actuel d'endettement
  "dureeRecommandee": "XX ans", // durée optimale du prêt
  "facteursFavorables": ["facteur 1", "facteur 2"...],
  "facteursDefavorables": ["facteur 1", "facteur 2"...],
  "recommendation": "Texte de recommandation globale",
  "mensualiteMax": 000 // mensualité maximale en euros
}`,
      prompt: prompt
    });
    
    // Nettoyer et parser la réponse JSON
    const cleanedJson = cleanJsonResponse(text);
    console.log("Analyse financière par IA (fallback):", cleanedJson);
    
    // Parser le résultat JSON
    return JSON.parse(cleanedJson);
  } catch (error) {
    console.error("Erreur lors de l'analyse fallback de la capacité d'emprunt:", error);
    throw error;
  }
} 