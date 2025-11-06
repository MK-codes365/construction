// Anchor report hash to blockchain
const { ethers } = require('ethers');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

// Deployed contract address and ABI
const incidentWasteLogAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const incidentWasteLogAbi = require('../../blockchain/artifacts/contracts/IncidentWasteLog.sol/IncidentWasteLog.json').abi;

// Connect to local Hardhat network
const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');

// Create wallet from private key
if (!process.env.PRIVATE_KEY) {
    throw new Error('PRIVATE_KEY not found in environment variables');
}

// Use a known Hardhat test account private key for local development
const privateKey = 'ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';

const wallet = new ethers.Wallet(privateKey, provider);
const contract = new ethers.Contract(incidentWasteLogAddress, incidentWasteLogAbi, wallet);

// Anchor report hash
async function anchorReportHash(hash, description) {
  const tx = await contract.reportIncident(`${description} | Hash: ${hash}`);
  const receipt = await tx.wait();
  return {
    txHash: receipt.transactionHash,
    blockNumber: receipt.blockNumber,
    hash,
    description,
  };
}

module.exports = { anchorReportHash };
