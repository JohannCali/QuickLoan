
import React, { useState } from "react";
import SidebarLayout from "@/components/layout/SidebarLayout";
import Header from "@/components/layout/Header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Search, ArrowRight, ArrowUpRight } from "lucide-react";

interface AssetData {
  name: string;
  symbol: string;
  logo: string;
  totalSupply: string;
  supplyApy: string;
  totalBorrow: string;
  borrowApy: string;
  aiRiskScore: number;
}

const Markets = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const marketData: AssetData[] = [
    {
      name: "Ethereum",
      symbol: "ETH",
      logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
      totalSupply: "$621.5M",
      supplyApy: "1.26%",
      totalBorrow: "$218.7M",
      borrowApy: "2.52%",
      aiRiskScore: 95
    },
    {
      name: "USD Coin",
      symbol: "USDC",
      logo: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
      totalSupply: "$894.3M",
      supplyApy: "3.75%",
      totalBorrow: "$463.5M",
      borrowApy: "4.92%",
      aiRiskScore: 98
    },
    {
      name: "Wrapped Bitcoin",
      symbol: "WBTC",
      logo: "https://cryptologos.cc/logos/wrapped-bitcoin-wbtc-logo.png",
      totalSupply: "$312.6M",
      supplyApy: "0.87%",
      totalBorrow: "$175.1M",
      borrowApy: "1.94%",
      aiRiskScore: 92
    },
    {
      name: "Dai",
      symbol: "DAI",
      logo: "https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png",
      totalSupply: "$432.8M",
      supplyApy: "3.41%",
      totalBorrow: "$289.2M",
      borrowApy: "4.63%",
      aiRiskScore: 97
    },
    {
      name: "Chainlink",
      symbol: "LINK",
      logo: "https://cryptologos.cc/logos/chainlink-link-logo.png",
      totalSupply: "$97.4M",
      supplyApy: "0.56%",
      totalBorrow: "$42.3M",
      borrowApy: "3.87%",
      aiRiskScore: 86
    },
    {
      name: "Uniswap",
      symbol: "UNI",
      logo: "https://cryptologos.cc/logos/uniswap-uni-logo.png",
      totalSupply: "$78.2M",
      supplyApy: "1.03%",
      totalBorrow: "$34.7M",
      borrowApy: "4.21%",
      aiRiskScore: 82
    },
    {
      name: "Aave",
      symbol: "AAVE",
      logo: "https://cryptologos.cc/logos/aave-aave-logo.png",
      totalSupply: "$109.8M",
      supplyApy: "2.15%",
      totalBorrow: "$58.6M",
      borrowApy: "5.37%",
      aiRiskScore: 91
    }
  ];

  const filteredData = marketData.filter(asset => 
    asset.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    asset.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRiskColor = (score: number) => {
    if (score >= 95) return "text-green-400";
    if (score >= 85) return "text-blue-400";
    if (score >= 70) return "text-yellow-400";
    return "text-red-400";
  };

  const getRiskLabel = (score: number) => {
    if (score >= 95) return "Very Low";
    if (score >= 85) return "Low";
    if (score >= 70) return "Medium";
    return "High";
  };

  return (
    <SidebarLayout>
      <div className="flex flex-col h-screen">
        <Header />
        <main className="flex-1 p-6 space-y-6 overflow-auto">
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Markets</h2>
              <div className="flex space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    className="pl-9 bg-aave-blue-gray border-aave-light-blue text-white w-64"
                    placeholder="Search assets..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <Tabs defaultValue="all">
              <TabsList className="bg-aave-light-blue/20 border border-aave-light-blue/50 mb-6">
                <TabsTrigger value="all">All Assets</TabsTrigger>
                <TabsTrigger value="stablecoins">Stablecoins</TabsTrigger>
                <TabsTrigger value="ethereum">Ethereum</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="p-0">
                <div className="rounded-xl border border-aave-light-blue overflow-hidden">
                  <Table>
                    <TableHeader className="bg-aave-darker">
                      <TableRow className="border-b border-aave-light-blue">
                        <TableHead className="text-gray-400">Asset</TableHead>
                        <TableHead className="text-gray-400 text-right">Total Supply</TableHead>
                        <TableHead className="text-gray-400 text-right">Supply APY</TableHead>
                        <TableHead className="text-gray-400 text-right">Total Borrow</TableHead>
                        <TableHead className="text-gray-400 text-right">Borrow APY</TableHead>
                        <TableHead className="text-gray-400 text-right">AI Risk Score</TableHead>
                        <TableHead className="text-gray-400 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData.map((asset) => (
                        <TableRow 
                          key={asset.symbol} 
                          className="border-b border-aave-light-blue last:border-0 hover:bg-aave-blue-gray/50"
                        >
                          <TableCell>
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full overflow-hidden bg-white mr-3 flex-shrink-0">
                                <img
                                  src={asset.logo}
                                  alt={asset.name}
                                  className="h-full w-full object-contain"
                                />
                              </div>
                              <div>
                                <div className="font-medium">{asset.name}</div>
                                <div className="text-gray-400 text-xs">{asset.symbol}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">{asset.totalSupply}</TableCell>
                          <TableCell className="text-right text-green-400">{asset.supplyApy}</TableCell>
                          <TableCell className="text-right">{asset.totalBorrow}</TableCell>
                          <TableCell className="text-right text-aave-primary">{asset.borrowApy}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end">
                              <span className={getRiskColor(asset.aiRiskScore)}>
                                {getRiskLabel(asset.aiRiskScore)}
                              </span>
                              <span className="bg-aave-darker ml-2 px-2 py-1 rounded text-xs">
                                {asset.aiRiskScore}/100
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 border-aave-secondary text-aave-secondary hover:bg-aave-secondary/10"
                              >
                                Supply
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 border-aave-primary text-aave-primary hover:bg-aave-primary/10"
                              >
                                Borrow
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="h-8 text-white/70 hover:text-white"
                              >
                                <ArrowUpRight className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="stablecoins">
                <div className="h-48 flex items-center justify-center">
                  <p className="text-gray-400">Stablecoin assets will be displayed here</p>
                </div>
              </TabsContent>
              
              <TabsContent value="ethereum">
                <div className="h-48 flex items-center justify-center">
                  <p className="text-gray-400">Ethereum assets will be displayed here</p>
                </div>
              </TabsContent>
            </Tabs>
          </section>
        </main>
      </div>
    </SidebarLayout>
  );
};

export default Markets;
