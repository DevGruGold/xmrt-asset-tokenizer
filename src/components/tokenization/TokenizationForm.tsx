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
import { Loader2, Upload, ExternalLink } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsProcessing(true);
    
    try {
      // Simulate tokenization process
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i);
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Simulate blockchain transaction details
      const mockTransactionDetails = {
        txHash: '0x' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
        tokenId: Math.floor(Math.random() * 1000000).toString(),
        contractAddress: '0x' + Math.random().toString(36).substring(2, 40)
      };

      setTransactionDetails(mockTransactionDetails);
      setShowSuccessDialog(true);

      toast({
        title: "Asset Tokenized Successfully",
        description: "Your asset has been tokenized and added to the blockchain",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error tokenizing your asset",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const getEtherscanUrl = (type: 'tx' | 'token' | 'address') => {
    const baseUrl = 'https://etherscan.io';
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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-800">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2" />
                        <p className="mb-2 text-sm">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-400">
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
              <p className="text-sm text-center text-gray-400">
                Tokenizing your asset... {progress}%
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

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Asset Successfully Tokenized!</DialogTitle>
            <DialogDescription>
              Your asset has been successfully tokenized on the Ethereum blockchain. You can verify the transaction using the links below:
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Transaction Hash:</p>
              <div className="flex items-center gap-2">
                <code className="bg-gray-800 p-2 rounded text-sm flex-1 overflow-hidden text-ellipsis">
                  {transactionDetails.txHash}
                </code>
                <Button variant="outline" size="sm" onClick={() => window.open(getEtherscanUrl('tx'), '_blank')}>
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Token ID:</p>
              <div className="flex items-center gap-2">
                <code className="bg-gray-800 p-2 rounded text-sm flex-1">
                  {transactionDetails.tokenId}
                </code>
                <Button variant="outline" size="sm" onClick={() => window.open(getEtherscanUrl('token'), '_blank')}>
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Contract Address:</p>
              <div className="flex items-center gap-2">
                <code className="bg-gray-800 p-2 rounded text-sm flex-1 overflow-hidden text-ellipsis">
                  {transactionDetails.contractAddress}
                </code>
                <Button variant="outline" size="sm" onClick={() => window.open(getEtherscanUrl('address'), '_blank')}>
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