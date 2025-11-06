require("@nomiclabs/hardhat-ethers");
require('dotenv').config({ path: './.env' });

module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: {
      chainId: 31337
    },
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    mainnet: {
      url: process.env.ETH_RPC_URL || "https://eth-mainnet.g.alchemy.com/v2/your-api-key",
      accounts: [process.env.MAINNET_PRIVATE_KEY].filter(Boolean)
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};