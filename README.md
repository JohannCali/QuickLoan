# 💸 QuickLoan – Prêt et Emprunt sur la Blockchain avec Analyse IA

## 🔗 Contexte

Dans un monde décentralisé, les prêts entre pairs sont souvent surcollatéralisés pour pallier l'absence de confiance. Et si nous pouvions injecter de l'intelligence dans ce processus ? AI-LendChain propose une solution novatrice : un **protocole de prêt/borrow où la solvabilité est estimée par une IA**, grâce aux données d’activité *on-chain*.

---

## 🎯 Objectif

Créer un système de micro-prêts sécurisés sur la blockchain, où la **vérification de solvabilité est automatisée** grâce à une intelligence artificielle entraînée à analyser l'historique d'une adresse (transferts, participation DeFi, NFT, staking, etc.), tout en **récompensant les bons comportements**.

---

## 🧠 Comment ça marche ?

### 1. **Analyse IA des emprunteurs**
- Récupération des données d’activité on-chain (via API comme Covalent, Alchemy, Moralis…)
- Feature engineering : nombre de transactions, volume, diversité d’interactions, scores de protocole, comportement passé de remboursement
- Application d’un modèle ML/IA (random forest, logistic regression ou modèle léger embarqué)
- Attribution d’un **"Credit Trust Score"** à chaque adresse

### 2. **Décision de prêt**
- Score suffisant : le prêt est accordé avec une limite prédéfinie
- Score douteux : la demande est mise en attente pour **revue humaine**
- Le montant maximum dépend du score et du *niveau de confiance* historique

### 3. **Récompenses de fiabilité**
- Plus un utilisateur rembourse dans les délais, plus il débloque de **bonus de plafond d’emprunt**
  - 🔓 Niveau 1 : +5%
  - 🔓 Niveau 2 : +10%
  - 🔓 Niveau 3 : +15%
  - 🔓 ... jusqu’à un maximum de +25%

---

## 🔐 Sécurité et Limites

- **Micro-prêts** uniquement : pour limiter l’exposition au risque
- **Smart contracts audités** (ou limités à des fonctionnalités testables en local pendant le hackathon)
- Historique des prêts enregistré de façon transparente sur la blockchain
- Refus automatique pour les utilisateurs trop récents ou jugés risqués par l’IA

---

## 🛠️ Stack Technique

- **Frontend** : React + wagmi + ethers.js
- **Smart contracts** : Solidity (déployé avec Foundry ou Hardhat)
- **Backend AI** : Python + Scikit-learn ou TensorFlow Lite
- **Data on-chain** : APIs comme Moralis / Alchemy / Dune / Covalent
- **Base de données (temporaire)** : Firebase ou supabase pour logs AI + résultats

---

## ⚙️ Fonctionnalités disponibles

- [x] Envoi d'une demande de prêt via l’interface
- [x] Analyse IA de solvabilité basée sur l’adresse
- [x] Réponse automatique ou passage en revue humaine
- [x] Déblocage progressif de crédits bonus via historique


