// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  console.log("Deploying RideSharing contract...");

  const RideSharing = await hre.ethers.getContractFactory("RideSharing");
  const rideSharing = await RideSharing.deploy();

  await rideSharing.waitForDeployment();

  const address = await rideSharing.getAddress();
  console.log(`RideSharing deployed to: ${address}`);
  
  // Get the network name
  const networkName = hre.network.name;
  console.log(`Deployed on network: ${networkName}`);
  
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
        `VITE_NETWORK=${networkName}`
      );
    } else {
      envContent += `\nVITE_NETWORK=${networkName}`;
    }
    
    // Write back to .env.local
    fs.writeFileSync(envPath, envContent.trim());
    console.log(`.env.local updated with contract address and network information`);
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