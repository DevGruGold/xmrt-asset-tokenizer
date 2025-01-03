import React from 'react';
import { TokenizationForm } from '@/components/tokenization/TokenizationForm';
import { VehicleTransfer } from '@/components/vehicle/VehicleTransfer';
import { Card } from '@/components/ui/card';

const TokenizeAsset = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Vehicle NFT Management</h1>
        
        <Card className="p-6">
          <TokenizationForm />
        </Card>

        <VehicleTransfer tokenId="your-vehicle-token-id" />
      </div>
    </div>
  );
};

export default TokenizeAsset;