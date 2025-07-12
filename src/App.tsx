
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createConfig, WagmiProvider } from 'wagmi';
import { mainnet, polygon, avalanche } from 'wagmi/chains';
import { createWeb3Modal } from '@web3modal/wagmi';
import { Web3Provider } from '@/contexts/Web3Context';
import Index from "./pages/Index";
import TokenizeAsset from "./pages/TokenizeAsset";

const queryClient = new QueryClient();

// Configure Web3Modal
const projectId = 'b59c16c98b22d36a30ec986c5e28dde6';

const metadata = {
  name: 'CashDapp by MobileMonero.com',
  description: 'Tokenize your assets securely with CashDapp',
  url: 'https://cashdapp.mobilemonero.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
};

const chains = [mainnet, polygon, avalanche];
const config = createConfig({
  chains,
  projectId,
  metadata,
  ssr: false
});

createWeb3Modal({
  wagmiConfig: config,
  projectId,
  chains,
  themeMode: 'dark',
  themeVariables: {
    '--w3m-font-family': 'Inter, sans-serif',
    '--w3m-accent': '#000000',
  }
});

const App = () => (
  <WagmiProvider config={config}>
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
