
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useWeb3 } from '@/contexts/Web3Context';
import { useToast } from '@/hooks/use-toast';
import { Droplets, ExternalLink } from 'lucide-react';

const SEPOLIA_TOKEN_ADDRESS = '0x77307DFbc436224d5e6f2048d2b6bDfA66998a15';
const SEPOLIA_CHAIN_ID = 11155111;

const SepoliaFaucet = () => {
  const [amount, setAmount] = useState('100');
  const [isLoading, setIsLoading] = useState(false);
  const { account, chainId, isActive, connect, switchChain } = useWeb3();
  const { toast } = useToast();

  const handleClaim = async () => {
    if (!isActive) {
      try {
        await connect();
      } catch (error) {
        return;
      }
    }

    if (chainId !== SEPOLIA_CHAIN_ID) {
      try {
        await switchChain(SEPOLIA_CHAIN_ID);
      } catch (error) {
        toast({
          title: "Network Switch Failed",
          description: "Please manually switch to Sepolia testnet in MetaMask",
          variant: "destructive",
        });
        return;
      }
    }

    setIsLoading(true);
    try {
      // Simulate faucet claim (replace with actual faucet contract interaction)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Tokens Claimed!",
        description: `Successfully claimed ${amount} tokens to ${account}`,
      });
    } catch (error) {
      toast({
        title: "Claim Failed",
        description: "Failed to claim tokens. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToken = async () => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: SEPOLIA_TOKEN_ADDRESS,
            symbol: 'MMTEST',
            decimals: 18,
            image: '',
          },
        },
      });

      toast({
        title: "Token Added",
        description: "MobileMonero test token added to MetaMask",
      });
    } catch (error) {
      toast({
        title: "Failed to Add Token",
        description: "Could not add token to MetaMask",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Droplets className="h-6 w-6 text-blue-500" />
          Sepolia Testnet Faucet
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">Token Contract:</p>
          <div className="flex items-center gap-2 text-xs bg-muted p-2 rounded">
            <span className="truncate">{SEPOLIA_TOKEN_ADDRESS}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(`https://sepolia.etherscan.io/token/${SEPOLIA_TOKEN_ADDRESS}`, '_blank')}
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Amount to claim:</label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="100"
            min="1"
            max="1000"
          />
        </div>

        {account && (
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Connected:</p>
            <p className="text-xs font-mono bg-muted p-2 rounded truncate">
              {account}
            </p>
          </div>
        )}

        <div className="space-y-2">
          <Button 
            onClick={handleClaim} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Claiming...' : isActive ? 'Claim Tokens' : 'Connect & Claim'}
          </Button>
          
          {isActive && (
            <Button 
              onClick={handleAddToken}
              variant="outline"
              className="w-full"
            >
              Add Token to MetaMask
            </Button>
          )}
        </div>

        <div className="text-xs text-muted-foreground text-center">
          <p>• Maximum 1000 tokens per claim</p>
          <p>• Sepolia testnet only</p>
          <p>• For testing purposes only</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SepoliaFaucet;
