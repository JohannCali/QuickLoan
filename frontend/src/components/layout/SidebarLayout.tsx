
import React from "react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Activity,
  BarChart3,
  Database,
  FileText,
  Home,
  Wallet,
  CreditCard,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";

const mainMenuItems = [
  { title: "Dashboard", icon: Home, url: "/" },
  { title: "Markets", icon: BarChart3, url: "/markets" },
  { title: "Model Schema", icon: Database, url: "/schema" },
];

const lendingItems = [
  { title: "Borrow", icon: CreditCard, url: "/borrow" },
  { title: "Supply", icon: Wallet, url: "/supply" },
  { title: "Repay", icon: Activity, url: "/repay" },
];

const aiItems = [
  { title: "AI Credit Scoring", icon: Star, url: "/credit-scoring" },
  { title: "DID & Documents", icon: FileText, url: "/did-documents" },
  { title: "Risk Analysis", icon: Activity, url: "/risk-analysis" },
];

const SidebarLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const isGroupActive = (items: any[]) => items.some(item => isActive(item.url));
  
  const getNavClass = ({ isActive }: { isActive: boolean }) => 
    cn("flex items-center py-2 px-3 rounded-lg transition-colors font-inter", 
      isActive 
        ? "bg-aave-primary/10 text-aave-primary font-medium" 
        : "text-gray-300 hover:bg-aave-blue-gray hover:text-white"
    );

  // Check if sidebar is collapsed
  const isSidebarCollapsed = false; // We'll use this directly since 'collapsed' isn't available

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar
        className={cn(
          "border-r border-aave-light-blue transition-all duration-300",
          isSidebarCollapsed ? "w-16" : "w-64"
        )}
      >
        <div className={cn("flex items-center p-4", isSidebarCollapsed ? "justify-center" : "")}>
          {!isSidebarCollapsed ? (
            <div className="font-bold text-xl quickloan-gradient">QuickLoan</div>
          ) : (
            <div className="h-8 w-8 bg-gradient-to-br from-aave-primary to-aave-secondary rounded-full"></div>
          )}
          <SidebarTrigger className="ml-auto text-gray-400 hover:text-white" />
        </div>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className={cn("text-gray-400 text-xs", isSidebarCollapsed && "sr-only")}>
              Main
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {mainMenuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} end className={getNavClass}>
                        <item.icon className="mr-2 h-4 w-4" />
                        {!isSidebarCollapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className={cn("text-gray-400 text-xs", isSidebarCollapsed && "sr-only")}>
              Lending
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {lendingItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} end className={getNavClass}>
                        <item.icon className="mr-2 h-4 w-4" />
                        {!isSidebarCollapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className={cn("text-gray-400 text-xs", isSidebarCollapsed && "sr-only")}>
              AI Credit System
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {aiItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} end className={getNavClass}>
                        <item.icon className="mr-2 h-4 w-4" />
                        {!isSidebarCollapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
};

export default SidebarLayout;
