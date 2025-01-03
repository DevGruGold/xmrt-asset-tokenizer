import React, { createContext, useContext, useEffect, useState } from 'react';
import { Web3ReactProvider, useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import { ethers } from 'ethers';
import { useToast } from '@/hooks/use-toast';

const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42] // Mainnet and test networks
});

interface Web3ContextType {
  connect: () => Promise<void>;
  disconnect: () => void;
  account: string | null;
  isActive: boolean;
  isLoading: boolean;
  provider: ethers.providers.Web3Provider | null;
}

const Web3Context = createContext<Web3ContextType | null>(null);

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  const { activate, deactivate, account, active, library } = useWeb3React();
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

  useEffect(() => {
    // Try to reconnect on mount if previously connected
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
        account: account || null,
        isActive: active,
        isLoading,
        provider: library ? new ethers.providers.Web3Provider(library.provider) : null,
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