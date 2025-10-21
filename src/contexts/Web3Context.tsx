import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { useToast } from '@/hooks/use-toast';

export const SUPPORTED_CHAINS = {
  SEPOLIA: {
    chainId: 11155111,
    name: 'Sepolia',
    currency: 'ETH',
    rpcUrl: 'https://sepolia.infura.io/v3/c843a693bc5d43d1aee471d2491f2414',
    blockExplorer: 'https://sepolia.etherscan.io',
  },
  ETHEREUM: {
    chainId: 1,
    name: 'Ethereum',
    currency: 'ETH',
    rpcUrl: 'https://mainnet.infura.io/v3/c843a693bc5d43d1aee471d2491f2414',
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
  disconnect: () => Promise<void>;
  switchChain: (chainId: number) => Promise<void>;
  getProvider: () => ethers.providers.Web3Provider | null;
  getSigner: () => ethers.Signer | null;
  account: string | undefined;
  chainId: number | undefined;
  isActive: boolean;
  isLoading: boolean;
}

const Web3Context = createContext<Web3ContextType | null>(null);

export const Web3Provider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [account, setAccount] = useState<string | undefined>();
  const [chainId, setChainId] = useState<number | undefined>();
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            const ethersProvider = new ethers.providers.Web3Provider(window.ethereum);
            const network = await ethersProvider.getNetwork();
            
            setProvider(ethersProvider);
            setAccount(accounts[0]);
            setChainId(network.chainId);
            setIsActive(true);
          }
        } catch (error) {
          console.error('Error checking connection:', error);
        }
      }
    };

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setIsActive(true);
      } else {
        setAccount(undefined);
        setIsActive(false);
        setProvider(null);
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    checkConnection();

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const connect = async () => {
    if (!window.ethereum) {
      toast({
        title: "Wallet Not Found",
        description: "Please install MetaMask or another Web3 wallet",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      if (accounts.length > 0) {
        const ethersProvider = new ethers.providers.Web3Provider(window.ethereum);
        const network = await ethersProvider.getNetwork();
        
        setProvider(ethersProvider);
        setAccount(accounts[0]);
        setChainId(network.chainId);
        setIsActive(true);
        
        toast({
          title: "Wallet Connected",
          description: `Connected to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = async () => {
    setProvider(null);
    setAccount(undefined);
    setIsActive(false);
    setChainId(undefined);
    
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  const switchChain = async (targetChainId: number) => {
    const chain = Object.values(SUPPORTED_CHAINS).find(c => c.chainId === targetChainId);
    if (!chain || !window.ethereum) {
      throw new Error("Unsupported chain or wallet not found");
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
      });
      
      setChainId(targetChainId);
      
      toast({
        title: "Network Changed",
        description: `Switched to ${chain.name}`,
      });
    } catch (error: any) {
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
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
          
          setChainId(targetChainId);
        } catch (addError: any) {
          toast({
            title: "Error",
            description: addError.message || "Failed to add network",
            variant: "destructive",
          });
          throw addError;
        }
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to switch network",
          variant: "destructive",
        });
        throw error;
      }
    }
  };

  const getProvider = () => provider;
  const getSigner = () => provider?.getSigner() || null;

  return (
    <Web3Context.Provider
      value={{
        connect,
        disconnect,
        switchChain,
        getProvider,
        getSigner,
        account,
        chainId,
        isActive,
        isLoading,
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
