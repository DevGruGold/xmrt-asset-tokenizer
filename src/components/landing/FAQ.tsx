import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const FAQ = () => {
  const faqs = [
    {
      q: "Do I lose any control over my asset?",
      a: "No, you maintain 100% control. Tokenization simply creates a digital representation of your ownership."
    },
    {
      q: "Can XMR Trust access my asset?",
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
  ];

  return (
    <div className="mb-16">
      <h2 className="text-3xl font-bold text-center mb-8">
        Common Questions About Ownership
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {faqs.map((faq, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">{faq.q}</h3>
              <p className="text-gray-400">{faq.a}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FAQ;