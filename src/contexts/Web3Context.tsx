import React, { createContext, useContext, useState, useEffect } from 'react';
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
            setAccount(accounts[0]);
            setIsActive(true);
            const chainId = await window.ethereum.request({ method: 'eth_chainId' });
            setChainId(parseInt(chainId, 16));
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
      }
    };

    const handleChainChanged = (chainId: string) => {
      setChainId(parseInt(chainId, 16));
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
        title: "MetaMask Not Found",
        description: "Please install MetaMask to connect your wallet",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setIsActive(true);
        
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        setChainId(parseInt(chainId, 16));
        
        toast({
          title: "Wallet Connected",
          description: "Successfully connected to MetaMask",
        });
      }
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = async () => {
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
    if (!chain) {
      throw new Error("Unsupported chain");
    }

    if (!window.ethereum) {
      throw new Error("MetaMask not found");
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
      });
      
      setChainId(targetChainId);
      
      toast({
        title: "Network Changed",
        description: `Successfully switched to ${chain.name}`,
      });
    } catch (error: any) {
      if (error.code === 4902) {
        // Chain not added to MetaMask
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
          
          toast({
            title: "Network Added & Changed",
            description: `Successfully added and switched to ${chain.name}`,
          });
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

  const bridgeNFT = async (tokenId: string, fromChainId: number, toChainId: number) => {
    if (!isActive || !account) {
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
