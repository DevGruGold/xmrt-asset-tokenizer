import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Gem,
  Building2,
  ArrowRight,
  CheckCircle,
  Key,
  FileText,
  Landmark,
  Coins,
  Shield,
  LinkIcon
} from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 pt-20 pb-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge className="mb-4">
            Your Assets, Your Control
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Tokenize Your Assets While Maintaining 100% Ownership
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Create NFTs of your assets with smart contracts that guarantee your ownership. 
            Unlike traditional banks, we never take control of your property - 
            we just help you digitize it.
          </p>
        </div>

        {/* Ownership Guarantee Section */}
        <Card className="mb-16 border-green-500">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Shield className="h-12 w-12 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-xl font-bold mb-2">100% Ownership Guarantee</h2>
                <p className="text-gray-300 mb-4">
                  When you tokenize your assets with us, you retain complete ownership and control. 
                  We simply provide the technology to create a digital representation of your asset - 
                  we never take custody or control of your property.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>You keep all property rights</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Full control of your assets</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>No bank custody or control</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How Ownership Works */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            How Your Ownership Is Protected
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Key className="h-8 w-8 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-semibold">Private Key Control</h3>
                  <p className="text-gray-400">
                    Only you hold the private keys to your tokenized assets. Without these keys, 
                    nobody - including us - can access or control your property.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <FileText className="h-8 w-8 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-semibold">Smart Contract Guarantee</h3>
                  <p className="text-gray-400">
                    Our smart contracts are immutable and transparent, legally ensuring 
                    your ownership rights cannot be altered or revoked by anyone.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <LinkIcon className="h-8 w-8 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-semibold">Direct Asset Connection</h3>
                  <p className="text-gray-400">
                    Your NFT directly represents your asset ownership - we never act as 
                    an intermediary or take custody of your property.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* What You Can Tokenize */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            What You Can Tokenize
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
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
            ].map((asset, index) => (
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

        {/* The Process */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            Simple Tokenization Process - You Stay in Control
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
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
            ].map((step, index) => (
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

        {/* FAQ About Ownership */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            Common Questions About Ownership
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                q: "Do I lose any control over my asset?",
                a: "No, you maintain 100% control. Tokenization simply creates a digital representation of your ownership."
              },
              {
                q: "Can the platform access my asset?",
                a: "No, we never have access to your asset. We only provide the technology to create and verify your NFT."
              },
              {
                q: "What happens to my physical property?",
                a: "Your physical property stays exactly where it is - tokenization doesn't affect physical possession."
              },
              {
                q: "Can I sell or transfer my asset?",
                a: "Yes, you have complete freedom to sell or transfer both your physical asset and its NFT representation."
              }
            ].map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">{faq.q}</h3>
                  <p className="text-gray-400">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card>
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Digitize Your Assets?
              </h2>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Create NFTs of your assets with complete ownership protection. 
                You keep full control - we just provide the technology.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg">
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
      </div>
    </div>
  );
};

export default Index;