# MobileMonero - Testnet Faucet & Mining Platform

**A Secure Testnet Faucet and Mining Platform for Monero Development**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-97.9%25-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![Ethereum](https://img.shields.io/badge/Testnet-Sepolia-purple.svg)](https://sepolia.etherscan.io/)

## Overview

MobileMonero is a comprehensive platform that combines a Sepolia testnet faucet with integrated Monero mining capabilities. Built for developers and cryptocurrency enthusiasts, this platform provides free testnet tokens for development while offering seamless access to Monero mining through our partner platform.

The application leverages modern web technologies and blockchain integration to create a user-friendly experience for both testnet development and cryptocurrency mining operations.

## Key Features

### 💧 Sepolia Testnet Faucet
- **Free Test Tokens**: Get free Sepolia testnet tokens for development
- **MetaMask Integration**: Seamless wallet connection and token claiming
- **Rate Limiting**: Fair distribution with built-in rate limiting
- **Token Information**: Real-time token balance and transaction tracking

### ⛏️ Monero Mining Integration
- **One-Click Mining**: Direct integration with xmrtstart.vercel.app
- **Mobile Optimized**: Designed for mobile Monero mining
- **Secure Access**: Safe redirect to verified mining platform
- **Performance Focused**: Optimized for efficient mining operations

### 🌐 Web3 Integration
- **MetaMask Support**: Native integration with MetaMask wallet
- **Sepolia Testnet**: Development and testing environment support
- **Ethereum Compatible**: ERC-20 token standard compliance
- **Real-time Updates**: Live transaction status and confirmations

### 🎨 Modern UI/UX
- **Responsive Design**: Works perfectly on all device sizes
- **Dark/Light Mode**: Automatic theme detection and switching
- **Accessible**: WCAG compliant and screen reader friendly
- **Fast Loading**: Optimized performance with Vite build system

## Technology Stack

### Frontend
- **React 18.x**: Modern React with hooks and functional components
- **TypeScript**: Type-safe development for enhanced reliability
- **Vite**: Lightning-fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **shadcn/ui**: Modern component library for consistent UI/UX

### Blockchain Integration
- **Ethereum Sepolia**: Testnet environment for development
- **MetaMask**: Primary wallet integration for user authentication
- **Web3 Provider**: Direct blockchain interaction capabilities
- **ERC-20 Tokens**: Standard token implementation for testing

### Development Tools
- **ESLint**: Code linting and quality assurance
- **PostCSS**: CSS processing and optimization
- **Bun**: Fast JavaScript runtime and package manager
- **Git**: Version control and collaboration

## Smart Contract Details

The MobileMonero testnet faucet interacts with the following token contract:

| Property | Value |
|----------|-------|
| **Contract Address** | 0x77307DFbc436224d5e6f2048d2b6bDfA66998a15 |
| **Network** | Sepolia Testnet |
| **Chain ID** | 11155111 |
| **Token Standard** | ERC-20 |

### Faucet Features
- **Daily Limits**: Controlled token distribution
- **Address Verification**: MetaMask address validation
- **Transaction Tracking**: Complete transaction history
- **Anti-Spam Protection**: Built-in rate limiting and abuse prevention

## Getting Started

### Prerequisites

Before you begin, ensure you have the following:
- **MetaMask** browser extension installed
- **Sepolia ETH** for transaction fees (get from official Sepolia faucets)
- **Modern Browser** with Web3 support

### Quick Start

1. **Visit the Platform**
   Navigate to the MobileMonero platform in your web browser

2. **Connect MetaMask**
   - Click "Connect Wallet" 
   - Approve the connection in MetaMask
   - Ensure you're on Sepolia testnet

3. **Claim Test Tokens**
   - Enter your wallet address
   - Click "Request Tokens"
   - Confirm the transaction in MetaMask

4. **Start Mining** (Optional)
   - Click "Start Mining" to access the mining platform
   - Follow the setup instructions on xmrtstart.vercel.app

### Development Setup

For developers wanting to run locally:

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-repo/mobilemonero.git
   cd mobilemonero
   ```

2. **Install dependencies**
   ```bash
   # Using npm
   npm install
   
   # Or using bun (recommended)
   bun install
   ```

3. **Start the development server**
   ```bash
   # Using npm
   npm run dev
   
   # Or using bun
   bun run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## Usage Guide

### Using the Faucet

1. **Connect Your Wallet**
   - Install MetaMask if you haven't already
   - Switch to Sepolia testnet in MetaMask
   - Click "Connect Wallet" in the application

2. **Request Tokens**
   - Your wallet address will be automatically filled
   - Click "Request Tokens" to initiate the claim
   - Confirm the transaction in MetaMask
   - Wait for transaction confirmation

3. **Check Your Balance**
   - View your token balance in the faucet interface
   - Check transaction history on Sepolia Etherscan
   - Tokens are immediately available for use

### Mining Integration

1. **Access Mining Platform**
   - Click the "Start Mining" button
   - You'll be redirected to xmrtstart.vercel.app
   - Follow the mining setup instructions

2. **Mobile Mining**
   - The platform is optimized for mobile devices
   - Efficient mining algorithms for mobile hardware
   - Real-time mining statistics and earnings

## API Integration

### Faucet API

The platform provides API endpoints for programmatic access:

```javascript
// Check faucet status
GET /api/faucet/status

// Request tokens (requires valid signature)
POST /api/faucet/claim
{
  "address": "0x...",
  "signature": "0x..."
}

// Get claim history
GET /api/faucet/history/:address
```

### Web3 Integration

```javascript
// Connect to MetaMask
const provider = window.ethereum;
await provider.request({ method: 'eth_requestAccounts' });

// Switch to Sepolia
await provider.request({
  method: 'wallet_switchEthereumChain',
  params: [{ chainId: '0xaa36a7' }], // Sepolia chain ID
});
```

## Security Considerations

### Smart Contract Security
- **Verified Contracts**: All contracts are verified on Etherscan
- **Rate Limiting**: Built-in protection against spam and abuse
- **Address Validation**: Comprehensive address verification
- **Transaction Monitoring**: Real-time transaction monitoring

### Frontend Security
- **Input Validation**: All user inputs are validated
- **XSS Protection**: Protection against cross-site scripting
- **Secure Communication**: HTTPS for all API communications
- **Private Key Safety**: No private keys are ever stored or transmitted

### Best Practices
- **Testnet Only**: Platform is for testnet development only
- **No Real Value**: Testnet tokens have no monetary value
- **Regular Updates**: Keep MetaMask and browser updated
- **Verify URLs**: Always verify you're on the correct domain

## Contributing

We welcome contributions from the community! Please follow these guidelines:

### Development Workflow

1. **Fork the Repository**
2. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make Changes** with proper testing
4. **Submit Pull Request** with detailed description

### Code Standards
- **TypeScript**: Use TypeScript for all new code
- **ESLint**: Follow ESLint configuration
- **Testing**: Include tests for new functionality
- **Documentation**: Update docs for new features

## Deployment

### Production Build

```bash
# Build the application
npm run build

# Preview the build
npm run preview
```

### Environment Variables

```env
VITE_INFURA_KEY=your_infura_project_id
VITE_SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/your_key
VITE_TOKEN_CONTRACT_ADDRESS=0x77307DFbc436224d5e6f2048d2b6bDfA66998a15
```

## Roadmap

### Current Features ✅
- Sepolia testnet faucet
- MetaMask integration
- Mining platform integration
- Responsive design

### Upcoming Features 🔄
- Multi-token support
- Enhanced mining analytics
- Mobile app version
- Advanced rate limiting

### Future Plans 📋
- Mainnet integration
- Additional mining pools
- API expansion
- Community features

## Support

### Getting Help
- **GitHub Issues**: Report bugs and request features
- **Documentation**: Comprehensive guides available
- **Community**: Join our developer community

### Links
- **Faucet**: Access the testnet faucet
- **Mining**: xmrtstart.vercel.app
- **Sepolia Explorer**: https://sepolia.etherscan.io/
- **MetaMask**: https://metamask.io/

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **Ethereum Foundation** for Sepolia testnet infrastructure
- **MetaMask** for wallet integration
- **React Team** for the excellent framework
- **Vite Team** for fast build tooling
- **Tailwind CSS** for utility-first styling

## Disclaimer

This platform is for development and testing purposes only. Testnet tokens have no monetary value. Users are responsible for their own security and should never share private keys or seed phrases.

---

**Built for the Monero Community | Powered by Ethereum Sepolia | Secured by Web3**