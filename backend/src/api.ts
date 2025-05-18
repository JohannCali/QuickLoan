import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { 
  analyzePayslip, 
  analyzeTaxReturn, 
  analyzeFinancialDocuments,
  calculateLoanCapacity
} from "../DocumentAnalyzer";

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configuration pour le stockage des fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Route pour analyser un bulletin de salaire
app.post('/api/analyze/payslip', upload.single('payslip'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier fourni' });
    }
    
    const filePath = req.file.path;
    const result = await analyzePayslip(filePath);
    
    // Nettoyer le fichier après analyse
    fs.unlinkSync(filePath);
    
    res.json(result);
  } catch (error) {
    console.error('Erreur lors de l\'analyse du bulletin de salaire:', error);
    res.status(500).json({ error: 'Erreur lors de l\'analyse du document' });
  }
});

// Route pour analyser une déclaration d'impôts
app.post('/api/analyze/taxreturn', upload.single('taxreturn'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier fourni' });
    }
    
    const filePath = req.file.path;
    const result = await analyzeTaxReturn(filePath);
    
    // Nettoyer le fichier après analyse
    fs.unlinkSync(filePath);
    
    res.json(result);
  } catch (error) {
    console.error('Erreur lors de l\'analyse de la déclaration d\'impôts:', error);
    res.status(500).json({ error: 'Erreur lors de l\'analyse du document' });
  }
});

// Route pour analyser les deux documents ensemble
app.post('/api/analyze/complete', upload.fields([
  { name: 'payslip', maxCount: 1 },
  { name: 'taxreturn', maxCount: 1 }
]), async (req, res) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    
    if (!files.payslip || !files.taxreturn) {
      return res.status(400).json({ 
        error: 'Les deux types de documents sont requis' 
      });
    }
    
    const payslipPath = files.payslip[0].path;
    const taxReturnPath = files.taxreturn[0].path;
    
    // Analyser les documents et calculer la capacité d'emprunt
    const documentData = await analyzeFinancialDocuments(payslipPath, taxReturnPath);
    const loanAnalysis = await calculateLoanCapacity(documentData);
    
    // Nettoyer les fichiers après analyse
    fs.unlinkSync(payslipPath);
    fs.unlinkSync(taxReturnPath);
    
    res.json({
      documentData,
      loanAnalysis
    });
  } catch (error) {
    console.error('Erreur lors de l\'analyse complète:', error);
    res.status(500).json({ error: 'Erreur lors de l\'analyse des documents' });
  }
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`API serveur démarré sur http://localhost:${PORT}`);
});

export default app; 