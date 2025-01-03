import React, { useState } from 'react';
import { useWeb3 } from '@/contexts/Web3Context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { SUPPORTED_CHAINS } from '@/contexts/Web3Context';

export const VehicleTransfer = ({ tokenId }: { tokenId: string }) => {
  const { bridgeNFT, chainId, isActive } = useWeb3();
  const [targetChain, setTargetChain] = useState<string>('');
  const [isTransferring, setIsTransferring] = useState(false);
  const { toast } = useToast();

  const handleTransfer = async () => {
    if (!chainId || !targetChain) {
      toast({
        title: "Error",
        description: "Please select source and target chains",
        variant: "destructive",
      });
      return;
    }

    setIsTransferring(true);
    try {
      await bridgeNFT(
        tokenId,
        chainId,
        parseInt(targetChain)
      );
    } finally {
      setIsTransferring(false);
    }
  };

  if (!isActive) {
    return (
      <Card className="p-6">
        <p className="text-center text-gray-600">
          Please connect your wallet to transfer your vehicle NFT
        </p>
      </Card>
    );
  }

  const currentChain = Object.values(SUPPORTED_CHAINS).find(c => c.chainId === chainId);

  return (
    <Card className="p-6 space-y-4">
      <h3 className="text-lg font-semibold">Transfer Vehicle NFT</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Current Chain</label>
          <p className="text-gray-600">
            {currentChain?.name || 'Unknown'}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Target Chain</label>
          <Select onValueChange={setTargetChain}>
            <SelectTrigger>
              <SelectValue placeholder="Select target chain" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(SUPPORTED_CHAINS)
                .filter(chain => chain.chainId !== chainId)
                .map(chain => (
                  <SelectItem key={chain.chainId} value={chain.chainId.toString()}>
                    {chain.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleTransfer}
          disabled={isTransferring || !targetChain}
          className="w-full"
        >
          {isTransferring ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Transferring...
            </>
          ) : (
            'Transfer Vehicle NFT'
          )}
        </Button>
      </div>
    </Card>
  );
};