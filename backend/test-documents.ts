import { 
  analyzePayslip, 
  analyzeTaxReturn, 
  analyzeFinancialDocuments,
  calculateLoanCapacity
} from "./DocumentAnalyzer";
import * as fs from "fs";
import * as path from "path";

// ====== CONFIGURATION DES CHEMINS DE FICHIERS ======
// Modifiez les chemins ci-dessous pour pointer vers vos propres fichiers PDF

// Dossier contenant les PDF (doit se terminer par un slash)
const PDF_FOLDER = "C:/Users/leoch/Downloads/";

// Noms des fichiers PDF
const FICHIERS = {
  BULLETIN_SALAIRE: "Bulletins de salaire - FEVRIER 2024-4.pdf",
  DECLARATION_IMPOTS: "Revenus impôts papa 2021.pdf"
};

// Chemins complets (ne pas modifier cette partie)
const payslipPath = path.join(PDF_FOLDER, FICHIERS.BULLETIN_SALAIRE);
const taxReturnPath = path.join(PDF_FOLDER, FICHIERS.DECLARATION_IMPOTS);
// =================================================

// Vérifier si les fichiers existent
function checkFilesExist() {
  let allFilesExist = true;
  
  if (!fs.existsSync(payslipPath)) {
    console.error(`ERREUR: Le bulletin de salaire n'existe pas à l'emplacement: ${payslipPath}`);
    allFilesExist = false;
  }
  
  if (!fs.existsSync(taxReturnPath)) {
    console.error(`ERREUR: La déclaration d'impôts n'existe pas à l'emplacement: ${taxReturnPath}`);
    allFilesExist = false;
  }
  
  if (!allFilesExist) {
    console.log("\nModifiez les variables PDF_FOLDER et FICHIERS au début du fichier test-documents.ts pour corriger les chemins.");
    return false;
  }
  
  return true;
}

// Affiche la liste des primes formatées
function formatPrimes(primes) {
  if (!primes || primes.length === 0) {
    return "Aucune prime";
  }
  
  return primes.map(prime => `${prime.nom}: ${prime.montant}€`).join(", ");
}

// Affiche les autres revenus formatés
function formatAutresRevenus(revenus) {
  if (!revenus || revenus.length === 0) {
    return "Aucun autre revenu";
  }
  
  return revenus.map(revenu => `${revenu.source}: ${revenu.montant}€`).join(", ");
}

// Tester l'analyse du bulletin de salaire uniquement
async function testPayslipAnalysis() {
  try {
    console.log("\n=== ANALYSE DU BULLETIN DE SALAIRE ===\n");
    console.log(`Fichier analysé: ${FICHIERS.BULLETIN_SALAIRE}`);
    const payslipData = await analyzePayslip(payslipPath);
    console.log("\nRésultats de l'analyse du bulletin de salaire:");
    console.log("----------------------------------------");
    console.log(`Employeur: ${payslipData.employeur}`);
    console.log(`Date d'émission: ${payslipData.dateEmission}`);
    console.log(`Type de contrat: ${payslipData.typeContrat}`);
    console.log(`Ancienneté: ${payslipData.anciennete}`);
    console.log(`Heures travaillées: ${payslipData.heuresTravaillees}h`);
    console.log(`Salaire brut: ${payslipData.salaireBrut}€`);
    console.log(`Charges salariales: ${payslipData.chargesSalariales}€`);
    console.log(`Salaire net: ${payslipData.salaireNet}€`);
    console.log(`Primes: ${formatPrimes(payslipData.primes)}`);
    console.log("----------------------------------------");
  } catch (error) {
    console.error("Erreur lors de l'analyse du bulletin:", error);
  }
}

// Tester l'analyse de la déclaration d'impôts uniquement
async function testTaxReturnAnalysis() {
  try {
    console.log("\n=== ANALYSE DE LA DÉCLARATION D'IMPÔTS ===\n");
    console.log(`Fichier analysé: ${FICHIERS.DECLARATION_IMPOTS}`);
    const taxData = await analyzeTaxReturn(taxReturnPath);
    console.log("\nRésultats de l'analyse fiscale:");
    console.log("----------------------------------------");
    console.log(`Année: ${taxData.annee}`);
    console.log(`Adresse fiscale: ${taxData.adresseFiscale}`);
    console.log(`Situation familiale: ${taxData.situationFamiliale.statut}`);
    console.log(`Personnes à charge: ${taxData.situationFamiliale.nombrePersonnesCharge}`);
    console.log(`Revenu annuel: ${taxData.revenuAnnuel}€`);
    console.log(`Autres revenus: ${formatAutresRevenus(taxData.autresRevenus)}`);
    console.log(`Nombre de parts: ${taxData.nombreParts}`);
    console.log(`Impôt sur le revenu: ${taxData.impotRevenu}€`);
    console.log(`Revenu fiscal de référence: ${taxData.revenuFiscalReference}€`);
    console.log("----------------------------------------");
  } catch (error) {
    console.error("Erreur lors de l'analyse fiscale:", error);
  }
}

