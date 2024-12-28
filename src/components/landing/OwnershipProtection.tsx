import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Key, FileText, LinkIcon } from 'lucide-react';

const OwnershipProtection = () => {
  const protectionFeatures = [
    {
      icon: Key,
      title: "Private Key Control",
      description: "Only you hold the private keys to your tokenized assets. Without these keys, nobody - including us - can access or control your property."
    },
    {
      icon: FileText,
      title: "Smart Contract Guarantee",
      description: "Our smart contracts are immutable and transparent, legally ensuring your ownership rights cannot be altered or revoked by anyone."
    },
    {
      icon: LinkIcon,
      title: "Direct Asset Connection",
      description: "Your NFT directly represents your asset ownership - we never act as an intermediary or take custody of your property."
    }
  ];

  return (
    <div className="mb-16">
      <h2 className="text-3xl font-bold text-center mb-8">
        How Your Ownership Is Protected
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {protectionFeatures.map((feature, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <feature.icon className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OwnershipProtection;