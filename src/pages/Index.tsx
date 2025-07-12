
import React from 'react';
import HeroSection from '@/components/landing/HeroSection';
import SepoliaFaucet from '@/components/faucet/SepoliaFaucet';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 pt-20 pb-16">
        <HeroSection />
        <div className="mt-12">
          <SepoliaFaucet />
        </div>
      </div>
    </div>
  );
};

export default Index;
