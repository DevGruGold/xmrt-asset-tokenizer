
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Web3Provider } from '@/contexts/Web3Context';
import Index from "./pages/Index";
import TokenizeAsset from "./pages/TokenizeAsset";

const queryClient = new QueryClient();

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Web3Provider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/tokenize" element={<TokenizeAsset />} />
          </Routes>
          <Toaster />
          <Sonner />
        </Web3Provider>
      </TooltipProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
