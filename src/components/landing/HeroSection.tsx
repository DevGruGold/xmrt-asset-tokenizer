
import React from 'react';
import { Badge } from '@/components/ui/badge';

const HeroSection = () => {
  return (
    <div className="text-center mb-12">
      <Badge className="mb-4">
        MobileMonero - Your Crypto, Your Control
      </Badge>
      <h1 className="text-4xl md:text-5xl font-bold mb-6">
        MobileMonero Sepolia Testnet Faucet
      </h1>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
        Get free Sepolia testnet tokens for development and testing. 
        Connect your MetaMask wallet and claim your tokens instantly.
      </p>
    </div>
  );
};

export default HeroSection;
