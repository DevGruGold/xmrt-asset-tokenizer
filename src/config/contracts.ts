// Contract addresses for different networks
export const CONTRACTS = {
  // Sepolia Testnet
  11155111: {
    XMRT_TOKEN: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', // Update with actual deployed address
    NFT_TOKENIZER: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199', // Update with actual deployed address
  },
  // Ethereum Mainnet
  1: {
    XMRT_TOKEN: '0x0000000000000000000000000000000000000000', // Update with actual deployed address
    NFT_TOKENIZER: '0x0000000000000000000000000000000000000000', // Update with actual deployed address
  },
  // Polygon
  137: {
    XMRT_TOKEN: '0x0000000000000000000000000000000000000000', // Update with actual deployed address
    NFT_TOKENIZER: '0x0000000000000000000000000000000000000000', // Update with actual deployed address
  },
  // Avalanche
  43114: {
    XMRT_TOKEN: '0x0000000000000000000000000000000000000000', // Update with actual deployed address
    NFT_TOKENIZER: '0x0000000000000000000000000000000000000000', // Update with actual deployed address
  },
} as const;

// ERC-721 NFT Tokenizer ABI (simplified for key functions)
export const NFT_TOKENIZER_ABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "name", "type": "string" },
      { "internalType": "string", "name": "description", "type": "string" },
      { "internalType": "string", "name": "metadataURI", "type": "string" }
    ],
    "name": "mintAsset",
    "outputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "from", "type": "address" },
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "uint256", "name": "tokenId", "type": "uint256" }
    ],
    "name": "transferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "uint256", "name": "tokenId", "type": "uint256" }
    ],
    "name": "approve",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
    "name": "ownerOf",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
    "name": "tokenURI",
    "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "owner", "type": "address" },
      { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" },
      { "indexed": false, "internalType": "string", "name": "metadataURI", "type": "string" }
    ],
    "name": "AssetMinted",
    "type": "event"
  }
] as const;

// ERC-20 XMRT Token ABI (simplified)
export const XMRT_TOKEN_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "transfer",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "account", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export function getContractAddress(chainId: number, contractName: 'XMRT_TOKEN' | 'NFT_TOKENIZER'): string {
  const contracts = CONTRACTS[chainId as keyof typeof CONTRACTS];
  if (!contracts) {
    throw new Error(`Unsupported chain ID: ${chainId}`);
  }
  return contracts[contractName];
}
