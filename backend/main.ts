/**
 * QuickLoan Backend - Point d'entrée principal
 * Ce fichier sert de point d'entrée central pour le backend de l'application QuickLoan
 */

import dotenv from 'dotenv';
import app from './src/api';

// Charger les variables d'environnement
dotenv.config();

// Définir le port à utiliser (celui dans .env ou 3002 par défaut)
const PORT = process.env.PORT || 3002;

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`
===============================================
  💰 QuickLoan API en écoute sur le port ${PORT} 💰
===============================================

Endpoints disponibles:
- GET  / : Vérification que l'API est en ligne
- POST /api/analyze-documents : Analyse des documents financiers
- POST /api/credit-scoring : Calcul du score de crédit

Documentation: http://localhost:${PORT}/
===============================================
  `);
});

// Gestion des erreurs non capturées
process.on('unhandledRejection', (reason, promise) => {
  console.error('Promesse non gérée:', promise, 'raison:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Exception non capturée:', error);
  process.exit(1); // Quitter en cas d'erreur critique
});
