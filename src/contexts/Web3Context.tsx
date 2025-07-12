
import React, { createContext, useContext } from 'react';
import { useAccount, useDisconnect, useChainId, useSwitchChain } from 'wagmi';
import { useToast } from '@/hooks/use-toast';

export const SUPPORTED_CHAINS = {
  ETHEREUM: {
    chainId: 1,
    name: 'Ethereum',
    currency: 'ETH',
    rpcUrl: 'https://mainnet.infura.io/v3/your-project-id',
    blockExplorer: 'https://etherscan.io',
  },
  AVALANCHE: {
    chainId: 43114,
    name: 'Avalanche',
    currency: 'AVAX',
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    blockExplorer: 'https://snowtrace.io',
  },
  POLYGON: {
    chainId: 137,
    name: 'Polygon',
    currency: 'MATIC',
    rpcUrl: 'https://polygon-rpc.com',
    blockExplorer: 'https://polygonscan.com',
  }
} as const;

interface Web3ContextType {
  connect: () => Promise<void>;
  disconnect: () => void;
  switchChain: (chainId: number) => Promise<void>;
  bridgeNFT: (tokenId: string, fromChainId: number, toChainId: number) => Promise<void>;
  account: string | undefined;
  chainId: number | undefined;
  isActive: boolean;
  isLoading: boolean;
}

const Web3Context = createContext<Web3ContextType | null>(null);

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { disconnectAsync } = useDisconnect();
  const { switchChainAsync } = useSwitchChain();
  const { toast } = useToast();

  const connect = async () => {
    try {
      // Web3Modal handles connection - just open the modal
      const web3modal = document.querySelector('w3m-button');
      if (web3modal) {
        (web3modal as any).click();
      } else {
        // Fallback - trigger Web3Modal programmatically
        if (window.ethereum) {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
        }
      }
      
      toast({
        title: "Wallet Connected",
        description: "Successfully connected to your wallet",
      });
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
      throw error;
    }
  };

  const disconnect = async () => {
    try {
      await disconnectAsync();
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected",
      });
    } catch (error: any) {
      toast({
        title: "Disconnect Failed",
        description: error.message || "Failed to disconnect wallet",
        variant: "destructive",
      });
    }
  };

  const switchChain = async (targetChainId: number) => {
    const chain = Object.values(SUPPORTED_CHAINS).find(c => c.chainId === targetChainId);
    if (!chain) {
      throw new Error("Unsupported chain");
    }

    try {
      await switchChainAsync({ chainId: targetChainId });
      toast({
        title: "Network Changed",
        description: `Successfully switched to ${chain.name}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to switch network",
        variant: "destructive",
      });
      throw error;
    }
  };

  const bridgeNFT = async (tokenId: string, fromChainId: number, toChainId: number) => {
    if (!isConnected || !address) {
      throw new Error("Wallet not connected");
    }

    const fromChain = Object.values(SUPPORTED_CHAINS).find(c => c.chainId === fromChainId);
    const toChain = Object.values(SUPPORTED_CHAINS).find(c => c.chainId === toChainId);

    if (!fromChain || !toChain) {
      throw new Error("Invalid chain selection");
    }

    try {
      // First switch to the source chain
      await switchChain(fromChainId);

      toast({
        title: "Bridging NFT",
        description: `Starting transfer from ${fromChain.name} to ${toChain.name}`,
      });

      // Simulate bridge transaction (replace with actual bridge contract interaction)
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "Bridge Initiated",
        description: "Your vehicle NFT transfer has been initiated. Please wait for confirmation.",
      });

    } catch (error: any) {
      toast({
        title: "Bridge Failed",
        description: error.message || "Failed to transfer NFT between chains",
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <Web3Context.Provider
      value={{
        connect,
        disconnect,
        switchChain,
        bridgeNFT,
        account: address,
        chainId,
        isActive: isConnected,
        isLoading: false, // Web3Modal handles loading states
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};
