const ethers = require('ethers');
require('dotenv').config({ path: '../.env' });

async function main() {
    try {
        // Create provider using Alchemy URL
        const provider = new ethers.providers.JsonRpcProvider(process.env.ETH_RPC_URL);
        await provider.getNetwork(); // Test the connection
        
        // Get current block number
        const blockNumber = await provider.getBlockNumber();
        console.log('Current block number:', blockNumber);
        
        // Create wallet instance
        const wallet = new ethers.Wallet(process.env.MAINNET_PRIVATE_KEY, provider);
        
        // Get account balance
        const balance = await provider.getBalance(wallet.address);
        console.log('Account address:', wallet.address);
        console.log('Account balance:', ethers.formatEther(balance), 'ETH');
        
        console.log('✅ Connection test successful!');
    } catch (error) {
        console.error('❌ Connection test failed:', error.message);
    }
}

main();