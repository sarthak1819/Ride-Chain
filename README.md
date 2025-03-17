# Decentralized Ride Sharing Application

A blockchain-based ride sharing platform built with React, Hardhat, and Solidity.

## Features

- Decentralized ride sharing on the blockchain
- User registration as riders or drivers
- Ride requesting, accepting, and completing
- Rating system for users
- Secure payment handling
- Transparent fee structure

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Smart Contracts**: Solidity
- **Blockchain Development**: Hardhat, Ethers.js
- **Testing**: Chai, Mocha

## Prerequisites

- Node.js (v16+)
- npm or yarn
- MetaMask browser extension

## Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd decentralized-ride-sharing
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```
PRIVATE_KEY=your_private_key_here
INFURA_API_KEY=your_infura_api_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key_here
```

## Running the Application

### Development Mode

To run the application in development mode with a local blockchain:

```bash
npm run dev:full
```

This will:
1. Start a local Hardhat blockchain node
2. Deploy the smart contracts to the local blockchain
3. Start the React development server

### Running Components Separately

To run the blockchain node only:

```bash
npm run blockchain:node
```

To deploy contracts to the local blockchain:

```bash
npm run blockchain:deploy
```

To run the frontend only:

```bash
npm run dev
```

### Testing

Run the smart contract tests:

```bash
npm run blockchain:test
```

## Deployment

### Smart Contracts

To deploy to a testnet (e.g., Sepolia):

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

### Frontend

Build the frontend for production:

```bash
npm run build
```

## Project Structure

- `/contracts`: Solidity smart contracts
- `/scripts`: Deployment and utility scripts
- `/test`: Smart contract tests
- `/src`: Frontend React application
  - `/components`: React components
  - `/utils`: Utility functions including web3 integration
  - `/artifacts`: Compiled contract ABIs (generated)

## License

MIT
