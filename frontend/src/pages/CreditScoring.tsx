import React, { useState } from "react";
import SidebarLayout from "@/components/layout/SidebarLayout";
import Header from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  CircleOff,
  CircleCheck,
  TrendingUp,
  TrendingDown,
  Percent,
  Calendar,
  DollarSign,
  CreditCard,
  Building,
  Scale,
  BadgeCheck,
  BadgeX,
  AwardIcon,
  DatabaseIcon
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

// Types pour le scoring crédit
interface ScoringDetails {
  scoreTotal: number;
  scoreOffChain: number;
  scoreOnChain: number;
  pourcentageRevenu: number;
  bonusMalus: number;
}

interface LoanAnalysis {
  capaciteEmprunt: number;
  mensualiteMax: number;
  tauxEndettement: number;
  dureeRecommandee: string;
  facteursFavorables: string[];
  facteursDefavorables: string[];
  recommendation: string;
  scoringDetails?: ScoringDetails;
}

const CreditScoring: React.FC = () => {
  const { toast } = useToast();
  const [loanAnalysis, setLoanAnalysis] = useState<LoanAnalysis | null>(null);
  
  // Simulation: Nous utilisons des données de test, dans une vraie application 
  // ces données seraient récupérées du serveur après l'analyse des documents
  React.useEffect(() => {
    // Simuler un chargement des données
    setTimeout(() => {
      const testData: LoanAnalysis = {
        capaciteEmprunt: 387500,
        mensualiteMax: 1650,
        tauxEndettement: 0.28,
        dureeRecommandee: "20 ans",
        facteursFavorables: [
          "Revenu mensuel élevé",
          "Stabilité professionnelle",
          "Dossier de documents complet",
          "Faible taux d'endettement",
          "Portefeuille crypto mature"
        ],
        facteursDefavorables: [],
        recommendation: "Profil solide: prêt recommandé aux conditions standards.",
        scoringDetails: {
          scoreTotal: 78.5,
          scoreOffChain: 81.2,
          scoreOnChain: 55.0,
          pourcentageRevenu: 23.5,
          bonusMalus: 3.0
        }
      };
      
      setLoanAnalysis(testData);
      toast({
        title: "Analyse complétée",
        description: "Votre évaluation de crédit est prête.",
        variant: "default",
      });
    }, 1500);
  }, [toast]);
  
  // Fonction pour formater un montant en euros
  const formatEuros = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };
  
  // Fonction pour déterminer la couleur du score
  const getScoreColor = (score: number) => {
    if (score >= 70) return "bg-green-500";
    if (score >= 50) return "bg-yellow-500";
    if (score >= 30) return "bg-orange-500";
    return "bg-red-500";
  };
  
  // Fonction pour déterminer l'icône du facteur
  const getFactorIcon = (isFavorable: boolean) => {
    return isFavorable ? 
      <CircleCheck className="h-5 w-5 text-green-500 mr-2" /> : 
      <CircleOff className="h-5 w-5 text-red-500 mr-2" />;
  };

  return (
    <SidebarLayout>
      <div className="flex flex-col space-y-6">
        <Header title="Évaluation de Crédit" subtitle="Analyse de votre capacité d'emprunt pour un crédit DeFi" />
        
        {!loanAnalysis ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            <p className="mt-4 text-gray-600">Analyse de votre profil financier en cours...</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {/* Carte score global */}
            <Card className="col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">Score de Crédit Global</CardTitle>
                <CardDescription>
                  Évaluation basée sur vos documents financiers et votre activité blockchain
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="relative w-40 h-40 flex items-center justify-center">
                    <div className={`absolute inset-0 rounded-full ${getScoreColor(loanAnalysis.scoringDetails?.scoreTotal || 0)} opacity-10`}></div>
                    <div className="text-4xl font-bold">
                      {loanAnalysis.scoringDetails?.scoreTotal.toFixed(1) || "--"}/100
                    </div>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">Données Financières (90%)</span>
                        <span className="text-sm font-medium">{loanAnalysis.scoringDetails?.scoreOffChain.toFixed(1) || "--"}/100</span>
                      </div>
                      <Progress value={loanAnalysis.scoringDetails?.scoreOffChain || 0} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">Données Blockchain (10%)</span>
                        <span className="text-sm font-medium">{loanAnalysis.scoringDetails?.scoreOnChain.toFixed(1) || "--"}/100</span>
                      </div>
                      <Progress value={loanAnalysis.scoringDetails?.scoreOnChain || 0} className="h-2" />
                    </div>
                    <div className="flex gap-2 flex-wrap pt-2">
                      <Badge variant="outline" className="flex gap-1 items-center">
                        <Percent className="h-3 w-3" />
                        {loanAnalysis.scoringDetails?.pourcentageRevenu.toFixed(1)}% du revenu
                      </Badge>
                      <Badge variant="outline" className="flex gap-1 items-center">
                        <Scale className="h-3 w-3" />
                        {loanAnalysis.tauxEndettement * 100}% taux d'endettement
                      </Badge>
                      <Badge variant="outline" className={`flex gap-1 items-center ${loanAnalysis.scoringDetails?.bonusMalus && loanAnalysis.scoringDetails.bonusMalus > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {loanAnalysis.scoringDetails?.bonusMalus && loanAnalysis.scoringDetails.bonusMalus > 0 ? 
                          <TrendingUp className="h-3 w-3" /> : 
                          <TrendingDown className="h-3 w-3" />
                        }
                        {loanAnalysis.scoringDetails?.bonusMalus && loanAnalysis.scoringDetails.bonusMalus > 0 ? '+' : ''}
                        {loanAnalysis.scoringDetails?.bonusMalus.toFixed(1)}% bonus/malus
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Capacité d'emprunt */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-primary" />
                  Capacité d'emprunt
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-4xl font-bold text-center py-4">
                  {formatEuros(loanAnalysis.capaciteEmprunt)}
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Mensualité max.</p>
                    <p className="text-xl font-medium">{formatEuros(loanAnalysis.mensualiteMax)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Durée optimale</p>
                    <p className="text-xl font-medium">{loanAnalysis.dureeRecommandee}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommandation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AwardIcon className="h-5 w-5 mr-2 text-primary" />
                  Recommandation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg mb-4">{loanAnalysis.recommendation}</p>
                <Separator className="my-4" />
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2 flex items-center">
                      <BadgeCheck className="h-4 w-4 mr-1 text-green-500" />
                      Points forts
                    </h4>
                    <ul className="space-y-2">
                      {loanAnalysis.facteursFavorables.map((factor, index) => (
                        <li key={index} className="flex items-start text-sm">
                          {getFactorIcon(true)}
                          {factor}
                        </li>
                      ))}
                      {loanAnalysis.facteursFavorables.length === 0 && (
                        <li className="text-sm text-muted-foreground">Aucun facteur favorable identifié</li>
                      )}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm mb-2 flex items-center">
                      <BadgeX className="h-4 w-4 mr-1 text-red-500" />
                      Points à améliorer
                    </h4>
                    <ul className="space-y-2">
                      {loanAnalysis.facteursDefavorables.map((factor, index) => (
                        <li key={index} className="flex items-start text-sm">
                          {getFactorIcon(false)}
                          {factor}
                        </li>
                      ))}
                      {loanAnalysis.facteursDefavorables.length === 0 && (
                        <li className="text-sm text-muted-foreground">Aucun facteur défavorable identifié</li>
                      )}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Détails des scores */}
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DatabaseIcon className="h-5 w-5 mr-2 text-primary" />
                  Détails de l'évaluation hybride (90% off-chain + 10% on-chain)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="offchain" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="offchain">Documents Financiers (90%)</TabsTrigger>
                    <TabsTrigger value="onchain">Données Blockchain (10%)</TabsTrigger>
                  </TabsList>
                  <TabsContent value="offchain" className="space-y-4 pt-4">
                    <p className="text-sm text-muted-foreground">
                      Cette partie de l'évaluation est basée sur vos documents financiers traditionnels
                      (90% du score global), comme vos bulletins de salaire et déclarations d'impôts.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="py-2">
                          <CardTitle className="text-sm">Revenu mensuel net</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-lg font-medium">{formatEuros(loanAnalysis.mensualiteMax * 4)}</p>
                          <Progress value={Math.min(loanAnalysis.mensualiteMax * 4 / 10000, 100) * 100} className="h-1 mt-2" />
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="py-2">
                          <CardTitle className="text-sm">Taux d'endettement</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-lg font-medium">{(loanAnalysis.tauxEndettement * 100).toFixed(1)}%</p>
                          <Progress value={(1 - loanAnalysis.tauxEndettement) * 100} className="h-1 mt-2" />
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="py-2">
                          <CardTitle className="text-sm">Complétude des documents</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-lg font-medium">100%</p>
                          <Progress value={100} className="h-1 mt-2" />
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="py-2">
                          <CardTitle className="text-sm">Stabilité professionnelle</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-lg font-medium">5 ans</p>
                          <Progress value={50} className="h-1 mt-2" />
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  <TabsContent value="onchain" className="space-y-4 pt-4">
                    <p className="text-sm text-muted-foreground">
                      Cette partie de l'évaluation est basée sur vos activités blockchain
                      (10% du score global), comme l'âge de votre portefeuille et votre historique de transactions.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="py-2">
                          <CardTitle className="text-sm">Âge du portefeuille</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-lg font-medium">1.5 ans</p>
                          <Progress value={50} className="h-1 mt-2" />
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="py-2">
                          <CardTitle className="text-sm">Nombre de transactions</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-lg font-medium">250 tx</p>
                          <Progress value={25} className="h-1 mt-2" />
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="py-2">
                          <CardTitle className="text-sm">Historique sur le protocole</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-lg font-medium">6 mois</p>
                          <Progress value={17} className="h-1 mt-2" />
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="py-2">
                          <CardTitle className="text-sm">Prêts remboursés</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-lg font-medium">1/1 (100%)</p>
                          <Progress value={100} className="h-1 mt-2" />
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
};

export default CreditScoring;
