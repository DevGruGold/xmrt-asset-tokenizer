import React, { useState } from 'react';
import { useWeb3 } from '@/contexts/Web3Context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send } from 'lucide-react';
import { SUPPORTED_CHAINS } from '@/contexts/Web3Context';
import { ethers } from 'ethers';
import { getContractAddress, NFT_TOKENIZER_ABI } from '@/config/contracts';

export const VehicleTransfer = ({ tokenId }: { tokenId: string }) => {
  const { chainId, isActive, getSigner, switchChain } = useWeb3();
  const [targetAddress, setTargetAddress] = useState('');
  const [targetChain, setTargetChain] = useState<string>('');
  const [isTransferring, setIsTransferring] = useState(false);
  const { toast } = useToast();

  const handleTransfer = async () => {
    if (!isActive) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    if (!chainId) {
      toast({
        title: "Network Error",
        description: "Unable to detect network",
        variant: "destructive",
      });
      return;
    }

    if (!targetAddress || !ethers.utils.isAddress(targetAddress)) {
      toast({
        title: "Invalid Address",
        description: "Please enter a valid Ethereum address",
        variant: "destructive",
      });
      return;
    }

    setIsTransferring(true);
    try {
      const signer = getSigner();
      if (!signer) {
        throw new Error("Unable to get signer");
      }

      // If cross-chain transfer is requested
      if (targetChain && parseInt(targetChain) !== chainId) {
        toast({
          title: "Cross-Chain Transfer",
          description: "Initiating cross-chain transfer. This may take a few minutes.",
        });

        // Switch to source chain first
        await switchChain(chainId);
        
        // In production, integrate with actual bridge protocol (e.g., LayerZero, Axelar)
        // For now, we'll do a simple burn on source chain
        const contractAddress = getContractAddress(chainId, 'NFT_TOKENIZER');
        const contract = new ethers.Contract(contractAddress, NFT_TOKENIZER_ABI, signer);
        
        // Check if user owns the token
        const owner = await contract.ownerOf(tokenId);
        const userAddress = await signer.getAddress();
        
        if (owner.toLowerCase() !== userAddress.toLowerCase()) {
          throw new Error("You don't own this NFT");
        }

        toast({
          title: "Bridge Not Implemented",
          description: "Cross-chain bridging requires integration with a bridge protocol like LayerZero or Axelar",
          variant: "destructive",
        });
        return;
      }

      // Same-chain transfer
      const contractAddress = getContractAddress(chainId, 'NFT_TOKENIZER');
      const contract = new ethers.Contract(contractAddress, NFT_TOKENIZER_ABI, signer);
      
      toast({
        title: "Transferring NFT",
        description: "Please confirm the transaction in your wallet...",
      });

      const userAddress = await signer.getAddress();
      
      // Transfer the NFT
      const tx = await contract.transferFrom(userAddress, targetAddress, tokenId);
      
      toast({
        title: "Transaction Submitted",
        description: "Waiting for confirmation...",
      });

      const receipt = await tx.wait();
      
      toast({
        title: "Transfer Successful!",
        description: `NFT transferred to ${targetAddress.slice(0, 6)}...${targetAddress.slice(-4)}`,
      });

      console.log("Transfer receipt:", receipt);
      
    } catch (error: any) {
      console.error('Transfer error:', error);
      
      let errorMessage = "Failed to transfer NFT";
      
      if (error.code === 4001) {
        errorMessage = "Transaction rejected by user";
      } else if (error.code === -32603) {
        errorMessage = "Internal error. Please check your wallet and try again.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Transfer Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsTransferring(false);
    }
  };

  if (!isActive) {
    return (
      <Card className="p-6">
        <p className="text-center text-muted-foreground">
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
          <Label className="text-sm font-medium mb-2">Token ID</Label>
          <p className="text-muted-foreground">
            #{tokenId}
          </p>
        </div>

        <div>
          <Label className="text-sm font-medium mb-2">Current Chain</Label>
          <p className="text-muted-foreground">
            {currentChain?.name || 'Unknown'}
          </p>
        </div>

        <div>
          <Label htmlFor="recipient" className="text-sm font-medium">
            Recipient Address
          </Label>
          <Input
            id="recipient"
            type="text"
            placeholder="0x..."
            value={targetAddress}
            onChange={(e) => setTargetAddress(e.target.value)}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="chain" className="text-sm font-medium mb-2">
            Target Chain (Optional - for cross-chain transfer)
          </Label>
          <Select onValueChange={setTargetChain}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Same chain (default)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Same Chain</SelectItem>
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
          disabled={isTransferring || !targetAddress}
          className="w-full"
        >
          {isTransferring ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Transferring...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Transfer Vehicle NFT
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};
