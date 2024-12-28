import React from 'react';
import HeroSection from '@/components/landing/HeroSection';
import OwnershipGuarantee from '@/components/landing/OwnershipGuarantee';
import OwnershipProtection from '@/components/landing/OwnershipProtection';
import TokenizableAssets from '@/components/landing/TokenizableAssets';
import TokenizationProcess from '@/components/landing/TokenizationProcess';
import FAQ from '@/components/landing/FAQ';
import CTASection from '@/components/landing/CTASection';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 pt-20 pb-16">
        <HeroSection />
        <OwnershipGuarantee />
        <OwnershipProtection />
        <TokenizableAssets />
        <TokenizationProcess />
        <FAQ />
        <CTASection />
      </div>
    </div>
  );
};

export default Index;