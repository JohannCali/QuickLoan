
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Markets from "./pages/Markets";
import Schema from "./pages/Schema";
import CreditScoring from "./pages/CreditScoring";
import { SidebarProvider } from "@/components/ui/sidebar";
import Borrow from "./pages/Borrow";
import Supply from "./pages/Supply";
import Repay from "./pages/Repay";
import DIDDocuments from "./pages/DIDDocuments";
import RiskAnalysis from "./pages/RiskAnalysis";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/markets" element={<Markets />} />
            <Route path="/schema" element={<Schema />} />
            <Route path="/credit-scoring" element={<CreditScoring />} />
            
            <Route path="/borrow" element={<Borrow />} />
            <Route path="/supply" element={<Supply />} />
            <Route path="/repay" element={<Repay />} />
            <Route path="/did-documents" element={<DIDDocuments />} />
            <Route path="/risk-analysis" element={<RiskAnalysis />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
