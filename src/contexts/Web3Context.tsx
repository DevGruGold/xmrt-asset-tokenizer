import React, { createContext, useContext, useState } from 'react';
import { providers } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import { useToast } from '@/hooks/use-toast';

export const SUPPORTED_CHAINS = {
  AVALANCHE: {
    chainId: 43114,
    name: 'Avalanche',
    currency: 'AVAX',
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    blockExplorer: 'https://snowtrace.io',
    bridgeContract: '0x...' // Add actual bridge contract address
  },
  POLYGON: {
    chainId: 137,
    name: 'Polygon',
    currency: 'MATIC',
    rpcUrl: 'https://polygon-rpc.com',
    blockExplorer: 'https://polygonscan.com',
    bridgeContract: '0x...' // Add actual bridge contract address
  }
};

const injected = new InjectedConnector({
  supportedChainIds: Object.values(SUPPORTED_CHAINS).map(chain => chain.chainId)
});

interface Web3ContextType {
  connect: () => Promise<void>;
  disconnect: () => void;
  switchChain: (chainId: number) => Promise<void>;
  bridgeNFT: (tokenId: string, fromChainId: number, toChainId: number) => Promise<void>;
  account: string | null;
  chainId: number | null;
  isActive: boolean;
  isLoading: boolean;
  provider: providers.Web3Provider | null;
}

const Web3Context = createContext<Web3ContextType | null>(null);

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { activate, deactivate, account, chainId, library, active } = useWeb3React<providers.Web3Provider>();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const connect = async () => {
    setIsLoading(true);
    try {
      await activate(injected);
      toast({
        title: "Wallet Connected",
        description: "Successfully connected to MetaMask",
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Please install MetaMask or try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = () => {
    deactivate();
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  const switchChain = async (targetChainId: number) => {
    if (!library?.provider?.request) {
      throw new Error("No provider available");
    }

    const chain = Object.values(SUPPORTED_CHAINS).find(c => c.chainId === targetChainId);
    if (!chain) {
      throw new Error("Unsupported chain");
    }

    try {
      await library.provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
      });
      toast({
        title: "Network Changed",
        description: `Successfully switched to ${chain.name}`,
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await library.provider.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: `0x${targetChainId.toString(16)}`,
              chainName: chain.name,
              nativeCurrency: {
                name: chain.currency,
                symbol: chain.currency,
                decimals: 18,
              },
              rpcUrls: [chain.rpcUrl],
              blockExplorerUrls: [chain.blockExplorer],
            }],
          });
        } catch (addError) {
          toast({
            title: "Error",
            description: "Failed to add network to MetaMask",
            variant: "destructive",
          });
        }
      }
    }
  };

  const bridgeNFT = async (tokenId: string, fromChainId: number, toChainId: number) => {
    if (!library || !account) {
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

      // Simulate bridge transaction (replace with actual bridge contract interaction)
      toast({
        title: "Bridging NFT",
        description: `Starting transfer from ${fromChain.name} to ${toChain.name}`,
      });

      // Here you would typically:
      // 1. Approve the bridge contract to handle your NFT
      // 2. Call the bridge contract's transfer function
      // 3. Wait for confirmation on the destination chain

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
    }
  };

  return (
    <Web3Context.Provider
      value={{
        connect,
        disconnect,
        switchChain,
        bridgeNFT,
        account: account || null,
        chainId: chainId || null,
        isActive: active,
        isLoading,
        provider: library || null,
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