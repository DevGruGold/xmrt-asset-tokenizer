
import React from 'react';
import HeroSection from '@/components/landing/HeroSection';
import SepoliaFaucet from '@/components/faucet/SepoliaFaucet';
import { Button } from '@/components/ui/button';
import { Pickaxe } from 'lucide-react';

const Index = () => {
  const handleStartMining = () => {
    window.open('https://mobilemonero.com', '_blank');
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-6xl mx-auto px-4 pt-10 pb-16">
        <HeroSection />
        <div className="flex justify-center mb-8">
          <Button onClick={handleStartMining} size="lg" className="bg-orange-600 hover:bg-orange-700 text-white">
            <Pickaxe className="mr-2 h-4 w-4" />
            Start Mining
          </Button>
        </div>
        <div className="mt-12">
          <SepoliaFaucet />
        </div>
      </div>
    </div>
  );
};

export default Index;
