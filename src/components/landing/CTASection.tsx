import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from '@/contexts/Web3Context';
import { useToast } from '@/hooks/use-toast';

const CTASection = () => {
  const navigate = useNavigate();
  const { connect } = useWeb3();
  const { toast } = useToast();

  const handleTokenizeClick = async () => {
    try {
      // Check if we're on mobile and MetaMask is not installed
      const isMobileWithoutMM = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
        && !window.ethereum;

      if (isMobileWithoutMM) {
        // Deep link to MetaMask
        const dappUrl = window.location.href;
        const metamaskAppDeepLink = `https://metamask.app.link/dapp/${dappUrl}`;
        window.location.href = metamaskAppDeepLink;
        
        toast({
          title: "Opening MetaMask",
          description: "Please approve the connection request in MetaMask mobile app",
        });
        return;
      }

      // For desktop or mobile with MetaMask installed
      await connect();
      navigate('/tokenize');
    } catch (error) {
      console.error('Connection error:', error);
      toast({
        title: "Connection Failed",
        description: "Please make sure MetaMask is installed and try again",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="text-center">
      <Card>
        <CardContent className="p-12">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Digitize Your Assets?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Create NFTs of your assets with complete ownership protection. 
            You keep full control - XMR Trust just provides the technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={handleTokenizeClick}>
              Start Tokenizing
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline">
              Learn More About Ownership
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CTASection;