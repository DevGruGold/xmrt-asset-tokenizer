import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, CheckCircle } from 'lucide-react';

const OwnershipGuarantee = () => {
  return (
    <Card className="mb-16 border-green-500">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Shield className="h-12 w-12 text-green-500 mt-1 flex-shrink-0" />
          <div>
            <h2 className="text-xl font-bold mb-2">100% Ownership Guarantee</h2>
            <p className="text-gray-300 mb-4">
              When you tokenize your assets with XMR Trust, you retain complete ownership and control. 
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
  );
};

export default OwnershipGuarantee;