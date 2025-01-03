import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider as EthersWeb3Provider } from '@ethersproject/providers';
import { Web3Provider } from '@/contexts/Web3Context';
import Index from "./pages/Index";
import TokenizeAsset from "./pages/TokenizeAsset";

const queryClient = new QueryClient();

function getLibrary(provider: any): EthersWeb3Provider {
  const library = new EthersWeb3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

const App = () => (
  <BrowserRouter>
    <Web3ReactProvider getLibrary={getLibrary}>
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
    </Web3ReactProvider>
  </BrowserRouter>
);

export default App;