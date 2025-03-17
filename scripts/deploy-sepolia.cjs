// Script to deploy the RideSharing contract to the Sepolia test network
const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  console.log("Deploying RideSharing contract to Sepolia...");
  
  // Check if we're on the right network
  const network = hre.network.name;
  if (network !== 'sepolia') {
    console.warn(`Warning: You're deploying to ${network}, not sepolia!`);
  }

  // Deploy the contract
  const RideSharing = await hre.ethers.getContractFactory("RideSharing");
  const rideSharing = await RideSharing.deploy();

  console.log("Waiting for deployment transaction to be mined...");
  await rideSharing.waitForDeployment();

  const address = await rideSharing.getAddress();
  console.log(`RideSharing deployed to: ${address}`);
  console.log(`Deployed on network: ${network}`);
  
  // Save the contract address to .env.local
  const envPath = path.resolve(__dirname, '../.env.local');
  let envContent = '';
  
  try {
    // Try to read existing .env.local file
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }
    
    // Replace or add the VITE_CONTRACT_ADDRESS line
    if (envContent.includes('VITE_CONTRACT_ADDRESS=')) {
      envContent = envContent.replace(
        /VITE_CONTRACT_ADDRESS=.*/,
        `VITE_CONTRACT_ADDRESS=${address}`
      );
    } else {
      envContent += `\nVITE_CONTRACT_ADDRESS=${address}`;
    }
    
    // Add network information
    if (envContent.includes('VITE_NETWORK=')) {
      envContent = envContent.replace(
        /VITE_NETWORK=.*/,
        `VITE_NETWORK=${network}`
      );
    } else {
      envContent += `\nVITE_NETWORK=${network}`;
    }
    
    // Write back to .env.local
    fs.writeFileSync(envPath, envContent.trim());
    console.log(`.env.local updated with contract address and network information`);
    
    console.log("\nVerify your contract on Etherscan with:");
    console.log(`npx hardhat verify --network sepolia ${address}`);
  } catch (error) {
    console.error('Error updating .env.local file:', error);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 