import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@/contexts/Web3Context';
import { ethers } from 'ethers';
import Index from "./pages/Index";
import TokenizeAsset from "./pages/TokenizeAsset";

const queryClient = new QueryClient();

function getLibrary(provider: any) {
  return new ethers.providers.Web3Provider(provider);
}

const App = () => (
  <Web3ReactProvider getLibrary={getLibrary}>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
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
      </BrowserRouter>
    </QueryClientProvider>
  </Web3ReactProvider>
);

export default App;