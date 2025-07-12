
import React from 'react';
import { Badge } from '@/components/ui/badge';

const HeroSection = () => {
  return (
    <div className="text-center mb-12">
      <Badge className="mb-4">
        CashDapp by MobileMonero.com - Your Assets, Your Control
      </Badge>
      <h1 className="text-4xl md:text-5xl font-bold mb-6">
        Tokenize Your Assets While Maintaining 100% Ownership
      </h1>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
        Create NFTs of your assets with smart contracts that guarantee your ownership. 
        Unlike traditional banks, CashDapp never takes control of your property - 
        we just help you digitize it.
      </p>
    </div>
  );
};

export default HeroSection;
