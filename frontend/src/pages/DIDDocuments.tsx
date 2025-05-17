
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
  Check
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomProgress } from "@/components/ui/custom-progress";

const DIDDocuments = () => {
  const { toast } = useToast();
  const [dragActive, setDragActive] = useState(false);
  
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
    
    toast({
      title: "Demo Mode",
      description: "In a real application, this would process your uploaded document.",
      variant: "default",
    });
  };
  
  const handleFileInput = () => {
    toast({
      title: "Demo Mode",
      description: "In a real application, this would open a file picker.",
      variant: "default",
    });
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
                        <h3 className="text-lg font-medium mb-1">Drag and drop files here</h3>
                        <p className="text-gray-400 mb-4">
                          Support for JPG, PNG, PDF (max 10MB)
                        </p>
                        <Button 
                          variant="outline" 
                          className="border-aave-light-blue text-aave-accent hover:bg-aave-accent/10"
                          onClick={handleFileInput}
                        >
                          <Upload className="h-4 w-4 mr-2" /> Select Files
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Required Documents</h3>
                      <div className="space-y-3">
                        <div className="bg-aave-darker p-4 rounded-lg border border-aave-light-blue">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <FileText className="h-5 w-5 mr-2 text-aave-accent" />
                              <h4 className="font-medium">Identification Document</h4>
                            </div>
                            <Badge className="bg-yellow-500/20 text-yellow-400">Required</Badge>
                          </div>
                          <p className="text-sm text-gray-400 mb-3">
                            Government-issued ID, passport, or driver's license
                          </p>
                          <Button variant="outline" className="border-aave-accent text-aave-accent">
                            <Upload className="h-4 w-4 mr-2" /> Upload ID
                          </Button>
                        </div>
                        
                        <div className="bg-aave-darker p-4 rounded-lg border border-aave-light-blue">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <FileText className="h-5 w-5 mr-2 text-aave-accent" />
                              <h4 className="font-medium">Proof of Income</h4>
                            </div>
                            <Badge className="bg-yellow-500/20 text-yellow-400">Required</Badge>
                          </div>
                          <p className="text-sm text-gray-400 mb-3">
                            Pay stub, employment verification, or tax return
                          </p>
                          <Button variant="outline" className="border-aave-accent text-aave-accent">
                            <Upload className="h-4 w-4 mr-2" /> Upload Proof
                          </Button>
                        </div>
                        
                        <div className="bg-aave-darker p-4 rounded-lg border border-aave-light-blue">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <FileText className="h-5 w-5 mr-2 text-aave-accent" />
                              <h4 className="font-medium">Bank Statement</h4>
                            </div>
                            <Badge className="bg-yellow-500/20 text-yellow-400">Required</Badge>
                          </div>
                          <p className="text-sm text-gray-400 mb-3">
                            Last 3 months of bank statements showing transaction history
                          </p>
                          <Button variant="outline" className="border-aave-accent text-aave-accent">
                            <Upload className="h-4 w-4 mr-2" /> Upload Statement
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Optional Documents</h3>
                      <p className="text-sm text-gray-400">
                        These documents can significantly improve your credit score and loan eligibility
                      </p>
                      
                      <div className="space-y-3">
                        <div className="bg-aave-darker p-4 rounded-lg border border-aave-light-blue">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <FileText className="h-5 w-5 mr-2 text-aave-accent" />
                              <h4 className="font-medium">Utility Bill</h4>
                            </div>
                            <Badge className="bg-aave-accent/20 text-aave-accent">Optional</Badge>
                          </div>
                          <p className="text-sm text-gray-400 mb-3">
                            Recent utility bill for address verification
                          </p>
                          <Button variant="outline" className="border-aave-light-blue text-white">
                            <Upload className="h-4 w-4 mr-2" /> Upload Bill
                          </Button>
                        </div>
                        
                        <div className="bg-aave-darker p-4 rounded-lg border border-aave-light-blue">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <FileText className="h-5 w-5 mr-2 text-aave-accent" />
                              <h4 className="font-medium">Tax Return</h4>
                            </div>
                            <Badge className="bg-aave-accent/20 text-aave-accent">Optional</Badge>
                          </div>
                          <p className="text-sm text-gray-400 mb-3">
                            Most recent tax return document
                          </p>
                          <Button variant="outline" className="border-aave-light-blue text-white">
                            <Upload className="h-4 w-4 mr-2" /> Upload Tax Return
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-6">
                  <Card className="bg-aave-blue-gray border-aave-light-blue">
                    <CardHeader className="pb-2">
                      <CardTitle>Verification Status</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-6">
                        <div className="flex items-center justify-center">
                          <div className="h-24 w-24 rounded-full bg-aave-accent/20 flex items-center justify-center">
                            <AlertCircle className="h-10 w-10 text-aave-accent" />
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <h3 className="text-lg font-medium mb-1">Verification Pending</h3>
                          <p className="text-sm text-gray-400">
                            Your documents need to be uploaded and verified
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="text-xs text-gray-400 mb-1">Verification Progress</div>
                          <CustomProgress 
                            value={15} 
                            className="h-2 bg-aave-light-blue/30" 
                            indicatorClassName="bg-gradient-to-r from-aave-primary to-aave-secondary" 
                          />
                          <div className="flex justify-between mt-1 text-xs text-gray-400">
                            <span>Not Started</span>
                            <span>In Progress</span>
                            <span>Complete</span>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <div className="h-6 w-6 rounded-full bg-gray-600/30 flex items-center justify-center mr-3">
                              <XCircle className="h-4 w-4 text-gray-400" />
                            </div>
                            <div>
                              <div className="text-sm">Identity Document</div>
                              <div className="text-xs text-gray-400">Not uploaded</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <div className="h-6 w-6 rounded-full bg-gray-600/30 flex items-center justify-center mr-3">
                              <XCircle className="h-4 w-4 text-gray-400" />
                            </div>
                            <div>
                              <div className="text-sm">Proof of Income</div>
                              <div className="text-xs text-gray-400">Not uploaded</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <div className="h-6 w-6 rounded-full bg-gray-600/30 flex items-center justify-center mr-3">
                              <XCircle className="h-4 w-4 text-gray-400" />
                            </div>
                            <div>
                              <div className="text-sm">Bank Statement</div>
                              <div className="text-xs text-gray-400">Not uploaded</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-aave-blue-gray border-aave-light-blue">
                    <CardHeader className="pb-2">
                      <CardTitle>DID Benefits</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-aave-accent/20 flex items-center justify-center mr-3">
                            <Check className="h-5 w-5 text-aave-accent" />
                          </div>
                          <div>
                            <div className="font-medium">Higher Loan Limits</div>
                            <div className="text-sm text-gray-400">Up to 100,000 USD</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-aave-accent/20 flex items-center justify-center mr-3">
                            <Check className="h-5 w-5 text-aave-accent" />
                          </div>
                          <div>
                            <div className="font-medium">Lower Interest Rates</div>
                            <div className="text-sm text-gray-400">Up to 3% reduction</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-aave-accent/20 flex items-center justify-center mr-3">
                            <Check className="h-5 w-5 text-aave-accent" />
                          </div>
                          <div>
                            <div className="font-medium">Reduced Collateral</div>
                            <div className="text-sm text-gray-400">Lower LTV requirements</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-aave-accent/20 flex items-center justify-center mr-3">
                            <Check className="h-5 w-5 text-aave-accent" />
                          </div>
                          <div>
                            <div className="font-medium">Portable Identity</div>
                            <div className="text-sm text-gray-400">Use across multiple DeFi platforms</div>
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
