import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const TokenizationProcess = () => {
  const steps = [
    {
      title: "1. Verify Ownership",
      description: "Provide proof that you own the asset - this stays private and encrypted"
    },
    {
      title: "2. Generate Smart Contract",
      description: "We create a smart contract that legally protects your ownership rights"
    },
    {
      title: "3. Mint Your NFT",
      description: "Receive your NFT with full control over your digitized asset"
    }
  ];

  return (
    <div className="mb-16">
      <h2 className="text-3xl font-bold text-center mb-8">
        Simple Tokenization Process - You Stay in Control
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((step, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center gap-4">
                <h3 className="font-semibold">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TokenizationProcess;