import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createConfig, http, WagmiProvider } from 'wagmi';
import { mainnet, polygon, avalanche } from 'wagmi/chains';
import { Web3Modal } from '@web3modal/wagmi/react';
import { defaultWagmiConfig } from '@web3modal/wagmi/react';
import { Web3Provider } from '@/contexts/Web3Context';
import Index from "./pages/Index";
import TokenizeAsset from "./pages/TokenizeAsset";

const queryClient = new QueryClient();

// Configure Web3Modal
const projectId = 'b59c16c98b22d36a30ec986c5e28dde6';

const metadata = {
  name: 'XMR Trust',
  description: 'Tokenize your assets securely',
  url: 'https://xmr.trust',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
};

const chains = [mainnet, polygon, avalanche];
const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [avalanche.id]: http(),
  },
});

const App = () => (
  <WagmiProvider config={config}>
    <Web3Modal projectId={projectId} />
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
  </WagmiProvider>
);

export default App;