import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center">
      <Card>
        <CardContent className="p-12">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Digitize Your Assets?
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Create NFTs of your assets with complete ownership protection. 
            You keep full control - XMR Trust just provides the technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/tokenize')}>
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
  );
};

export default CTASection;