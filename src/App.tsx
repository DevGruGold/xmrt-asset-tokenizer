import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { mainnet, polygon, avalancheCChain } from 'wagmi/chains';
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import { Web3Provider } from '@/contexts/Web3Context';
import Index from "./pages/Index";
import TokenizeAsset from "./pages/TokenizeAsset";

const queryClient = new QueryClient();

// Configure Web3Modal
const projectId = 'b59c16c98b22d36a30ec986c5e28dde6';

const chains = [mainnet, polygon, avalancheCChain];
const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
});

const ethereumClient = new EthereumClient(wagmiConfig, chains);

const App = () => (
  <>
    <WagmiConfig config={wagmiConfig}>
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
    </WagmiConfig>
    <Web3Modal
      projectId={projectId}
      ethereumClient={ethereumClient}
      themeMode="dark"
      themeVariables={{
        '--w3m-font-family': 'Inter, sans-serif',
        '--w3m-accent-color': '#000000',
      }}
    />
  </>
);

export default App;