
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWeb3 } from '@/contexts/Web3Context';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Wallet, Coins, AlertCircle, CheckCircle, ExternalLink, Clock } from 'lucide-react';

const SepoliaFaucet = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingEligibility, setIsCheckingEligibility] = useState(false);
  const [lastClaim, setLastClaim] = useState<string | null>(null);
  const [eligibility, setEligibility] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const { account, connect, isActive } = useWeb3();
  const { toast } = useToast();

  // Check eligibility when wallet connects
  useEffect(() => {
    if (account && isActive) {
      checkEligibility();
      loadStats();
    }
  }, [account, isActive]);

  const checkEligibility = async () => {
    if (!account) return;
    
    setIsCheckingEligibility(true);
    try {
      const { data, error } = await supabase.functions.invoke('check-faucet-eligibility', {
        body: { walletAddress: account }
      });

      if (error) throw error;
      setEligibility(data);
    } catch (error) {
      console.error('Error checking eligibility:', error);
    } finally {
      setIsCheckingEligibility(false);
    }
  };

  const loadStats = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('get-faucet-stats', {
        body: { walletAddress: account }
      });

      if (error) throw error;
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleConnect = async () => {
    try {
      await connect();
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

    if (!eligibility?.eligible) {
      toast({
        title: "Not Eligible",
        description: eligibility?.reason || "You cannot claim tokens at this time",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('claim-faucet-tokens', {
        body: { walletAddress: account }
      });

      if (error) throw error;

      if (data.success) {
        setLastClaim(data.transactionHash);
        
        toast({
          title: "Tokens Claimed!",
          description: (
            <div className="space-y-1">
              <p>{data.amount} ETH sent to your wallet</p>
              <a 
                href={data.explorerUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs underline flex items-center gap-1"
              >
                View on Explorer <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          ),
        });

        // Refresh eligibility and stats
        await checkEligibility();
        await loadStats();
      }
    } catch (error: any) {
      console.error('Claim error:', error);
      toast({
        title: "Claim Failed",
        description: error.message || "Unable to claim tokens. Please try again later.",
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

            {isCheckingEligibility ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
                <p className="text-sm text-muted-foreground mt-2">Checking eligibility...</p>
              </div>
            ) : eligibility?.eligible ? (
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
                    Claim {eligibility.claimAmount} ETH
                  </>
                )}
              </Button>
            ) : (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-start gap-2">
                  <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      {eligibility?.reason || "Not eligible to claim"}
                    </p>
                    {eligibility?.nextClaimTime && (
                      <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                        Next claim available: {new Date(eligibility.nextClaimTime).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {stats && (
              <div className="bg-muted p-3 rounded-lg space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Faucet Statistics</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-muted-foreground">Total Claims</p>
                    <p className="font-mono font-medium">{stats.totalClaims}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Distributed</p>
                    <p className="font-mono font-medium">{stats.totalDistributed} ETH</p>
                  </div>
                </div>
              </div>
            )}
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
