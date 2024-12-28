import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, Gem, Landmark, Coins } from 'lucide-react';

const TokenizableAssets = () => {
  const assets = [
    {
      icon: Building2,
      title: "Real Estate",
      description: "Create NFTs of your properties while maintaining full ownership rights and control"
    },
    {
      icon: Gem,
      title: "Collectibles",
      description: "Digitize your valuable collections with proof of authenticity and ownership"
    },
    {
      icon: Landmark,
      title: "Business Assets",
      description: "Tokenize business assets while keeping complete operational control"
    },
    {
      icon: Coins,
      title: "Investment Assets",
      description: "Create digital representations of investments with full withdrawal rights"
    }
  ];

  return (
    <div className="mb-16">
      <h2 className="text-3xl font-bold text-center mb-8">
        What You Can Tokenize
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {assets.map((asset, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-100 rounded-full">
                  <asset.icon className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{asset.title}</h3>
                  <p className="text-gray-400">{asset.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TokenizableAssets;