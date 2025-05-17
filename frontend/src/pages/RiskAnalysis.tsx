import React, { useState } from "react";
import SidebarLayout from "@/components/layout/SidebarLayout";
import Header from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  User, 
  Calendar, 
  Wallet, 
  FileText, 
  ArrowRight, 
  PieChart,
  DollarSign,
  Percent,
  Clock,
  BadgeCheck,
  Building,
  CircleDollarSign,
} from "lucide-react";
import { CustomProgress } from "@/components/ui/custom-progress";
import { useToast } from "@/hooks/use-toast";
import { Check } from "lucide-react";

const RiskAnalysis = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [userAddress, setUserAddress] = useState("");
  
  const handleSearch = () => {
    if (searchQuery) {
      setUserAddress(searchQuery);
      toast({
        title: "Demo Mode",
        description: "In a real application, this would fetch the risk analysis for this address.",
        variant: "default",
      });
    }
  };

  // Mock data for risk analysis
  const riskData = {
    user: "Julien Durand",
    address: "0x9Ac4b6.....7d8",
    totalScore: 74.5,
    lastUpdated: "2025-05-16",
    eligibleAmount: 34200,
    maxLoan: 100000,
    scoreComponents: {
      offChain: {
        score: 74.5,
        weight: 0.9,
        subcategories: [
          {
            name: "Income Assessment",
            score: 32,
            maxPoints: 40,
            description: "Based on monthly income of $8,000",
          },
          {
            name: "Debt-to-Income Ratio",
            score: 22.5,
            maxPoints: 30,
            description: "25% debt-to-income ratio ($2,000 / $8,000)",
          },
          {
            name: "Employment Stability",
            score: 10,
            maxPoints: 20,
            description: "5 years at current employment",
          },
          {
            name: "Documentation Quality",
            score: 10,
            maxPoints: 10,
            description: "Complete documentation provided",
          },
        ]
      },
      onChain: {
        score: 58.3,
        weight: 0.1,
        subcategories: [
          {
            name: "Wallet Activity",
            score: 25,
            maxPoints: 50,
            description: "500 transactions in wallet history",
          },
          {
            name: "Wallet Age",
            score: 33.3,
            maxPoints: 50,
            description: "2 years old wallet",
          },
        ]
      }
    },
    bonusMalus: {
      factor: 0.06,
      components: [
        {
          name: "Protocol Engagement",
          value: 0.01,
          description: "1 year on protocol",
        },
        {
          name: "Repayment History",
          value: 0.05,
          description: "100% on-time payments",
        },
        {
          name: "Previous Loans",
          value: 0,
          description: "No previous loans",
        },
      ]
    },
    recommendations: [
      "Eligible for maximum loan amount based on income and stability",
      "Strong on-chain history improves trust score",
      "Perfect repayment history qualifies for bonus rate",
      "Consider increasing collateral to reduce interest rate further"
    ],
    recentTransactions: [
      {
        date: "2025-05-10",
        type: "DEX Swap",
        amount: "2.5 ETH → 4,500 USDC"
      },
      {
        date: "2025-04-28",
        type: "Yield Deposit",
        amount: "10,000 USDC to Compound"
      },
      {
        date: "2025-04-15",
        type: "NFT Purchase",
        amount: "0.8 ETH"
      },
    ],
  };

  // Calculate percentages for visualization
  const offChainPercent = riskData.scoreComponents.offChain.score;
  const onChainPercent = riskData.scoreComponents.onChain.score;
  const totalWeightedScore = (offChainPercent * riskData.scoreComponents.offChain.weight) + 
                            (onChainPercent * riskData.scoreComponents.onChain.weight);

  // Calculate how much of max loan is approved
  const eligibilityPercent = (riskData.eligibleAmount / riskData.maxLoan) * 100;

  return (
    <SidebarLayout>
      <div className="flex flex-col h-screen">
        <Header />
        <main className="flex-1 p-6 space-y-6 overflow-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Risk Analysis</h2>
            <div className="flex space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  className="pl-9 bg-aave-blue-gray border-aave-light-blue text-white w-64"
                  placeholder="Search by wallet or DID..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button 
                className="aave-button-gradient"
                onClick={handleSearch}
              >
                Analyze
              </Button>
            </div>
          </div>

          {userAddress ? (
            <div className="space-y-6">
              <Card className="bg-aave-blue-gray border-aave-light-blue">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Borrower Risk Analysis</CardTitle>
                      <CardDescription className="text-gray-400">
                        Comprehensive credit assessment for {riskData.user}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm text-gray-400">Last Updated</div>
                        <div>{riskData.lastUpdated}</div>
                      </div>
                      <Button variant="outline" className="border-aave-accent text-aave-accent">
                        <FileText className="h-4 w-4 mr-2" />
                        Export Report
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-1">
                      <div className="space-y-6">
                        <div className="bg-aave-darker rounded-lg p-4 border border-aave-light-blue">
                          <div className="text-center mb-4">
                            <div className="text-gray-400 text-sm">Total Risk Score</div>
                            <div className="text-5xl font-bold text-aave-accent mt-2">{Math.round(totalWeightedScore * 10) / 10}</div>
                            <div className="text-sm text-gray-400 mt-1">out of 100</div>
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Off-Chain Score</span>
                                <span>{riskData.scoreComponents.offChain.score} / 100</span>
                              </div>
                              <CustomProgress 
                                value={riskData.scoreComponents.offChain.score} 
                                className="h-2 bg-aave-light-blue/30" 
                                indicatorClassName="bg-aave-accent" 
                              />
                              <div className="text-xs text-gray-400 mt-1">
                                Weighted: {riskData.scoreComponents.offChain.weight * 100}%
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>On-Chain Score</span>
                                <span>{riskData.scoreComponents.onChain.score} / 100</span>
                              </div>
                              <CustomProgress 
                                value={riskData.scoreComponents.onChain.score} 
                                className="h-2 bg-aave-light-blue/30" 
                                indicatorClassName="bg-green-400" 
                              />
                              <div className="text-xs text-gray-400 mt-1">
                                Weighted: {riskData.scoreComponents.onChain.weight * 100}%
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-aave-darker rounded-lg p-4 border border-aave-light-blue">
                          <div className="flex items-center mb-3">
                            <User className="h-5 w-5 text-aave-accent mr-2" />
                            <h3 className="font-medium">Borrower Details</h3>
                          </div>
                          
                          <div className="space-y-3">
                            <div>
                              <div className="text-xs text-gray-400">Name</div>
                              <div>{riskData.user}</div>
                            </div>
                            
                            <div>
                              <div className="text-xs text-gray-400">Wallet Address</div>
                              <div className="text-sm truncate">{riskData.address}</div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <div className="text-xs text-gray-400">Employment</div>
                                <div className="flex items-center">
                                  <Building className="h-3 w-3 mr-1 text-gray-400" />
                                  <span>5 years</span>
                                </div>
                              </div>
                              
                              <div>
                                <div className="text-xs text-gray-400">Wallet Age</div>
                                <div className="flex items-center">
                                  <Clock className="h-3 w-3 mr-1 text-gray-400" />
                                  <span>2 years</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <div className="text-xs text-gray-400">Income</div>
                                <div className="flex items-center">
                                  <DollarSign className="h-3 w-3 mr-1 text-gray-400" />
                                  <span>$8,000/mo</span>
                                </div>
                              </div>
                              
                              <div>
                                <div className="text-xs text-gray-400">DTI Ratio</div>
                                <div className="flex items-center">
                                  <Percent className="h-3 w-3 mr-1 text-gray-400" />
                                  <span>25%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-aave-darker rounded-lg p-4 border border-aave-light-blue">
                          <div className="flex items-center mb-3">
                            <Wallet className="h-5 w-5 text-aave-accent mr-2" />
                            <h3 className="font-medium">Recent Transactions</h3>
                          </div>
                          
                          <div className="space-y-3">
                            {riskData.recentTransactions.map((tx, index) => (
                              <div key={index} className="border-b border-aave-light-blue/50 pb-2 last:border-0 last:pb-0">
                                <div className="text-sm">{tx.type}</div>
                                <div className="text-xs text-gray-400">{tx.date}</div>
                                <div className="text-xs">{tx.amount}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="lg:col-span-3 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-aave-darker rounded-lg p-4 border border-aave-light-blue text-center">
                          <div className="text-sm text-gray-400 mb-1">Eligible Loan Amount</div>
                          <div className="text-3xl font-bold">${riskData.eligibleAmount.toLocaleString()}</div>
                          <CustomProgress 
                            value={eligibilityPercent} 
                            className="h-1.5 bg-aave-light-blue/30 my-2" 
                            indicatorClassName="bg-green-400" 
                          />
                          <div className="text-xs text-gray-400">{eligibilityPercent.toFixed(0)}% of maximum</div>
                        </div>
                        
                        <div className="bg-aave-darker rounded-lg p-4 border border-aave-light-blue text-center">
                          <div className="text-sm text-gray-400 mb-1">Loyalty Factor</div>
                          <div className="text-3xl font-bold">+{(riskData.bonusMalus.factor * 100).toFixed(0)}%</div>
                          <div className="flex items-center justify-center mt-2">
                            <BadgeCheck className="h-4 w-4 text-green-400 mr-1" />
                            <div className="text-xs text-green-400">Positive history</div>
                          </div>
                        </div>
                        
                        <div className="bg-aave-darker rounded-lg p-4 border border-aave-light-blue text-center">
                          <div className="text-sm text-gray-400 mb-1">Monthly Payment Capacity</div>
                          <div className="text-3xl font-bold">$1,778</div>
                          <div className="text-xs text-gray-400 mt-2">22.2% of monthly income</div>
                        </div>
                      </div>
                      
                      <Card className="bg-aave-darker border-aave-light-blue">
                        <CardHeader className="pb-2">
                          <CardTitle>Score Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <Tabs defaultValue="offchain">
                            <TabsList className="bg-aave-blue-gray mb-4">
                              <TabsTrigger value="offchain">Off-Chain (90%)</TabsTrigger>
                              <TabsTrigger value="onchain">On-Chain (10%)</TabsTrigger>
                              <TabsTrigger value="bonus">Bonus/Malus</TabsTrigger>
                            </TabsList>
                            
                            <TabsContent value="offchain" className="space-y-4">
                              {riskData.scoreComponents.offChain.subcategories.map((category, index) => (
                                <div key={index} className="border-b border-aave-light-blue pb-3 last:border-0">
                                  <div className="flex justify-between mb-1">
                                    <div className="font-medium">{category.name}</div>
                                    <div className="text-aave-accent">{category.score} / {category.maxPoints}</div>
                                  </div>
                                  <CustomProgress 
                                    value={(category.score / category.maxPoints) * 100} 
                                    className="h-1.5 bg-aave-light-blue/30" 
                                    indicatorClassName="bg-aave-accent" 
                                  />
                                  <div className="text-xs text-gray-400 mt-1">{category.description}</div>
                                </div>
                              ))}
                              <div className="pt-2">
                                <div className="flex justify-between font-medium">
                                  <div>Total Off-Chain Score</div>
                                  <div>{riskData.scoreComponents.offChain.score} / 100</div>
                                </div>
                                <div className="text-xs text-gray-400 mt-1">
                                  Factors in income, debt ratio, employment stability and document completeness
                                </div>
                              </div>
                            </TabsContent>
                            
                            <TabsContent value="onchain" className="space-y-4">
                              {riskData.scoreComponents.onChain.subcategories.map((category, index) => (
                                <div key={index} className="border-b border-aave-light-blue pb-3 last:border-0">
                                  <div className="flex justify-between mb-1">
                                    <div className="font-medium">{category.name}</div>
                                    <div className="text-green-400">{category.score} / {category.maxPoints}</div>
                                  </div>
                                  <CustomProgress 
                                    value={(category.score / category.maxPoints) * 100} 
                                    className="h-1.5 bg-aave-light-blue/30" 
                                    indicatorClassName="bg-green-400" 
                                  />
                                  <div className="text-xs text-gray-400 mt-1">{category.description}</div>
                                </div>
                              ))}
                              <div className="pt-2">
                                <div className="flex justify-between font-medium">
                                  <div>Total On-Chain Score</div>
                                  <div>{riskData.scoreComponents.onChain.score} / 100</div>
                                </div>
                                <div className="text-xs text-gray-400 mt-1">
                                  Based on blockchain transaction history and wallet activity metrics
                                </div>
                              </div>
                            </TabsContent>
                            
                            <TabsContent value="bonus" className="space-y-4">
                              {riskData.bonusMalus.components.map((component, index) => (
                                <div key={index} className="border-b border-aave-light-blue pb-3 last:border-0">
                                  <div className="flex justify-between mb-1">
                                    <div className="font-medium">{component.name}</div>
                                    <div className={component.value >= 0 ? "text-green-400" : "text-red-400"}>
                                      {component.value >= 0 ? "+" : ""}{(component.value * 100).toFixed(0)}%
                                    </div>
                                  </div>
                                  <div className="text-xs text-gray-400">{component.description}</div>
                                </div>
                              ))}
                              <div className="pt-2">
                                <div className="flex justify-between font-medium">
                                  <div>Total Adjustment Factor</div>
                                  <div className={riskData.bonusMalus.factor >= 0 ? "text-green-400" : "text-red-400"}>
                                    {riskData.bonusMalus.factor >= 0 ? "+" : ""}{(riskData.bonusMalus.factor * 100).toFixed(0)}%
                                  </div>
                                </div>
                                <div className="text-xs text-gray-400 mt-1">
                                  Applied to the final loan amount based on protocol usage history
                                </div>
                              </div>
                            </TabsContent>
                          </Tabs>
                        </CardContent>
                      </Card>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="bg-aave-darker border-aave-light-blue">
                          <CardHeader className="pb-2">
                            <CardTitle>Loan Recommendation</CardTitle>
                          </CardHeader>
                          <CardContent className="pt-4">
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4 mb-2">
                                <div>
                                  <div className="text-sm text-gray-400">Maximum Amount</div>
                                  <div className="text-2xl font-semibold">${riskData.eligibleAmount.toLocaleString()}</div>
                                </div>
                                <div>
                                  <div className="text-sm text-gray-400">Monthly Payment</div>
                                  <div className="text-2xl font-semibold">$622</div>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <div className="text-sm text-gray-400">Recommended Term</div>
                                  <div className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-1 text-aave-accent" />
                                    <span>60 months</span>
                                  </div>
                                </div>
                                <div>
                                  <div className="text-sm text-gray-400">Interest Rate</div>
                                  <div className="flex items-center">
                                    <Percent className="h-4 w-4 mr-1 text-aave-accent" />
                                    <span>4.92%</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <div className="text-sm text-gray-400">Collateral Needed</div>
                                  <div className="flex items-center">
                                    <CircleDollarSign className="h-4 w-4 mr-1 text-aave-accent" />
                                    <span>$10,000 (29.2%)</span>
                                  </div>
                                </div>
                                <div>
                                  <div className="text-sm text-gray-400">Decision</div>
                                  <div className="text-green-400 flex items-center">
                                    <BadgeCheck className="h-4 w-4 mr-1" />
                                    <span>Approved</span>
                                  </div>
                                </div>
                              </div>
                              
                              <Button className="w-full aave-button-gradient">
                                Generate Loan Agreement
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="bg-aave-darker border-aave-light-blue">
                          <CardHeader className="pb-2">
                            <CardTitle>Analysis Insights</CardTitle>
                          </CardHeader>
                          <CardContent className="pt-4">
                            <div className="space-y-2 mb-4">
                              {riskData.recommendations.map((rec, index) => (
                                <div key={index} className="flex items-start">
                                  <div className="h-5 w-5 rounded-full bg-aave-accent/20 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                                    <Check className="h-3 w-3 text-aave-accent" />
                                  </div>
                                  <p className="text-sm">{rec}</p>
                                </div>
                              ))}
                            </div>
                            
                            <div className="pt-4 border-t border-aave-light-blue">
                              <div className="flex justify-between items-center">
                                <div>
                                  <div className="font-medium">Risk Assessment</div>
                                  <div className="text-sm text-gray-400">AI Credit Scoring Model</div>
                                </div>
                                <Button variant="outline" className="border-aave-accent text-aave-accent" size="sm">
                                  <PieChart className="h-4 w-4 mr-2" />
                                  Full Analysis
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="bg-aave-blue-gray border-aave-light-blue">
              <CardContent className="flex flex-col items-center justify-center h-80 text-center p-8">
                <ArrowRight className="h-16 w-16 text-aave-accent/40 mb-6" />
                <h3 className="text-xl font-medium mb-2">Enter a wallet address to analyze</h3>
                <p className="text-gray-400 mb-6 max-w-md">
                  Search for a wallet address or DID to perform a comprehensive risk analysis
                  using our hybrid on-chain and off-chain scoring model.
                </p>
                <div className="flex w-full max-w-md">
                  <Input 
                    className="bg-aave-blue-gray border-aave-light-blue text-white mr-2"
                    placeholder="0x..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button 
                    className="aave-button-gradient whitespace-nowrap"
                    onClick={handleSearch}
                  >
                    Analyze Risk
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </SidebarLayout>
  );
};

export default RiskAnalysis;
