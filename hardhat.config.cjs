require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

// Load environment variables with fallbacks
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000001";
const INFURA_API_KEY = process.env.INFURA_API_KEY || "";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: {
      chainId: 1337
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 1337
    },
    // Only use these networks if you have the environment variables set
    ...(INFURA_API_KEY && PRIVATE_KEY.length >= 64 ? {
      sepolia: {
        url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
        accounts: [PRIVATE_KEY],
      },
      mumbai: {
        url: `https://polygon-mumbai.infura.io/v3/${INFURA_API_KEY}`,
        accounts: [PRIVATE_KEY],
      }
    } : {})
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY
  },
  paths: {
    artifacts: "./src/artifacts"
  }
};
