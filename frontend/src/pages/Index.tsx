
import React from "react";
import SidebarLayout from "@/components/layout/SidebarLayout";
import Header from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Download, BarChart3, Activity, Wallet, Star } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const marketStats = [
    { label: "Total Market Size", value: "$3.42B" },
    { label: "Total Borrowing", value: "$1.86B" },
    { label: "Total Available", value: "$1.56B" },
    { label: "AI Credit Issued", value: "$142.5M" },
  ];

  return (
    <SidebarLayout>
      <div className="flex flex-col h-screen">
        <Header />
        <main className="flex-1 p-6 space-y-6 overflow-auto">
          <section className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Dashboard</h2>
              <div className="flex space-x-3">
                <Button variant="outline" className="border-aave-light-blue text-white">
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
                <Button className="aave-button-gradient">
                  Connect Wallet
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {marketStats.map((stat, index) => (
                <Card key={index} className="bg-aave-blue-gray border-aave-light-blue">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-normal text-gray-400">{stat.label}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-semibold">{stat.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-aave-blue-gray border-aave-light-blue col-span-2">
                <CardHeader className="pb-2 flex flex-row justify-between items-center">
                  <CardTitle>Protocol Overview</CardTitle>
                  <Button variant="ghost" size="sm" className="text-aave-accent">
                    View All <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="h-16 w-16 mb-2 mx-auto text-aave-accent opacity-30" />
                      <p className="text-gray-400">Protocol metrics visualization</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-aave-blue-gray border-aave-light-blue">
                <CardHeader className="pb-2">
                  <CardTitle>AI Credit Scoring</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-aave-darker rounded-lg border border-aave-light-blue">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm text-gray-400">Your Risk Score</div>
                        <div className="text-aave-secondary font-medium">Excellent</div>
                      </div>
                      <div className="w-full h-2 bg-aave-light-blue/30 rounded-full overflow-hidden">
                        <div className="h-full w-4/5 bg-gradient-to-r from-aave-primary to-aave-secondary"></div>
                      </div>
                      <div className="flex justify-between mt-1 text-xs text-gray-400">
                        <div>300</div>
                        <div>850</div>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <Link to="/borrow" className="flex items-center justify-between p-3 bg-aave-darker rounded-lg border border-aave-light-blue hover:border-aave-accent hover:bg-aave-darker/80 transition-all">
                        <div className="flex items-center">
                          <Activity className="h-5 w-5 mr-3 text-aave-accent" />
                          <span>Borrow Assets</span>
                        </div>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                      
                      <Link to="/supply" className="flex items-center justify-between p-3 bg-aave-darker rounded-lg border border-aave-light-blue hover:border-aave-accent hover:bg-aave-darker/80 transition-all">
                        <div className="flex items-center">
                          <Wallet className="h-5 w-5 mr-3 text-aave-accent" />
                          <span>Supply Assets</span>
                        </div>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                      
                      <Link to="/credit-scoring" className="flex items-center justify-between p-3 bg-aave-darker rounded-lg border border-aave-light-blue hover:border-aave-accent hover:bg-aave-darker/80 transition-all">
                        <div className="flex items-center">
                          <Star className="h-5 w-5 mr-3 text-aave-accent" />
                          <span>View Credit Score</span>
                        </div>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </main>
      </div>
    </SidebarLayout>
  );
};

export default Dashboard;
