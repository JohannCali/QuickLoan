import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomProgress } from "@/components/ui/custom-progress";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from 'react-router-dom';

const Borrow: React.FC = () => {
  const [borrowAmount, setBorrowAmount] = useState('');
  const [collateralAmount, setCollateralAmount] = useState('');
  const [interestRate, setInterestRate] = useState(5.25);
  const [borrowLimit, setBorrowLimit] = useState(75);
  const [utilization, setUtilization] = useState(60);
  const [healthFactor, setHealthFactor] = useState(1.5);
  const [liquidationThreshold, setLiquidationThreshold] = useState(80);
  const [availableToBorrow, setAvailableToBorrow] = useState(5000);
  const [walletAddress, setWalletAddress] = useState('0xYourWalletAddress');
  const [transactionHash, setTransactionHash] = useState('');
  const [isBorrowing, setIsBorrowing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching data from an API or blockchain
    setTimeout(() => {
      setInterestRate(5.25);
      setBorrowLimit(75);
      setUtilization(60);
      setHealthFactor(1.5);
      setLiquidationThreshold(80);
      setAvailableToBorrow(5000);
    }, 500);
  }, []);

  const handleBorrow = async () => {
    setIsBorrowing(true);
    // Simulate a blockchain transaction
    setTimeout(() => {
      setTransactionHash('0xSimulatedTransactionHash');
      setIsBorrowing(false);
      toast({
        title: "Borrow Successful!",
        description: "Your transaction has been confirmed.",
      })
    }, 2000);
  };

  const handleMaxBorrow = () => {
    setBorrowAmount(availableToBorrow.toString());
  };

  const handleViewTransaction = () => {
    if (transactionHash) {
      window.open(`https://etherscan.io/tx/${transactionHash}`, '_blank');
    }
  };

  const handleNavigateToRepay = () => {
    navigate('/repay');
  };

  const handleCalculate = () => {
    // Placeholder for calculate logic
    alert('Calculation logic will be implemented here.');
  };

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Borrow Form */}
        <Card className="aave-card">
          <CardHeader>
            <CardTitle>Borrow Assets</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="borrowAmount">Borrow Amount</Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  id="borrowAmount"
                  placeholder="Enter amount"
                  value={borrowAmount}
                  onChange={(e) => setBorrowAmount(e.target.value)}
                />
                <Button variant="secondary" size="sm" onClick={handleMaxBorrow}>
                  Max
                </Button>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="collateralAmount">Collateral Amount</Label>
              <Input
                type="number"
                id="collateralAmount"
                placeholder="Enter amount"
                value={collateralAmount}
                onChange={(e) => setCollateralAmount(e.target.value)}
              />
            </div>
            <Button className="w-full aave-button-gradient text-white" onClick={handleBorrow} disabled={isBorrowing}>
              {isBorrowing ? 'Borrowing...' : 'Borrow'}
            </Button>
            {transactionHash && (
              <Button variant="link" onClick={handleViewTransaction}>
                View Transaction
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Borrow Status */}
        <Card className="aave-card">
          <CardHeader>
            <CardTitle>Borrow Status</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Wallet Address</p>
              <p className="text-sm text-muted-foreground">{walletAddress}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Available to Borrow</p>
              <p className="text-sm text-muted-foreground">{availableToBorrow} USDT</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Interest Rate</p>
              <p className="text-sm text-muted-foreground">{interestRate}%</p>
            </div>
            <Button className="w-full aave-button-gradient text-white" onClick={handleNavigateToRepay}>
              Repay
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Risk Parameters */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Risk Parameters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="aave-card">
            <CardHeader>
              <CardTitle>Borrow Limit</CardTitle>
            </CardHeader>
            <CardContent>
              <CustomProgress value={borrowLimit} />
              <p className="text-sm text-muted-foreground mt-2">{borrowLimit}%</p>
            </CardContent>
          </Card>

          <Card className="aave-card">
            <CardHeader>
              <CardTitle>Utilization</CardTitle>
            </CardHeader>
            <CardContent>
              <CustomProgress value={utilization} />
              <p className="text-sm text-muted-foreground mt-2">{utilization}%</p>
            </CardContent>
          </Card>

          <Card className="aave-card">
            <CardHeader>
              <CardTitle>Health Factor</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{healthFactor}</p>
              <p className="text-sm text-muted-foreground mt-2">Ideal: Above 1.0</p>
            </CardContent>
          </Card>

          <Card className="aave-card">
            <CardHeader>
              <CardTitle>Liquidation Threshold</CardTitle>
            </CardHeader>
            <CardContent>
              <CustomProgress value={liquidationThreshold} />
              <p className="text-sm text-muted-foreground mt-2">{liquidationThreshold}%</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Transaction History */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Date</TableHead>
              <TableHead>Transaction Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">2024-01-01</TableCell>
              <TableCell>Borrow</TableCell>
              <TableCell>1000 USDT</TableCell>
              <TableCell>
                <Badge variant="default">Completed</Badge>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">2024-01-15</TableCell>
              <TableCell>Repay</TableCell>
              <TableCell>500 USDT</TableCell>
              <TableCell>
                <Badge variant="outline">Pending</Badge>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* FAQ Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>What is borrowing in this context?</AccordionTrigger>
            <AccordionContent>
              Borrowing allows you to take out assets from the platform by providing collateral.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>How is the interest rate calculated?</AccordionTrigger>
            <AccordionContent>
              The interest rate is determined by the utilization rate of the asset.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>What is a health factor?</AccordionTrigger>
            <AccordionContent>
              A health factor indicates the safety of your deposited collateral against your borrowed assets.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Calculate Button */}
      <div className="mt-8">
        <Button className="aave-button-gradient text-white" onClick={handleCalculate}>
          Calculate
        </Button>
      </div>
    </div>
  );
};

export default Borrow;
