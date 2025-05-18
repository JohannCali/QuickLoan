import React, { useState } from "react";
import SidebarLayout from "@/components/layout/SidebarLayout";
import Header from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  UserCircle,
  FileText, 
  Calendar,
  Globe,
  ArrowRight, 
  XCircle, 
  Check,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomProgress } from "@/components/ui/custom-progress";

interface AnalysisResult {
  documentData?: {
    bulletin: {
      employeur: string;
      typeContrat: string;
      anciennete: string;
      salaireBrut: number;
      salaireNet: number;
      chargesSalariales: number;
      primes: Array<{ nom: string; montant: number }>;
    };
    impots: {
      adresseFiscale: string;
      situationFamiliale: {
        statut: string;
        nombrePersonnesCharge: number;
      };
      revenuAnnuel: number;
      autresRevenus: Array<{ source: string; montant: number }>;
      impotRevenu: number;
      revenuFiscalReference: number;
    };
  };
  loanAnalysis?: {
    capaciteEmprunt: number;
    mensualiteMax: number;
    tauxEndettement: number;
    dureeRecommandee: string;
    facteursFavorables: string[];
    facteursDefavorables: string[];
    recommendation: string;
  };
}

const DIDDocuments = () => {
  const { toast } = useToast();
  const [dragActive, setDragActive] = useState(false);
  const [payslipFile, setPayslipFile] = useState<File | null>(null);
  const [taxReturnFile, setTaxReturnFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      
      // Essayer de déterminer le type de fichier en fonction du nom
      files.forEach(file => {
        if (file.name.toLowerCase().includes('salaire') || file.name.toLowerCase().includes('paie')) {
          setPayslipFile(file);
          toast({
            title: "Fichier accepté",
            description: `Fiche de paie: ${file.name}`,
            variant: "default",
          });
        } else if (file.name.toLowerCase().includes('impot') || file.name.toLowerCase().includes('tax')) {
          setTaxReturnFile(file);
          toast({
            title: "Fichier accepté",
            description: `Déclaration d'impôts: ${file.name}`,
            variant: "default",
          });
        } else {
          toast({
            title: "Type de fichier incertain",
            description: "Veuillez indiquer s'il s'agit d'une fiche de paie ou d'une déclaration d'impôts",
            variant: "destructive",
          });
        }
      });
    }
  };
  
  const handlePayslipInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPayslipFile(e.target.files[0]);
      toast({
        title: "Fichier téléchargé",
        description: `Fiche de paie: ${e.target.files[0].name}`,
        variant: "default",
      });
    }
  };
  
  const handleTaxReturnInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setTaxReturnFile(e.target.files[0]);
      toast({
        title: "Fichier téléchargé",
        description: `Déclaration d'impôts: ${e.target.files[0].name}`,
        variant: "default",
      });
    }
  };
  
  const handleAnalyzeDocuments = async () => {
    if (!payslipFile || !taxReturnFile) {
      toast({
        title: "Documents manquants",
        description: "Veuillez télécharger à la fois une fiche de paie et une déclaration d'impôts",
        variant: "destructive",
      });
      return;
    }
    
    setIsAnalyzing(true);
    setAnalysisResult(null);
    
    try {
      const formData = new FormData();
      formData.append('payslip', payslipFile);
      formData.append('taxReturn', taxReturnFile);
      
      const response = await fetch('http://localhost:3001/api/analyze-documents', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de l\'analyse des documents');
      }
      
      const result = await response.json();
      if (result.success && result.data) {
        setAnalysisResult({
          documentData: {
            bulletin: result.data.payslip,
            impots: result.data.taxReturn
          },
          loanAnalysis: result.data.loanAnalysis
        });
      } else {
        throw new Error('Format de réponse incorrect');
      }
      
      toast({
        title: "Analyse terminée",
        description: "Vos documents ont été analysés avec succès",
        variant: "default",
      });
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur d'analyse",
        description: "Une erreur est survenue lors de l'analyse des documents: " + (error instanceof Error ? error.message : String(error)),
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Demo user data for DID profile
  const userProfile = {
    did: "did:ethr:0x9Ac4b6.....7d8",
    name: "Julien Durand",
    profilePic: "https://randomuser.me/api/portraits/men/43.jpg",
    email: "julien.durand@example.com",
    country: "France",
    dob: "1985-08-17",
    walletAddress: "0x9Ac4b6.....7d8",
    creditScore: 740,
    kycStatus: "Verified",
    trustScore: 85,
    verifiedSince: "2024-11-23",
    documents: [
      { 
        type: "Passport",
        status: "Verified",
        uploadDate: "2024-11-20",
        expiryDate: "2030-06-15",
        icon: FileText
      },
      { 
        type: "Proof of Income",
        status: "Verified",
        uploadDate: "2024-11-22",
        icon: FileText 
      },
      { 
        type: "Bank Statement",
        status: "Pending",
        uploadDate: "2025-05-15",
        icon: FileText 
      }
    ],
    requiredDocuments: [
      {
        type: "Tax Return",
        status: "Required",
        icon: FileText
      },
      {
        type: "Utility Bill",
        status: "Required",
        icon: FileText
      }
    ]
  };

  const renderAnalysisResults = () => {
    if (!analysisResult) return null;
    
    const { documentData, loanAnalysis } = analysisResult;
    
    if (!documentData || !loanAnalysis) return null;
    
    return (
      <Card className="bg-aave-blue-gray border-aave-accent mt-6">
        <CardHeader className="pb-2">
          <CardTitle>Résultats de l'Analyse</CardTitle>
          <CardDescription className="text-gray-400">
            Analyse de vos documents financiers et capacité d'emprunt
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Bulletin de Salaire</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Employeur:</span>
                  <span>{documentData.bulletin.employeur}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Type de contrat:</span>
                  <span>{documentData.bulletin.typeContrat}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Ancienneté:</span>
                  <span>{documentData.bulletin.anciennete}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Salaire brut:</span>
                  <span className="font-semibold">{documentData.bulletin.salaireBrut}€</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Salaire net:</span>
                  <span className="font-semibold">{documentData.bulletin.salaireNet}€</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Déclaration d'Impôts</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Situation:</span>
                  <span>{documentData.impots.situationFamiliale.statut}, {documentData.impots.situationFamiliale.nombrePersonnesCharge} personne(s) à charge</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Revenu annuel:</span>
                  <span className="font-semibold">{documentData.impots.revenuAnnuel}€</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Impôt sur le revenu:</span>
                  <span>{documentData.impots.impotRevenu}€</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Revenu fiscal de référence:</span>
                  <span>{documentData.impots.revenuFiscalReference}€</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-aave-accent/10 p-4 rounded-lg border border-aave-accent space-y-4">
            <h3 className="text-lg font-medium text-aave-accent">Capacité d'Emprunt</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-aave-darker p-4 rounded-lg text-center">
                <div className="text-gray-400 mb-1">Montant Maximal</div>
                <div className="text-3xl font-bold text-aave-accent">{loanAnalysis.capaciteEmprunt}€</div>
              </div>
              
              <div className="bg-aave-darker p-4 rounded-lg text-center">
                <div className="text-gray-400 mb-1">Mensualité</div>
                <div className="text-3xl font-bold text-aave-primary">{loanAnalysis.mensualiteMax}€</div>
              </div>
              
              <div className="bg-aave-darker p-4 rounded-lg text-center">
                <div className="text-gray-400 mb-1">Durée Recommandée</div>
                <div className="text-3xl font-bold text-aave-secondary">{loanAnalysis.dureeRecommandee}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <h4 className="font-medium mb-2">Facteurs Favorables</h4>
                <ul className="space-y-1">
                  {loanAnalysis.facteursFavorables.map((facteur, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                      <span>{facteur}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Facteurs Défavorables</h4>
                <ul className="space-y-1">
                  {loanAnalysis.facteursDefavorables.map((facteur, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <AlertCircle className="h-4 w-4 text-red-400 mr-2" />
                      <span>{facteur}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="mt-4">
              <h4 className="font-medium mb-2">Recommandation</h4>
              <p className="text-sm bg-aave-darker p-3 rounded-lg">{loanAnalysis.recommendation}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <SidebarLayout>
      <div className="flex flex-col h-screen">
        <Header />
        <main className="flex-1 p-6 space-y-6 overflow-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Decentralized Identity & Documents</h2>
          </div>

          <Tabs defaultValue="identity" className="w-full">
            <TabsList className="bg-aave-light-blue/20 border border-aave-light-blue/50 mb-6">
              <TabsTrigger value="identity">DID Profile</TabsTrigger>
              <TabsTrigger value="documents">Document Verification</TabsTrigger>
            </TabsList>
            
            <TabsContent value="identity">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="bg-aave-blue-gray border-aave-light-blue col-span-1">
                  <CardHeader className="pb-2">
                    <CardTitle>Identity Summary</CardTitle>
                    <CardDescription className="text-gray-400">Your decentralized identity</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="flex flex-col items-center text-center mb-6">
                      <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-aave-accent mb-4">
                        <img 
                          src={userProfile.profilePic} 
                          alt={userProfile.name} 
                          className="h-full w-full object-cover" 
                        />
                      </div>
                      <h3 className="text-xl font-medium">{userProfile.name}</h3>
                      <div className="text-sm text-gray-400 mt-1">{userProfile.email}</div>
                      <div className="flex items-center mt-2">
                        <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/30 border-green-600/20">
                          <CheckCircle className="h-3 w-3 mr-1" /> KYC Verified
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <div className="text-xs text-gray-400">DID</div>
                        <div className="flex items-center justify-between bg-aave-darker p-2 rounded-md border border-aave-light-blue">
                          <span className="text-sm truncate">{userProfile.did}</span>
                          <Button variant="ghost" size="sm" className="h-6 px-2">
                            <Check className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="text-xs text-gray-400">Wallet Address</div>
                        <div className="flex items-center justify-between bg-aave-darker p-2 rounded-md border border-aave-light-blue">
                          <span className="text-sm truncate">{userProfile.walletAddress}</span>
                          <Button variant="ghost" size="sm" className="h-6 px-2">
                            <Check className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-gray-400">Country</div>
                          <div className="flex items-center mt-1">
                            <Globe className="h-4 w-4 mr-2 text-aave-accent" />
                            <span>{userProfile.country}</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400">Date of Birth</div>
                          <div className="flex items-center mt-1">
                            <Calendar className="h-4 w-4 mr-2 text-aave-accent" />
                            <span>{userProfile.dob}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-gray-400">Credit Score</div>
                          <div className="text-2xl font-semibold text-green-400">{userProfile.creditScore}</div>
                          <div className="text-xs text-gray-400">Excellent</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400">Trust Score</div>
                          <div className="text-2xl font-semibold text-aave-accent">{userProfile.trustScore}/100</div>
                          <div className="text-xs text-gray-400">High Trust</div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-gray-400 mb-1">Verification Progress</div>
                        <CustomProgress 
                          value={85} 
                          className="h-2 bg-aave-light-blue/30" 
                          indicatorClassName="bg-gradient-to-r from-aave-primary to-aave-secondary" 
                        />
                        <div className="flex justify-between mt-1 text-xs text-gray-400">
                          <span>Basic</span>
                          <span>Enhanced</span>
                          <span>Full</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-aave-blue-gray border-aave-light-blue col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle>Verified Credentials</CardTitle>
                    <CardDescription className="text-gray-400">
                      Documents and credentials linked to your decentralized identity
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Verified Documents</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {userProfile.documents.map((doc, index) => (
                          <div 
                            key={index}
                            className="flex items-start p-3 bg-aave-darker rounded-lg border border-aave-light-blue"
                          >
                            <div className={`p-2 rounded-lg mr-3 ${
                              doc.status === "Verified" 
                                ? "bg-green-500/20" 
                                : doc.status === "Pending" 
                                ? "bg-yellow-500/20" 
                                : "bg-red-500/20"
                            }`}>
                              <doc.icon className={`h-5 w-5 ${
                                doc.status === "Verified" 
                                  ? "text-green-400" 
                                  : doc.status === "Pending" 
                                  ? "text-yellow-400" 
                                  : "text-red-400"
                              }`} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium">{doc.type}</h4>
                                {doc.status === "Verified" && (
                                  <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/30">
                                    <CheckCircle className="h-3 w-3 mr-1" /> Verified
                                  </Badge>
                                )}
                                {doc.status === "Pending" && (
                                  <Badge className="bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30">
                                    <Clock className="h-3 w-3 mr-1" /> Pending
                                  </Badge>
                                )}
                              </div>
                              <div className="text-xs text-gray-400 mt-1">
                                Uploaded: {doc.uploadDate}
                              </div>
                              {doc.expiryDate && (
                                <div className="text-xs text-gray-400">
                                  Expires: {doc.expiryDate}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Required Documents</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {userProfile.requiredDocuments.map((doc, index) => (
                          <div 
                            key={index}
                            className="flex items-start p-3 bg-aave-darker rounded-lg border border-aave-light-blue"
                          >
                            <div className="p-2 rounded-lg bg-gray-500/20 mr-3">
                              <doc.icon className="h-5 w-5 text-gray-400" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium">{doc.type}</h4>
                                <Badge className="bg-gray-500/20 text-gray-400 hover:bg-gray-500/30">
                                  Required
                                </Badge>
                              </div>
                              <div className="text-xs text-gray-400 mt-1">
                                Status: Not Uploaded
                              </div>
                              <Button variant="outline" size="sm" className="mt-2 h-8 border-aave-accent text-aave-accent">
                                <Upload className="h-3 w-3 mr-1" /> Upload
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-aave-light-blue">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium">Increase Your Trust Score</h3>
                          <p className="text-sm text-gray-400 mt-1">
                            Submit additional documents to enhance your borrowing limits
                          </p>
                        </div>
                        <Button className="aave-button-gradient">
                          Submit Documents <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="documents">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="bg-aave-blue-gray border-aave-light-blue col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle>Document Upload</CardTitle>
                    <CardDescription className="text-gray-400">
                      Upload identification and financial documents to build your DID
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-6">
                    <div 
                      className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
                        dragActive 
                          ? "border-aave-accent bg-aave-accent/10" 
                          : "border-aave-light-blue hover:border-aave-accent hover:bg-aave-light-blue/10"
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <div className="flex flex-col items-center text-center">
                        <Upload className="h-12 w-12 text-aave-accent mb-4" />
                        <h3 className="text-lg font-medium mb-1">Glissez et déposez vos documents ici</h3>
                        <p className="text-gray-400 mb-4">
                          Support pour PDF (max 10MB)
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                          <input 
                            type="file" 
                            accept=".pdf" 
                            id="payslip-upload" 
                            className="hidden" 
                            onChange={handlePayslipInput}
                          />
                          <label 
                            htmlFor="payslip-upload"
                            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-aave-light-blue bg-background hover:bg-aave-accent/10 h-10 px-4 py-2 text-aave-accent cursor-pointer"
                          >
                            <Upload className="h-4 w-4 mr-2" /> Fiche de paie
                          </label>
                          
                          <input 
                            type="file" 
                            accept=".pdf" 
                            id="tax-return-upload" 
                            className="hidden" 
                            onChange={handleTaxReturnInput}
                          />
                          <label 
                            htmlFor="tax-return-upload"
                            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-aave-light-blue bg-background hover:bg-aave-accent/10 h-10 px-4 py-2 text-aave-accent cursor-pointer"
                          >
                            <Upload className="h-4 w-4 mr-2" /> Déclaration d'impôts
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-aave-accent"></div>
                          <span className="text-sm">Fiche de paie</span>
                        </div>
                        <div className="text-xs text-gray-400 truncate">
                          {payslipFile ? payslipFile.name : "Aucun fichier sélectionné"}
                        </div>
                      </div>
                      
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-aave-primary"></div>
                          <span className="text-sm">Déclaration d'impôts</span>
                        </div>
                        <div className="text-xs text-gray-400 truncate">
                          {taxReturnFile ? taxReturnFile.name : "Aucun fichier sélectionné"}
                        </div>
                      </div>
                      
                      <Button 
                        className="aave-button-gradient"
                        disabled={!payslipFile || !taxReturnFile || isAnalyzing}
                        onClick={handleAnalyzeDocuments}
                      >
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyse en cours...
                          </>
                        ) : (
                          <>
                            Analyser les documents <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                    
                    {renderAnalysisResults()}
                  </CardContent>
                </Card>

                <div className="space-y-6">
                  <Card className="bg-aave-blue-gray border-aave-light-blue">
                    <CardHeader className="pb-2">
                      <CardTitle>Statut des Documents</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-6">
                        <div className="flex items-center justify-center">
                          <div className="h-24 w-24 rounded-full bg-aave-accent/20 flex items-center justify-center">
                            {isAnalyzing ? (
                              <Loader2 className="h-10 w-10 text-aave-accent animate-spin" />
                            ) : analysisResult ? (
                              <CheckCircle className="h-10 w-10 text-green-400" />
                            ) : (
                              <AlertCircle className="h-10 w-10 text-aave-accent" />
                            )}
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <h3 className="text-lg font-medium mb-1">
                            {isAnalyzing ? "Analyse en cours" : 
                             analysisResult ? "Documents vérifiés" : "Vérification en attente"}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {isAnalyzing ? "Vos documents sont en cours d'analyse..." :
                             analysisResult ? "Vos documents ont été analysés avec succès" : 
                             "Veuillez télécharger vos documents pour l'analyse"}
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="text-xs text-gray-400 mb-1">Statut de vérification</div>
                          <CustomProgress 
                            value={analysisResult ? 100 : payslipFile && taxReturnFile ? 30 : payslipFile || taxReturnFile ? 15 : 0} 
                            className="h-2 bg-aave-light-blue/30" 
                            indicatorClassName="bg-gradient-to-r from-aave-primary to-aave-secondary" 
                          />
                          <div className="flex justify-between mt-1 text-xs text-gray-400">
                            <span>Non commencé</span>
                            <span>En cours</span>
                            <span>Terminé</span>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <div className={`h-6 w-6 rounded-full flex items-center justify-center mr-3 ${
                              payslipFile ? "bg-green-500/30" : "bg-gray-600/30"
                            }`}>
                              {payslipFile ? (
                                <Check className="h-4 w-4 text-green-400" />
                              ) : (
                                <XCircle className="h-4 w-4 text-gray-400" />
                              )}
                            </div>
                            <div>
                              <div className="text-sm">Fiche de paie</div>
                              <div className="text-xs text-gray-400">
                                {payslipFile ? "Téléchargé" : "Non téléchargé"}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <div className={`h-6 w-6 rounded-full flex items-center justify-center mr-3 ${
                              taxReturnFile ? "bg-green-500/30" : "bg-gray-600/30"
                            }`}>
                              {taxReturnFile ? (
                                <Check className="h-4 w-4 text-green-400" />
                              ) : (
                                <XCircle className="h-4 w-4 text-gray-400" />
                              )}
                            </div>
                            <div>
                              <div className="text-sm">Déclaration d'impôts</div>
                              <div className="text-xs text-gray-400">
                                {taxReturnFile ? "Téléchargé" : "Non téléchargé"}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <div className={`h-6 w-6 rounded-full flex items-center justify-center mr-3 ${
                              analysisResult ? "bg-green-500/30" : "bg-gray-600/30"
                            }`}>
                              {analysisResult ? (
                                <Check className="h-4 w-4 text-green-400" />
                              ) : (
                                <XCircle className="h-4 w-4 text-gray-400" />
                              )}
                            </div>
                            <div>
                              <div className="text-sm">Analyse financière</div>
                              <div className="text-xs text-gray-400">
                                {analysisResult ? "Terminée" : "En attente"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-aave-blue-gray border-aave-light-blue">
                    <CardHeader className="pb-2">
                      <CardTitle>Avantages de Vérification</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-aave-accent/20 flex items-center justify-center mr-3">
                            <Check className="h-5 w-5 text-aave-accent" />
                          </div>
                          <div>
                            <div className="font-medium">Limites d'emprunt plus élevées</div>
                            <div className="text-sm text-gray-400">Jusqu'à 100,000 USD</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-aave-accent/20 flex items-center justify-center mr-3">
                            <Check className="h-5 w-5 text-aave-accent" />
                          </div>
                          <div>
                            <div className="font-medium">Taux d'intérêt plus bas</div>
                            <div className="text-sm text-gray-400">Jusqu'à 3% de réduction</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-aave-accent/20 flex items-center justify-center mr-3">
                            <Check className="h-5 w-5 text-aave-accent" />
                          </div>
                          <div>
                            <div className="font-medium">Collatéral réduit</div>
                            <div className="text-sm text-gray-400">Exigences LTV plus basses</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-aave-accent/20 flex items-center justify-center mr-3">
                            <Check className="h-5 w-5 text-aave-accent" />
                          </div>
                          <div>
                            <div className="font-medium">Identité portable</div>
                            <div className="text-sm text-gray-400">Utilisable sur plusieurs plateformes DeFi</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </SidebarLayout>
  );
};

export default DIDDocuments;
