
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWeb3 } from '@/contexts/Web3Context';
import { useToast } from '@/hooks/use-toast';
import { Wallet, Coins, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';

const SepoliaFaucet = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastClaim, setLastClaim] = useState<string | null>(null);
  const { account, connect, isActive, switchToSepolia } = useWeb3();
  const { toast } = useToast();

  const handleConnect = async () => {
    try {
      await connect();
      await switchToSepolia();
      toast({
        title: "Wallet Connected",
        description: "Successfully connected to Sepolia testnet",
      });
    } catch (error) {
      console.error('Connection error:', error);
      toast({
        title: "Connection Failed",
        description: "Please make sure MetaMask is installed and try again",
        variant: "destructive",
      });
    }
  };

  const handleClaimTokens = async () => {
    if (!isActive || !account) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // This is a mock implementation - in a real faucet, you would call your backend
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const txHash = `0x${Math.random().toString(16).substr(2, 64)}`;
      setLastClaim(txHash);
      
      toast({
        title: "Tokens Claimed!",
        description: "MobileMonero test tokens have been sent to your wallet",
      });
    } catch (error) {
      console.error('Claim error:', error);
      toast({
        title: "Claim Failed",
        description: "Unable to claim tokens. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto bg-card text-card-foreground border-border">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-foreground">
          <Coins className="h-6 w-6 text-orange-500" />
          MobileMonero Faucet
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center space-y-2">
          <p className="text-muted-foreground">
            Get free MobileMonero tokens for testing on Sepolia testnet
          </p>
          <div className="bg-muted p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Token Contract: 0x77307...2a15
            </p>
            <a 
              href="https://sepolia.etherscan.io/token/0x77307DFbc436224d5e6f2048d2b6bDfA66998a15"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline text-sm flex items-center justify-center gap-1 mt-1"
            >
              View on Etherscan <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        {!isActive ? (
          <Button onClick={handleConnect} className="w-full" size="lg">
            <Wallet className="mr-2 h-4 w-4" />
            Connect MetaMask
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="bg-primary/10 p-3 rounded-lg border border-primary/20">
              <div className="flex items-center gap-2 text-primary">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Wallet Connected</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1 font-mono">
                {account?.slice(0, 6)}...{account?.slice(-4)}
              </p>
            </div>

            <Button 
              onClick={handleClaimTokens} 
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Claiming Tokens...
                </>
              ) : (
                <>
                  <Coins className="mr-2 h-4 w-4" />
                  Claim 100 MXMR
                </>
              )}
            </Button>
          </div>
        )}

        {lastClaim && (
          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Transaction Sent</span>
            </div>
            <p className="text-xs text-green-600 dark:text-green-500 mt-1 font-mono break-all">
              {lastClaim}
            </p>
          </div>
        )}

        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-yellow-700 dark:text-yellow-300">
              <p className="font-medium mb-1">Important Notes:</p>
              <ul className="space-y-1">
                <li>• Testnet tokens have no real value</li>
                <li>• One claim per address per 24 hours</li>
                <li>• Use for development and testing only</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SepoliaFaucet;
