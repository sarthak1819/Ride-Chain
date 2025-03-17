const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Start local Hardhat node
console.log('Starting local Hardhat node...');
const nodeProcess = require('child_process').spawn('npx', ['hardhat', 'node'], {
  stdio: 'inherit'
});

// Wait for node to start
setTimeout(async () => {
  try {
    // Deploy contract to local node
    console.log('Deploying contract to local node...');
    const output = execSync('npx hardhat run --network localhost scripts/deploy.cjs', { encoding: 'utf-8' });
    
    // Extract contract address
    const addressMatch = output.match(/RideSharing deployed to: (0x[a-fA-F0-9]{40})/);
    if (addressMatch && addressMatch[1]) {
      const contractAddress = addressMatch[1];
      console.log(`Contract deployed at: ${contractAddress}`);
      
      // Update .env.local file
      const envLocalPath = path.join(__dirname, '..', '.env.local');
      let envContent = '';
      
      if (fs.existsSync(envLocalPath)) {
        envContent = fs.readFileSync(envLocalPath, 'utf-8');
        envContent = envContent.replace(/VITE_CONTRACT_ADDRESS=.*/, `VITE_CONTRACT_ADDRESS=${contractAddress}`);
      } else {
        envContent = `VITE_CONTRACT_ADDRESS=${contractAddress}\nVITE_NETWORK_ID=1337`;
      }
      
      fs.writeFileSync(envLocalPath, envContent);
      console.log('.env.local updated with contract address');
    } else {
      console.error('Failed to extract contract address from deployment output');
    }
  } catch (error) {
    console.error('Error deploying contract:', error);
    nodeProcess.kill();
    process.exit(1);
  }
}, 5000);

// Handle process termination
process.on('SIGINT', () => {
  console.log('Stopping local node...');
  nodeProcess.kill();
  process.exit();
}); 