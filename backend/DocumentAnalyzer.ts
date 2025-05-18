import { z } from 'zod';
import { generateText } from "ai";
import { openai_model } from "./models/openai_model";
import * as fs from 'fs';
import * as path from 'path';
import pdfParse from 'pdf-parse';

// Schéma enrichi pour les données de bulletin de salaire
const payslipSchema = z.object({
  salaireBrut: z.number().describe("Le salaire brut mensuel en euros"),
  salaireNet: z.number().describe("Le salaire net à payer en euros"),
  heuresTravaillees: z.number().describe("Nombre d'heures travaillées dans le mois"),
  employeur: z.string().describe("Nom de l'employeur"),
  dateEmission: z.string().describe("Date d'émission du bulletin"),
  // Nouveaux champs
  typeContrat: z.string().describe("Type de contrat (CDI, CDD, intérim, etc.)"),
  anciennete: z.string().describe("Ancienneté dans l'entreprise (format: 'X ans Y mois' ou date d'embauche)"),
  primes: z.array(z.object({
    nom: z.string().describe("Nom de la prime"),
    montant: z.number().describe("Montant de la prime en euros")
  })).describe("Liste des primes présentes sur le bulletin"),
  chargesSalariales: z.number().describe("Total des charges salariales en euros")
});

// Schéma enrichi pour les données fiscales
const taxReturnSchema = z.object({
  revenuAnnuel: z.number().describe("Revenu annuel déclaré"),
  impotRevenu: z.number().describe("Montant de l'impôt sur le revenu"),
  revenuFiscalReference: z.number().describe("Revenu fiscal de référence"),
  nombreParts: z.number().describe("Nombre de parts fiscales"),
  annee: z.string().describe("Année de la déclaration"),
  // Nouveaux champs
  autresRevenus: z.array(z.object({
    source: z.string().describe("Source du revenu (ex: revenus fonciers, capitaux mobiliers, etc.)"),
    montant: z.number().describe("Montant annuel en euros")
  })).describe("Autres sources de revenus déclarées"),
  situationFamiliale: z.object({
    statut: z.string().describe("Statut marital (célibataire, marié, pacsé, divorcé, veuf)"),
    nombrePersonnesCharge: z.number().describe("Nombre total de personnes à charge")
  }).describe("Situation familiale du déclarant"),
  adresseFiscale: z.string().describe("Adresse fiscale complète du déclarant")
});

// Schéma combiné pour l'analyse financière complète
const combinedSchema = z.object({
  bulletin: payslipSchema,
  impots: taxReturnSchema
});

// Type pour les résultats
type PayslipData = z.infer<typeof payslipSchema>;
type TaxReturnData = z.infer<typeof taxReturnSchema>;
type CombinedData = z.infer<typeof combinedSchema>;

/**
 * Nettoie la réponse de l'IA pour extraire le JSON valide
 */
function cleanJsonResponse(text: string): string {
  // Enlever les blocs de code markdown (```json et ```)
  let cleaned = text.replace(/```(json|javascript|js)?\s*/g, '').replace(/```\s*$/g, '');
  
  // Enlever les guillemets de citation > 
  cleaned = cleaned.replace(/^\s*>\s*/gm, '');
  
  // Trouver le premier { et le dernier }
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }
  
  return cleaned.trim();
}

/**
 * Extrait les données d'un fichier PDF
 */
async function extractTextFromPdf(pdfPath: string): Promise<string> {
  // Vérifier que le fichier existe
  if (!fs.existsSync(pdfPath)) {
    throw new Error(`Le fichier ${pdfPath} n'existe pas`);
  }

  // Lire le fichier PDF
  console.log(`Lecture du fichier PDF: ${path.basename(pdfPath)}...`);
  const dataBuffer = fs.readFileSync(pdfPath);
  
  // Extraire le texte du PDF
  console.log("Extraction du texte...");
  const pdfData = await pdfParse(dataBuffer);
  return pdfData.text;
}

/**
 * Analyse un bulletin de salaire
 * @param pdfPath Chemin vers le fichier PDF du bulletin de salaire
 * @returns Les données extraites du bulletin
 */
