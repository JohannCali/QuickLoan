import React from "react";
import { Button } from "@/components/ui/button";
import { Wallet, Bell, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <header className="border-b border-aave-light-blue bg-aave-dark py-3 px-6 flex items-center justify-between font-inter">
      <div className="flex flex-col">
        <h1 className="text-lg font-medium">
          {title || "QuickLoan AI Credit Protocol"}
        </h1>
        {subtitle && (
          <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center space-x-3">
        <Button 
          className="h-9 bg-aave-light-blue hover:bg-aave-light-blue/80 text-white" 
          variant="outline"
        >
          <Bell className="h-4 w-4 mr-2" />
          <span>Alerts</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="h-9 bg-aave-primary hover:bg-aave-secondary text-white">
              <Wallet className="h-4 w-4 mr-2" />
              <span>Connect Wallet</span>
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-aave-darker border-aave-light-blue text-white">
            <DropdownMenuLabel>Wallet Options</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-aave-light-blue/50" />
            <DropdownMenuItem className="hover:bg-aave-light-blue/20 cursor-pointer">
              MetaMask
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-aave-light-blue/20 cursor-pointer">
              WalletConnect
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-aave-light-blue/20 cursor-pointer">
              Coinbase Wallet
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
