import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, ExternalLink, Wallet } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useWeb3 } from '@/contexts/Web3Context';
import { ethers } from 'ethers';
import { getContractAddress, NFT_TOKENIZER_ABI } from '@/config/contracts';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const formSchema = z.object({
  assetName: z.string().min(2, 'Asset name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  file: z.any().refine((file) => file?.length === 1, 'Asset file is required'),
});

export const TokenizationForm = () => {
  const { connect, disconnect, account, isActive, isLoading: isWalletLoading, getSigner, chainId } = useWeb3();
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState({
    txHash: '',
    tokenId: '',
    contractAddress: ''
  });
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      assetName: '',
      description: '',
    },
  });

  const uploadToIPFS = async (file: File): Promise<string> => {
    // In production, integrate with IPFS/Pinata/NFT.Storage
    // For now, return a placeholder URI
    const formData = new FormData();
    formData.append('file', file);
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return placeholder IPFS URI
    return `ipfs://QmPlaceholder${Date.now()}`;
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!isActive || !account) {
      toast({
        title: "Wallet Required",
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

    setIsProcessing(true);
    setProgress(10);
    
    try {
      // Step 1: Upload file to IPFS (20%)
      toast({
        title: "Uploading to IPFS",
        description: "Uploading your asset metadata...",
      });
      
      const file = values.file[0];
      const metadataURI = await uploadToIPFS(file);
      setProgress(30);

      // Step 2: Get contract and signer (40%)
      const signer = getSigner();
      if (!signer) {
        throw new Error("Unable to get signer");
      }

      const contractAddress = getContractAddress(chainId, 'NFT_TOKENIZER');
      const contract = new ethers.Contract(contractAddress, NFT_TOKENIZER_ABI, signer);
      setProgress(50);

      // Step 3: Mint NFT on blockchain (70%)
      toast({
        title: "Minting NFT",
        description: "Please confirm the transaction in your wallet...",
      });

      const tx = await contract.mintAsset(
        values.assetName,
        values.description,
        metadataURI
      );
      
      setProgress(70);
      
      toast({
        title: "Transaction Submitted",
        description: "Waiting for blockchain confirmation...",
      });

      // Step 4: Wait for confirmation (90%)
      const receipt = await tx.wait();
      setProgress(90);

      // Step 5: Extract token ID from event logs
      const mintEvent = receipt.events?.find((e: any) => e.event === 'AssetMinted');
      const tokenId = mintEvent?.args?.tokenId?.toString() || 'Unknown';
      
      setProgress(100);

      // Set transaction details
      const txDetails = {
        txHash: receipt.transactionHash,
        tokenId: tokenId,
        contractAddress: contractAddress
      };

      setTransactionDetails(txDetails);
      setShowSuccessDialog(true);

      toast({
        title: "Asset Tokenized Successfully!",
        description: `Token ID: ${tokenId}`,
      });

      // Reset form
      form.reset();
      
    } catch (error: any) {
      console.error('Tokenization error:', error);
      
      let errorMessage = "There was an error tokenizing your asset";
      
      if (error.code === 4001) {
        errorMessage = "Transaction rejected by user";
      } else if (error.code === -32603) {
        errorMessage = "Internal error. Please check your wallet balance.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Tokenization Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const getBlockExplorerUrl = (type: 'tx' | 'token' | 'address') => {
    const baseUrl = chainId === 11155111 
      ? 'https://sepolia.etherscan.io' 
      : 'https://etherscan.io';
      
    switch (type) {
      case 'tx':
        return `${baseUrl}/tx/${transactionDetails.txHash}`;
      case 'token':
        return `${baseUrl}/token/${transactionDetails.contractAddress}?a=${transactionDetails.tokenId}`;
      case 'address':
        return `${baseUrl}/address/${transactionDetails.contractAddress}`;
      default:
        return baseUrl;
    }
  };

  return (
    <>
      {!isActive ? (
        <div className="text-center space-y-4 py-8">
          <h3 className="text-xl font-semibold">Connect Your Wallet</h3>
          <p className="text-muted-foreground">Connect your wallet to start tokenizing your assets</p>
          <Button 
            onClick={connect} 
            disabled={isWalletLoading}
            className="w-full max-w-sm"
          >
            {isWalletLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wallet className="mr-2 h-4 w-4" />
            )}
            Connect Wallet
          </Button>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-muted-foreground">Connected: {account?.slice(0, 6)}...{account?.slice(-4)}</p>
              <Button variant="outline" size="sm" onClick={disconnect}>
                Disconnect
              </Button>
            </div>

            <FormField
              control={form.control}
              name="assetName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asset Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter asset name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Describe your asset" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="file"
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <FormLabel>Asset File</FormLabel>
                  <FormControl>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-2" />
                          <p className="mb-2 text-sm">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Supported files: Images, PDFs, Documents
                          </p>
                        </div>
                        <Input
                          type="file"
                          className="hidden"
                          onChange={(e) => onChange(e.target.files)}
                          {...field}
                        />
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isProcessing && (
              <div className="space-y-2">
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-center text-muted-foreground">
                  {progress < 30 && "Uploading to IPFS..."}
                  {progress >= 30 && progress < 50 && "Preparing contract..."}
                  {progress >= 50 && progress < 70 && "Minting NFT..."}
                  {progress >= 70 && progress < 100 && "Confirming transaction..."}
                  {progress === 100 && "Complete!"}
                  {" "}{progress}%
                </p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing
                </>
              ) : (
                'Tokenize Asset'
              )}
            </Button>
          </form>
        </Form>
      )}

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Asset Successfully Tokenized!</DialogTitle>
            <DialogDescription>
              Your asset has been successfully tokenized on the blockchain. View transaction details below:
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Transaction Hash:</p>
              <div className="flex items-center gap-2">
                <code className="bg-muted p-2 rounded text-sm flex-1 overflow-hidden text-ellipsis">
                  {transactionDetails.txHash}
                </code>
                <Button variant="outline" size="sm" onClick={() => window.open(getBlockExplorerUrl('tx'), '_blank')}>
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Token ID:</p>
              <div className="flex items-center gap-2">
                <code className="bg-muted p-2 rounded text-sm flex-1">
                  {transactionDetails.tokenId}
                </code>
                <Button variant="outline" size="sm" onClick={() => window.open(getBlockExplorerUrl('token'), '_blank')}>
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Contract Address:</p>
              <div className="flex items-center gap-2">
                <code className="bg-muted p-2 rounded text-sm flex-1 overflow-hidden text-ellipsis">
                  {transactionDetails.contractAddress}
                </code>
                <Button variant="outline" size="sm" onClick={() => window.open(getBlockExplorerUrl('address'), '_blank')}>
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
