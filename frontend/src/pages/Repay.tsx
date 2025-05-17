
import React, { useState } from "react";
import SidebarLayout from "@/components/layout/SidebarLayout";
import Header from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  ArrowRight, 
  AlertCircle,
  CalendarClock, 
  CreditCard, 
  Wallet, 
  Calendar 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CustomProgress } from "@/components/ui/custom-progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Repay = () => {
  const { toast } = useToast();
  
  const handleRepay = () => {
    toast({
      title: "Demo Mode",
      description: "In a real application, this would initiate a repayment transaction.",
      variant: "default",
    });
  };

  // Demo loan data
  const activeLoan = {
    id: "LOAN-1234",
    asset: "USDC",
    logo: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
    originalAmount: 5000,
    outstandingAmount: 3200,
    repaidAmount: 1800,
    startDate: "2025-01-15",
    endDate: "2025-07-15",
    nextPaymentDue: "2025-05-25",
    nextPaymentAmount: 850,
    interestRate: "4.92%",
    progress: 36, // percentage repaid
    status: "Active",
    paymentHistory: [
      { date: "2025-02-15", amount: 850, status: "Paid" },
      { date: "2025-03-15", amount: 850, status: "Paid" },
      { date: "2025-04-15", amount: 850, status: "Late", daysLate: 2 },
      { date: "2025-05-15", amount: 850, status: "Pending" },
    ],
    collateral: {
      asset: "ETH",
      logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
      amount: 2.5,
      valueUSD: 6500,
      ltv: 76.9,
    }
  };

  // For demo purposes, we'll show the active loan
  const [showActiveLoan, setShowActiveLoan] = useState(true);

  return (
    <SidebarLayout>
      <div className="flex flex-col h-screen">
        <Header />
        <main className="flex-1 p-6 space-y-6 overflow-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Repay</h2>
          </div>

          {showActiveLoan ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-aave-blue-gray border-aave-light-blue col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-7 w-7 rounded-full overflow-hidden bg-white mr-2">
                        <img src={activeLoan.logo} alt={activeLoan.asset} className="h-full w-full object-contain" />
                      </div>
                      <span>{activeLoan.asset} Loan - {activeLoan.id}</span>
                    </div>
                    <div className="text-sm px-2 py-1 rounded bg-green-500/20 text-green-400">
                      {activeLoan.status}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-4">
                  <div className="space-y-5">
                    <div>
                      <h3 className="text-gray-400 text-sm mb-2">Repayment Progress</h3>
                      <CustomProgress 
                        value={activeLoan.progress} 
                        className="h-3 bg-aave-light-blue/30" 
                        indicatorClassName="bg-gradient-to-r from-aave-primary to-aave-secondary" 
                      />
                      <div className="flex justify-between mt-2 text-sm">
                        <div>
                          <span className="text-gray-400">Repaid: </span>
                          <span className="text-white">${activeLoan.repaidAmount}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Outstanding: </span>
                          <span className="text-white">${activeLoan.outstandingAmount}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Total: </span>
                          <span className="text-white">${activeLoan.originalAmount}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-aave-darker rounded-lg p-4 border border-aave-light-blue">
                        <div className="flex items-center mb-2">
                          <CalendarClock className="h-5 w-5 text-aave-accent mr-2" />
                          <h4 className="text-sm text-gray-400">Next Payment</h4>
                        </div>
                        <div className="text-lg font-semibold">${activeLoan.nextPaymentAmount}</div>
                        <div className="text-sm text-gray-400">Due {activeLoan.nextPaymentDue}</div>
                      </div>
                      
                      <div className="bg-aave-darker rounded-lg p-4 border border-aave-light-blue">
                        <div className="flex items-center mb-2">
                          <CreditCard className="h-5 w-5 text-aave-accent mr-2" />
                          <h4 className="text-sm text-gray-400">Interest Rate</h4>
                        </div>
                        <div className="text-lg font-semibold">{activeLoan.interestRate}</div>
                        <div className="text-sm text-gray-400">Fixed Rate</div>
                      </div>
                      
                      <div className="bg-aave-darker rounded-lg p-4 border border-aave-light-blue">
                        <div className="flex items-center mb-2">
                          <Calendar className="h-5 w-5 text-aave-accent mr-2" />
                          <h4 className="text-sm text-gray-400">Term</h4>
                        </div>
                        <div className="text-lg font-semibold">6 months</div>
                        <div className="text-sm text-gray-400">{activeLoan.startDate} - {activeLoan.endDate}</div>
                      </div>
                    </div>

                    <div className="rounded-lg border border-aave-light-blue">
                      <Table>
                        <TableHeader className="bg-aave-darker">
                          <TableRow className="border-b border-aave-light-blue">
                            <TableHead className="text-gray-400">Payment Date</TableHead>
                            <TableHead className="text-gray-400 text-right">Amount</TableHead>
                            <TableHead className="text-gray-400 text-right">Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {activeLoan.paymentHistory.map((payment, index) => (
                            <TableRow key={index} className="border-b border-aave-light-blue last:border-0">
                              <TableCell>{payment.date}</TableCell>
                              <TableCell className="text-right">${payment.amount}</TableCell>
                              <TableCell className="text-right">
                                {payment.status === "Paid" && (
                                  <span className="text-green-400">Paid</span>
                                )}
                                {payment.status === "Late" && (
                                  <span className="text-yellow-400 flex items-center justify-end">
                                    Late ({payment.daysLate} days)
                                    <AlertCircle className="h-4 w-4 ml-1" />
                                  </span>
                                )}
                                {payment.status === "Pending" && (
                                  <span className="text-aave-accent">Upcoming</span>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    <div className="flex justify-center">
                      <Button 
                        onClick={handleRepay}
                        className="aave-button-gradient px-8"
                      >
                        Make Payment (${activeLoan.nextPaymentAmount})
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="bg-aave-blue-gray border-aave-light-blue">
                  <CardHeader className="pb-2">
                    <CardTitle>Loan Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Loan ID</span>
                        <span>{activeLoan.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Original Amount</span>
                        <span>${activeLoan.originalAmount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Outstanding Balance</span>
                        <span>${activeLoan.outstandingAmount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Repayment Progress</span>
                        <span>{activeLoan.progress}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Payments Remaining</span>
                        <span>{4 - activeLoan.paymentHistory.filter(p => p.status === "Paid").length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-aave-blue-gray border-aave-light-blue">
                  <CardHeader className="pb-2">
                    <CardTitle>Collateral</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full overflow-hidden bg-white mr-2">
                          <img 
                            src={activeLoan.collateral.logo} 
                            alt={activeLoan.collateral.asset} 
                            className="h-full w-full object-contain" 
                          />
                        </div>
                        <div>
                          <div>{activeLoan.collateral.amount} {activeLoan.collateral.asset}</div>
                          <div className="text-sm text-gray-400">${activeLoan.collateral.valueUSD}</div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="border-aave-light-blue text-aave-accent">
                        View
                      </Button>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-400">Loan to Value (LTV)</span>
                        <span className="text-sm">{activeLoan.collateral.ltv}%</span>
                      </div>
                      <CustomProgress 
                        value={activeLoan.collateral.ltv} 
                        className="h-1.5 bg-aave-light-blue/30"
                        indicatorClassName={
                          activeLoan.collateral.ltv > 80 
                            ? "bg-red-500" 
                            : activeLoan.collateral.ltv > 70 
                            ? "bg-yellow-500" 
                            : "bg-green-500"
                        }
                      />
                      <div className="flex justify-between mt-1 text-xs text-gray-400">
                        <span>Safe</span>
                        <span>Moderate</span>
                        <span>At Risk</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-aave-blue-gray border-aave-light-blue">
                  <CardHeader className="pb-2">
                    <CardTitle>Repay Options</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <Button 
                        variant="outline"
                        className="w-full justify-between border-aave-light-blue hover:border-aave-accent"
                        onClick={handleRepay}
                      >
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>Make Scheduled Payment</span>
                        </div>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                      
                      <Button 
                        variant="outline"
                        className="w-full justify-between border-aave-light-blue hover:border-aave-accent"
                        onClick={handleRepay}
                      >
                        <div className="flex items-center">
                          <Wallet className="h-4 w-4 mr-2" />
                          <span>Repay Full Amount</span>
                        </div>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <Card className="bg-aave-blue-gray border-aave-light-blue">
              <CardContent className="flex flex-col items-center justify-center h-64 text-center p-8">
                <Clock className="h-12 w-12 text-aave-accent/70 mb-4" />
                <h3 className="text-xl font-medium mb-2">No Active Loans</h3>
                <p className="text-gray-400 mb-6">You don't have any active loans to repay</p>
                <Button 
                  className="aave-button-gradient"
                  onClick={() => window.location.href = '/borrow'}
                >
                  Apply for a Loan
                </Button>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </SidebarLayout>
  );
};

export default Repay;
