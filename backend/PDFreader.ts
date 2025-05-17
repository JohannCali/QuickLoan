import { z } from 'zod';
import { generateText } from "ai";
import { openai_model } from "./models/openai_model";
import * as fs from 'fs';
import * as path from 'path';
import pdfParse from 'pdf-parse';

// Schéma simplifié pour ne garder que le salaire
const schema = z
  .object({
    salaire: z
    .number()
    .describe("Le salaire brut mensuel du client en euros.")
  })
  .describe("Le salaire brut mensuel extrait du bulletin de paie.");

/**
 * Nettoie la réponse de l'IA pour extraire le JSON valide
 * @param text La réponse de l'IA
 * @returns Le JSON nettoyé
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
 * Extrait le salaire brut d'un bulletin de paie au format PDF.
 * 
 * @param pdfPath Chemin vers le fichier PDF du bulletin de salaire
 * @returns Le salaire brut extrait du bulletin
 */
export const extractDataFromInvoice = async (
  pdfPath: string,
) => {
  try {
    // Vérifier que le fichier existe
    if (!fs.existsSync(pdfPath)) {
      throw new Error(`Le fichier ${pdfPath} n'existe pas`);
    }

    // Lire le fichier PDF
    console.log("Lecture du fichier PDF...");
    const dataBuffer = fs.readFileSync(pdfPath);
    
    // Extraire le texte du PDF
    console.log("Extraction du texte...");
    const pdfData = await pdfParse(dataBuffer);
    const pdfText = pdfData.text;
    
    console.log("Analyse par l'IA...");
    // Utiliser l'IA pour extraire le salaire brut
    const { text } = await generateText({
      model: openai_model,
      system: `Tu es un expert en analyse de bulletins de salaire. Ta tâche est d'extraire uniquement le SALAIRE BRUT MENSUEL d'un bulletin de paie.

INSTRUCTIONS IMPORTANTES:
1. Réponds UNIQUEMENT avec un objet JSON contenant le champ "salaire".
2. Ne fournis PAS d'explications, d'introduction ni de conclusion.
3. N'utilise PAS de blocs de code markdown.
4. Pour le salaire, recherche spécifiquement le SALAIRE BRUT ou BRUT MENSUEL.
5. Retire tous les symboles (€, $) et n'inclus que le nombre.
6. Si plusieurs montants sont présents, choisis celui qui correspond au salaire brut total.
7. Utilise STRICTEMENT ce format:
${JSON.stringify(schema.shape, null, 2)}

EXEMPLE DE RÉPONSE VALIDE:
{
  "salaire": 2500
}`,
      prompt: pdfText
    });
    
    console.log("Réponse brute de l'IA:", text);
    
    // Nettoyer et parser la réponse JSON
    try {
      // Nettoyer la réponse pour obtenir un JSON valide
      const cleanedJson = cleanJsonResponse(text);
      console.log("JSON nettoyé:", cleanedJson);
      
      // Parser le résultat JSON
      const result = JSON.parse(cleanedJson);
      
      // Valider avec Zod
      return schema.parse(result);
    } catch (jsonError) {
      console.error("Erreur de parsing JSON après nettoyage:", jsonError);
      throw new Error(`Impossible de parser la réponse JSON: ${jsonError.message}`);
    }
  } catch (error) {
    console.error("Erreur lors de l'extraction du salaire:", error);
    throw error;
  }
};


     