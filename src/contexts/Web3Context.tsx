import React, { createContext, useContext, useEffect, useState } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import { useToast } from '@/hooks/use-toast';

export const SUPPORTED_CHAINS = {
  ETHEREUM: {
    chainId: 1,
    name: 'Ethereum',
    currency: 'ETH',
    rpcUrl: 'https://mainnet.infura.io/v3/your-infura-id',
    blockExplorer: 'https://etherscan.io'
  },
  POLYGON: {
    chainId: 137,
    name: 'Polygon',
    currency: 'MATIC',
    rpcUrl: 'https://polygon-rpc.com',
    blockExplorer: 'https://polygonscan.com'
  },
  AVALANCHE: {
    chainId: 43114,
    name: 'Avalanche',
    currency: 'AVAX',
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    blockExplorer: 'https://snowtrace.io'
  }
};

const injected = new InjectedConnector({
  supportedChainIds: Object.values(SUPPORTED_CHAINS).map(chain => chain.chainId)
});

interface Web3ContextType {
  connect: () => Promise<void>;
  disconnect: () => void;
  switchChain: (chainId: number) => Promise<void>;
  account: string | null;
  chainId: number | null;
  isActive: boolean;
  isLoading: boolean;
  provider: Web3Provider | null;
}

const Web3Context = createContext<Web3ContextType | null>(null);

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { activate, deactivate, account, chainId, active, library } = useWeb3React<Web3Provider>();
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
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await library.provider.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${targetChainId.toString(16)}`,
                chainName: chain.name,
                nativeCurrency: {
                  name: chain.currency,
                  symbol: chain.currency,
                  decimals: 18,
                },
                rpcUrls: [chain.rpcUrl],
                blockExplorerUrls: [chain.blockExplorer],
              },
            ],
          });
        } catch (addError) {
          toast({
            title: "Error",
            description: "Failed to add network to MetaMask",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to switch network",
          variant: "destructive",
        });
      }
    }
  };

  useEffect(() => {
    injected.isAuthorized().then((isAuthorized) => {
      if (isAuthorized) {
        connect();
      }
    });
  }, []);

  return (
    <Web3Context.Provider
      value={{
        connect,
        disconnect,
        switchChain,
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