// Tester l'analyse complète
async function testFullAnalysis() {
  try {
    console.log("\n=== ANALYSE FINANCIÈRE COMPLÈTE ===\n");
    
    // Obtenir les données combinées des deux documents
    const combinedData = await analyzeFinancialDocuments(payslipPath, taxReturnPath);
    
    console.log("\nRésultats de l'analyse des documents:");
    console.log("========================================");
    console.log("BULLETIN DE SALAIRE:");
    console.log(`- Employeur: ${combinedData.bulletin.employeur}`);
    console.log(`- Type de contrat: ${combinedData.bulletin.typeContrat}`);
    console.log(`- Ancienneté: ${combinedData.bulletin.anciennete}`);
    console.log(`- Salaire brut: ${combinedData.bulletin.salaireBrut}€`);
    console.log(`- Salaire net: ${combinedData.bulletin.salaireNet}€`);
    console.log(`- Charges salariales: ${combinedData.bulletin.chargesSalariales}€`);
    console.log(`- Primes: ${formatPrimes(combinedData.bulletin.primes)}`);
    
    console.log("\nDÉCLARATION D'IMPÔTS:");
    console.log(`- Adresse fiscale: ${combinedData.impots.adresseFiscale}`);
    console.log(`- Situation: ${combinedData.impots.situationFamiliale.statut}, ${combinedData.impots.situationFamiliale.nombrePersonnesCharge} personne(s) à charge`);
    console.log(`- Revenu annuel: ${combinedData.impots.revenuAnnuel}€`);
    console.log(`- Autres revenus: ${formatAutresRevenus(combinedData.impots.autresRevenus)}`);
    console.log(`- Impôt sur le revenu: ${combinedData.impots.impotRevenu}€`);
    console.log(`- Revenu fiscal de référence: ${combinedData.impots.revenuFiscalReference}€`);
    
    // Utiliser l'IA pour l'analyse financière au lieu d'une formule fixe
    console.log("\nCalcul de la capacité d'emprunt via IA...");
    const loanAnalysis = await calculateLoanCapacity(combinedData);
    
    console.log("\nANALYSE FINANCIÈRE INTELLIGENTE:");
    console.log(`- Capacité d'emprunt estimée: ${loanAnalysis.capaciteEmprunt}€`);
    console.log(`- Mensualité maximale: ${loanAnalysis.mensualiteMax}€`);
    console.log(`- Taux d'endettement actuel: ${loanAnalysis.tauxEndettement}%`);
    console.log(`- Durée recommandée: ${loanAnalysis.dureeRecommandee}`);
    console.log("\n- Facteurs favorables:");
    loanAnalysis.facteursFavorables.forEach(facteur => console.log(`  • ${facteur}`));
    console.log("\n- Facteurs défavorables:");
    loanAnalysis.facteursDefavorables.forEach(facteur => console.log(`  • ${facteur}`));
    console.log("\n- Recommandation:");
    console.log(`  ${loanAnalysis.recommendation}`);
    console.log("========================================");
  } catch (error) {
    console.error("Erreur lors de l'analyse complète:", error);
  }
}

// Fonction principale pour exécuter les tests
async function runTests() {
  console.log("======================================");
  console.log("= ANALYSE DE DOCUMENTS FINANCIERS =");
  console.log("======================================");
  console.log("\nEmplacement des fichiers:");
  console.log(`Dossier: ${PDF_FOLDER}`);
  console.log(`Bulletin de salaire: ${FICHIERS.BULLETIN_SALAIRE}`);
  console.log(`Déclaration d'impôts: ${FICHIERS.DECLARATION_IMPOTS}`);
  
  if (!checkFilesExist()) {
    return;
  }
  
  // Exécuter tous les tests
  await testPayslipAnalysis();
  await testTaxReturnAnalysis();
  await testFullAnalysis();
  
  console.log("\nAnalyse terminée!");
}

// Exécuter les tests
runTests(); 