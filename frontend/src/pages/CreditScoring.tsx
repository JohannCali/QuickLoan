
import React from "react";
import SidebarLayout from "@/components/layout/SidebarLayout";
import Header from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomProgress } from "@/components/ui/custom-progress";
import { Progress } from "@/components/ui/progress";
import { ArrowDown, ArrowUp, CheckCircle2, AlertCircle, ShieldCheck, History, FileText, Activity } from "lucide-react";

// Page mockup - structure only
const CreditScoring = () => {
  const creditScore = 780;
  const creditScorePercent = (creditScore - 300) / (850 - 300) * 100;
  
  return (
    <SidebarLayout>
      <div className="flex flex-col h-screen">
        <Header />
        <main className="flex-1 p-6 overflow-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold mb-2">AI Credit Scoring</h1>
            <p className="text-gray-400">
              Your decentralized credit profile powered by on-chain activity and verified documents
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Card className="bg-aave-blue-gray border-aave-light-blue col-span-2">
              <CardHeader className="pb-3">
                <CardTitle>Credit Score Overview</CardTitle>
                <CardDescription className="text-gray-400">
                  Your current credit score based on on-chain and off-chain data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="w-full md:w-1/2 flex flex-col items-center">
                    <div className="text-7xl font-bold text-center mb-4">
                      <span className="aave-gradient-text">{creditScore}</span>
                    </div>
                    <div className="text-sm text-center mb-2">
                      <span className="text-green-400 font-medium">Excellent</span>
                      <span className="text-gray-400"> - Top 15%</span>
                    </div>
                    <div className="w-full max-w-md mb-2">
                      <CustomProgress 
                        value={creditScorePercent} 
                        className="h-3 bg-aave-darker rounded-full"
                        indicatorClassName="bg-gradient-to-r from-aave-primary to-aave-secondary rounded-full"
                      />
                    </div>
                    <div className="w-full max-w-md flex justify-between text-xs text-gray-400">
                      <span>300</span>
                      <span>Poor</span>
                      <span>Fair</span>
                      <span>Good</span>
                      <span>Exc.</span>
                      <span>850</span>
                    </div>
                  </div>
                  
                  <div className="w-full md:w-1/2 flex flex-col gap-3">
                    <div className="flex items-center justify-between p-3 bg-aave-darker rounded-lg border border-aave-light-blue">
                      <div className="flex items-center">
                        <ShieldCheck className="h-5 w-5 mr-3 text-green-400" />
                        <span>On-Chain Trust Score</span>
                      </div>
                      <div className="font-semibold text-green-400">92/100</div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-aave-darker rounded-lg border border-aave-light-blue">
                      <div className="flex items-center">
                        <History className="h-5 w-5 mr-3 text-blue-400" />
                        <span>Repayment History</span>
                      </div>
                      <div className="font-semibold text-blue-400">100%</div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-aave-darker rounded-lg border border-aave-light-blue">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 mr-3 text-yellow-400" />
                        <span>Document Verification</span>
                      </div>
                      <div className="font-semibold text-yellow-400">Complete</div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-aave-darker rounded-lg border border-aave-light-blue">
                      <div className="flex items-center">
                        <Activity className="h-5 w-5 mr-3 text-aave-accent" />
                        <span>Current Active Loans</span>
                      </div>
                      <div className="font-semibold">1</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-aave-blue-gray border-aave-light-blue">
              <CardHeader className="pb-3">
                <CardTitle>Credit Factors</CardTitle>
                <CardDescription className="text-gray-400">
                  Factors affecting your credit score
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm flex items-center">
                      <ArrowUp className="h-4 w-4 text-green-400 mr-1.5" />
                      Positive Factors
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 text-green-400 mr-2" />
                      <span className="text-sm text-gray-300">Long-term wallet activity</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 text-green-400 mr-2" />
                      <span className="text-sm text-gray-300">Perfect repayment history</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 text-green-400 mr-2" />
                      <span className="text-sm text-gray-300">Verified income documents</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm flex items-center">
                      <ArrowDown className="h-4 w-4 text-red-400 mr-1.5" />
                      Areas to Improve
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 text-red-400 mr-2" />
                      <span className="text-sm text-gray-300">Limited transaction history</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="bg-aave-blue-gray border-aave-light-blue mb-6">
            <CardHeader className="pb-3">
              <CardTitle>Score History</CardTitle>
              <CardDescription className="text-gray-400">
                Your credit score change over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center">
                <div className="text-center">
                  <Activity className="h-16 w-16 mb-2 mx-auto text-aave-accent opacity-30" />
                  <p className="text-gray-400">Credit score history chart</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Tabs defaultValue="onchain" className="space-y-4">
            <TabsList className="bg-aave-light-blue/20 border border-aave-light-blue/50">
              <TabsTrigger value="onchain">On-Chain Data</TabsTrigger>
              <TabsTrigger value="offchain">Off-Chain Documents</TabsTrigger>
              <TabsTrigger value="loans">Loan History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="onchain" className="p-0">
              <Card className="bg-aave-blue-gray border-aave-light-blue">
                <CardHeader>
                  <CardTitle>On-Chain Activity Analysis</CardTitle>
                  <CardDescription>
                    How your blockchain activity contributes to your score
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center">
                      <Activity className="h-16 w-16 mb-2 mx-auto text-aave-accent opacity-30" />
                      <p className="text-gray-400">On-chain data would be displayed here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="offchain" className="p-0">
              <Card className="bg-aave-blue-gray border-aave-light-blue">
                <CardHeader>
                  <CardTitle>Verified Documents</CardTitle>
                  <CardDescription>
                    Your verified off-chain documents for enhanced borrowing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center">
                      <FileText className="h-16 w-16 mb-2 mx-auto text-aave-accent opacity-30" />
                      <p className="text-gray-400">Document verification status would be displayed here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="loans" className="p-0">
              <Card className="bg-aave-blue-gray border-aave-light-blue">
                <CardHeader>
                  <CardTitle>Loan History</CardTitle>
                  <CardDescription>
                    Your past and current loans
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center">
                      <History className="h-16 w-16 mb-2 mx-auto text-aave-accent opacity-30" />
                      <p className="text-gray-400">Loan history would be displayed here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </SidebarLayout>
  );
}

export default CreditScoring;
