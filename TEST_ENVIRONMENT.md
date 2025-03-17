# Test Environment Setup for RideChain dApp

This guide will help you set up a test environment for the RideChain decentralized ride-sharing application using the Sepolia test network.

## Prerequisites

1. MetaMask browser extension installed
2. Node.js and npm installed
3. Basic understanding of Ethereum and smart contracts

## Setting Up MetaMask with Sepolia Test Network

1. **Open MetaMask** and click on the network dropdown at the top (it might say "Ethereum Mainnet")
2. **Select "Sepolia Test Network"** from the dropdown

If you don't see Sepolia, you can add it:
1. Click "Add Network"
2. Select "Sepolia" from the list of popular networks
3. Click "Add"

## Getting Test ETH

You'll need some test ETH to interact with the dApp:

1. Visit a Sepolia faucet like [sepoliafaucet.com](https://sepoliafaucet.com/)
2. Enter your MetaMask wallet address
3. Complete any verification steps
4. Receive test ETH (usually takes a few seconds to minutes)

## Environment Setup

1. Create a `.env` file in the project root with the following variables:
   ```
   PRIVATE_KEY=your_metamask_private_key_here
   INFURA_API_KEY=your_infura_api_key_here
   ETHERSCAN_API_KEY=your_etherscan_api_key_here
   ```

   > **IMPORTANT**: Never share your private key or commit it to version control!
   > To export your private key from MetaMask:
   > 1. Click on the three dots in the top-right corner
   > 2. Go to "Account details"
   > 3. Click "Export Private Key"
   > 4. Enter your password and copy the key

2. If you don't have an Infura API key, you can get one for free at [infura.io](https://infura.io/)

## Deploying to Sepolia

1. Compile the smart contracts:
   ```
   npm run blockchain:compile
   ```

2. Deploy to Sepolia:
   ```
   npm run blockchain:deploy:sepolia
   ```

3. The contract address will be automatically saved to `.env.local`

4. Verify your contract on Etherscan (optional):
   ```
   npm run blockchain:verify YOUR_CONTRACT_ADDRESS
   ```

## Running the dApp with Sepolia

1. Start the development server:
   ```
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:5173`

3. Connect your MetaMask wallet (make sure it's set to the Sepolia network)

4. Register as a rider or driver

5. Start using the dApp!

## Testing Tips

1. **Use multiple accounts**: Create multiple MetaMask accounts to test both rider and driver functionality
2. **Monitor transactions**: Use [Sepolia Etherscan](https://sepolia.etherscan.io/) to monitor your transactions
3. **Reset if needed**: If you encounter issues, you can reset your account in MetaMask (Settings > Advanced > Reset Account)

## Troubleshooting

- **Transaction failing**: Make sure you have enough test ETH for gas fees
- **Contract not found**: Verify that the contract address in `.env.local` is correct
- **Network issues**: Ensure you're connected to the Sepolia network in MetaMask

## Important Notes

- This is a test environment. Do not use real ETH or sensitive information.
- Test networks occasionally reset or have issues. If you encounter persistent problems, try another test network like Goerli.
- The dApp's functionality is limited to the features implemented in the smart contracts. 