export async function analyzePayslip(pdfPath: string): Promise<PayslipData> {
  try {
    const pdfText = await extractTextFromPdf(pdfPath);
    
    console.log("Analyse du bulletin de salaire par l'IA...");
    const { text } = await generateText({
      model: openai_model,
      system: `Tu es un expert en analyse de bulletins de salaire français. Extrait les informations suivantes:

INSTRUCTIONS IMPORTANTES:
1. Réponds UNIQUEMENT avec un objet JSON valide.
2. Ne fournis PAS d'explications ou commentaires.
3. N'utilise PAS de blocs de code markdown.
4. Si tu ne trouves pas l'information exacte, fais une estimation raisonnable.
5. Pour les montants, retire les symboles (€, $) et n'inclus que les nombres.
6. Si aucune prime n'est trouvée, retourne un tableau vide pour "primes".
7. Utilise STRICTEMENT ce format:
${JSON.stringify(payslipSchema.shape, null, 2)}

EXEMPLE DE RÉPONSE VALIDE:
{
  "salaireBrut": 3500,
  "salaireNet": 2700,
  "heuresTravaillees": 151.67,
  "employeur": "ACME Corporation",
  "dateEmission": "28/02/2024",
  "typeContrat": "CDI",
  "anciennete": "2 ans 3 mois",
  "primes": [
    {
      "nom": "Prime exceptionnelle",
      "montant": 150
    },
    {
      "nom": "Prime d'ancienneté",
      "montant": 50
    }
  ],
  "chargesSalariales": 800
}`,
      prompt: pdfText
    });
    
    // Nettoyer et parser la réponse JSON
    const cleanedJson = cleanJsonResponse(text);
    console.log("JSON nettoyé:", cleanedJson);
    
    // Parser le résultat JSON
    const result = JSON.parse(cleanedJson);
    
    // Valider avec Zod et retourner
    return payslipSchema.parse(result);
  } catch (error) {
    console.error("Erreur lors de l'analyse du bulletin de salaire:", error);
    throw error;
  }
}

/**
 * Analyse une déclaration d'impôts
 * @param pdfPath Chemin vers le fichier PDF de la déclaration d'impôts
 * @returns Les données extraites de la déclaration
 */
export async function analyzeTaxReturn(pdfPath: string): Promise<TaxReturnData> {
  try {
    const pdfText = await extractTextFromPdf(pdfPath);
    
    console.log("Analyse de la déclaration d'impôts par l'IA...");
    const { text } = await generateText({
      model: openai_model,
      system: `Tu es un expert en analyse de documents fiscaux français. Extrait les informations suivantes:

INSTRUCTIONS IMPORTANTES:
1. Réponds UNIQUEMENT avec un objet JSON valide.
2. Ne fournis PAS d'explications ou commentaires.
3. N'utilise PAS de blocs de code markdown.
4. Si tu ne trouves pas l'information exacte, fais une estimation raisonnable.
5. Pour les montants, retire les symboles (€, $) et n'inclus que les nombres.
6. Si aucune autre source de revenu n'est trouvée, retourne un tableau vide pour "autresRevenus".
7. Utilise STRICTEMENT ce format:
${JSON.stringify(taxReturnSchema.shape, null, 2)}

EXEMPLE DE RÉPONSE VALIDE:
{
  "revenuAnnuel": 42000,
  "impotRevenu": 5200,
  "revenuFiscalReference": 38500,
  "nombreParts": 2,
  "annee": "2023",
  "autresRevenus": [
    {
      "source": "Revenus fonciers",
      "montant": 3600
    }
  ],
  "situationFamiliale": {
    "statut": "Marié",
    "nombrePersonnesCharge": 2
  },
  "adresseFiscale": "12 rue des Fleurs, 75001 Paris"
}`,
      prompt: pdfText
    });
    
    // Nettoyer et parser la réponse JSON
    const cleanedJson = cleanJsonResponse(text);
    console.log("JSON nettoyé:", cleanedJson);
    
    // Parser le résultat JSON
    const result = JSON.parse(cleanedJson);
    
    // Valider avec Zod et retourner
    return taxReturnSchema.parse(result);
  } catch (error) {
    console.error("Erreur lors de l'analyse de la déclaration d'impôts:", error);
    throw error;
  }
}

/**
 * Analyse complète des documents financiers (bulletin de salaire et déclaration d'impôts)
 * @param payslipPath Chemin vers le bulletin de salaire
 * @param taxReturnPath Chemin vers la déclaration d'impôts
 * @returns Les données combinées des deux documents
 */
export async function analyzeFinancialDocuments(
  payslipPath: string, 
  taxReturnPath: string
): Promise<CombinedData> {
  try {
    console.log("Début de l'analyse des documents financiers...");
    
    // Analyser les deux documents en parallèle pour gagner du temps
    const [payslipData, taxReturnData] = await Promise.all([
      analyzePayslip(payslipPath),
      analyzeTaxReturn(taxReturnPath)
    ]);
    
    
    // Combiner les résultats
    const combinedData: CombinedData = {
      bulletin: payslipData,
      impots: taxReturnData
    };
    
    console.log("Analyse financière complétée avec succès");
    return combinedData;
  } catch (error) {
    console.error("Erreur lors de l'analyse des documents financiers:", error);
    throw error;
  }
}

/**
 * Utilise l'IA pour analyser la situation financière et calculer une capacité d'emprunt
 * @param combinedData Les données combinées des bulletins de salaire et déclarations d'impôts
 * @returns Analyse financière incluant capacité d'emprunt et recommandations
 */
export async function calculateLoanCapacity(combinedData: CombinedData): Promise<any> {
  try {
    console.log("Analyse de la capacité d'emprunt par l'IA...");
    
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
    console.log("Analyse financière par IA:", cleanedJson);
    
    // Parser le résultat JSON
    return JSON.parse(cleanedJson);
  } catch (error) {
    console.error("Erreur lors de l'analyse de la capacité d'emprunt:", error);
    throw error;
  }
} 