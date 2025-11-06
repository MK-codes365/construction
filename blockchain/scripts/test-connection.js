async function main() {
    console.log('Testing Ethereum mainnet connection...');
    
    // Get the current block number
    const blockNumber = await ethers.provider.getBlockNumber();
    console.log('Current block number:', blockNumber);
    
    // Get some network information
    const network = await ethers.provider.getNetwork();
    console.log('Network:', network.name, '(chainId:', network.chainId, ')');
    
    // Get the balance of the deployment account
    const [signer] = await ethers.getSigners();
    const balance = await ethers.provider.getBalance(signer.address);
    console.log('Account address:', signer.address);
    console.log('Account balance:', ethers.utils.formatEther(balance), 'ETH');
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });