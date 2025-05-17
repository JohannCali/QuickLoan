
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle, Loader2 } from "lucide-react";
import { CustomProgress } from "@/components/ui/custom-progress";

const Supply: React.FC = () => {
  const [amount, setAmount] = useState<number | "">("");
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [supplySuccess, setSupplySuccess] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isLoading) {
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += 10;
        setProgress(Math.min(currentProgress, 100));

        if (currentProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsLoading(false);
            setSupplySuccess(true);
            toast({
              title: "Supply Successful!",
              description: "Your supply transaction has been confirmed.",
            });
          }, 500);
        }
      }, 300);

      return () => clearInterval(interval);
    }
  }, [isLoading, toast]);

  const handleSupply = () => {
    setIsAlertDialogOpen(false);
    setIsLoading(true);

    // Simulate a button click after the progress bar completes
    setTimeout(() => {
      const buttonElement = document.getElementById("supply-button");
      if (buttonElement) {
        // Create and dispatch a custom event instead of using click()
        const customEvent = new Event('customClick');
        buttonElement.dispatchEvent(customEvent);
      }
    }, 3500);
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Supply Funds</CardTitle>
          <CardDescription>
            Increase your lending power by supplying funds to the protocol.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="amount">Amount to Supply</Label>
            <Input
              id="amount"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value === "" ? "" : Number(e.target.value))
              }
              type="number"
              placeholder="Enter amount"
            />
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                disabled={isLoading || !amount}
                onClick={() => setIsAlertDialogOpen(true)}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Supplying...
                  </>
                ) : (
                  "Supply Funds"
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmation</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to supply {amount} to the protocol? This
                  action is irreversible.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setIsAlertDialogOpen(false)}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleSupply}>Confirm</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {isLoading && (
            <div className="mt-4">
              <CustomProgress value={progress} />
              <p className="text-sm text-muted-foreground mt-2">
                Transaction in progress...
              </p>
            </div>
          )}

          {supplySuccess && (
            <div className="mt-4">
              <p className="text-green-500">
                Supply successful! Funds have been added to the protocol.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      <Button id="supply-button" style={{ display: 'none' }}>Hidden Button</Button>
    </div>
  );
};

export default Supply;
