import { extractDataFromInvoice } from "./PDFreader";
import * as fs from "fs";

// Chemin vers votre bulletin de salaire en PDF
const pdfPath = "C:/Users/leoch/Downloads/Bulletins de salaire - FEVRIER 2024-4.pdf";

async function runTest() {
  try {
    console.log(`Analyse du bulletin de salaire: ${pdfPath}`);
    
    // Vérifie si le fichier existe
    if (!fs.existsSync(pdfPath)) {
      console.error(`ERREUR: Le fichier PDF ${pdfPath} n'existe pas.`);
      console.log("Veuillez modifier la variable 'pdfPath' dans test-pdf.ts avec le chemin correct vers votre bulletin de salaire.");
      return;
    }
    
    console.log("Extraction du salaire brut...");
    const data = await extractDataFromInvoice(pdfPath);
    console.log("Résultat:");
    console.log(`Salaire brut: ${data.salaire}€`);
  } catch (error) {
    console.error("Erreur lors de l'extraction:", error);
  }
}

runTest(); 