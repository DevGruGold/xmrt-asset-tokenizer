import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from '@/contexts/Web3Context';
import { useToast } from '@/hooks/use-toast';

const CTASection = () => {
  const navigate = useNavigate();
  const { connect, isActive } = useWeb3();
  const { toast } = useToast();

  const handleTokenizeClick = async () => {
    try {
      if (!isActive) {
        await connect();
      }

      // Check if the user has NFT support enabled
      if (window.ethereum) {
        try {
          const hasNFTSupport = await window.ethereum.request({
            method: 'wallet_invokeSnap',
            params: ['npm:@metamask/nft-snap']
          }).catch(() => false);

          if (!hasNFTSupport) {
            toast({
              title: "NFT Support Required",
              description: "Please enable NFT support in your MetaMask wallet to continue",
            });
            
            // Guide user to enable NFT support
            window.open('https://metamask.io/nft/', '_blank');
            return;
          }
        } catch (error) {
          console.error('NFT support check error:', error);
          toast({
            title: "Wallet Setup Required",
            description: "Please set up your collectibles wallet in MetaMask to continue",
            variant: "destructive",
          });
          return;
        }
      }

      navigate('/tokenize');
    } catch (error) {
      console.error('Connection error:', error);
      toast({
        title: "Connection Failed",
        description: "Please make sure your wallet is properly set up and try again",
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