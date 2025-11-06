// In-memory event log
const blockchainEvents = [];

function addBlockchainEvent(type, description, txHash, blockNumber, timestamp) {
  blockchainEvents.unshift({ type, description, txHash, blockNumber, timestamp });
  if (blockchainEvents.length > 50) blockchainEvents.pop();
}

const express = require('express');
const { ethers } = require('ethers');
const path = require('path');
const cors = require('cors');
const { anchorReportHash } = require('./anchorReport');

// Load environment variables
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

// Environment configuration
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const RPC_URL = IS_PRODUCTION 
  ? process.env.ETH_RPC_URL 
  : 'http://localhost:8545';

// Initialize Express
const app = express();
app.use(cors());
app.use(express.json());

// Deployed contract addresses
const milestonePaymentsAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';
const incidentWasteLogAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

// Replace with your ABI files (output from Hardhat compile)
let milestonePaymentsAbi = [];
let incidentWasteLogAbi = [];
try {
  milestonePaymentsAbi = require('../../blockchain/artifacts/contracts/MilestonePayments.sol/MilestonePayments.json').abi;
  incidentWasteLogAbi = require('../../blockchain/artifacts/contracts/IncidentWasteLog.sol/IncidentWasteLog.json').abi;
} catch (e) {
  console.warn('ABI files not found. Compile contracts first.');
}

// Connect to Ethereum
let provider, wallet, milestonePayments, incidentWasteLog;

try {
  provider = new ethers.providers.JsonRpcProvider(RPC_URL);
  
  // Use mainnet private key in production, local private key in development
  const privateKey = IS_PRODUCTION ? process.env.MAINNET_PRIVATE_KEY : process.env.PRIVATE_KEY;
  wallet = privateKey ? new ethers.Wallet(privateKey, provider) : provider;

  // Initialize contracts if ABIs are available
  if (milestonePaymentsAbi.length) {
    milestonePayments = new ethers.Contract(milestonePaymentsAddress, milestonePaymentsAbi, wallet);
    console.log('MilestonePayments contract connected');
  }
  
  if (incidentWasteLogAbi.length) {
    incidentWasteLog = new ethers.Contract(incidentWasteLogAddress, incidentWasteLogAbi, wallet);
    console.log('IncidentWasteLog contract connected');
  }
} catch (error) {
  console.error('Failed to connect to blockchain:', error);
}

// Set up event listeners
if (milestonePayments) {
  milestonePayments.on('MilestoneMarkedComplete', (milestoneId, event) => {
    const txHash = event.transactionHash;
    const blockNumber = event.blockNumber;
    addBlockchainEvent('MilestoneMarkedComplete', `Milestone ${milestoneId} marked complete.`, txHash, blockNumber);
    console.log(`Milestone ${milestoneId} marked complete.`);
  });

  milestonePayments.on('MilestonePaid', (milestoneId, amount, contractor, event) => {
    const txHash = event.transactionHash;
    const blockNumber = event.blockNumber;
    addBlockchainEvent('MilestonePaid', `Milestone ${milestoneId} paid: ${ethers.utils.formatEther(amount)} ETH to ${contractor}`, txHash, blockNumber);
    console.log(`Milestone ${milestoneId} paid: ${ethers.utils.formatEther(amount)} ETH to ${contractor}`);
  });
}

if (incidentWasteLog) {
  incidentWasteLog.on('IncidentReported', (id, description, reporter, timestamp, event) => {
    const txHash = event.transactionHash;
    const blockNumber = event.blockNumber;
    addBlockchainEvent('IncidentReported', `Incident #${id} reported: ${description} by ${reporter}`, txHash, blockNumber, new Date(timestamp * 1000).toISOString());
    console.log(`Incident #${id} reported: ${description} by ${reporter} at ${new Date(timestamp * 1000).toISOString()}`);
  });

  incidentWasteLog.on('WasteLogged', (id, materialType, quantity, site, logger, timestamp, event) => {
    const txHash = event.transactionHash;
    const blockNumber = event.blockNumber;
    addBlockchainEvent('WasteLogged', `Waste log #${id}: ${materialType}, ${quantity}kg at ${site} by ${logger}`, txHash, blockNumber, new Date(timestamp * 1000).toISOString());
    console.log(`Waste log #${id}: ${materialType}, ${quantity}kg at ${site} by ${logger} at ${new Date(timestamp * 1000).toISOString()}`);
  });
}

// API endpoint: get recent blockchain events
app.get('/blockchain/events', (req, res) => {
  res.json({ status: 'ok', events: blockchainEvents });
});

// API endpoint: get contract addresses
app.get('/blockchain/contracts', (req, res) => {
  res.json({
    status: 'ok',
    contracts: {
      milestonePayments: milestonePaymentsAddress,
      incidentWasteLog: incidentWasteLogAddress,
    },
  });
});

// API endpoint: anchor report hash
app.post('/blockchain/anchor-report', (req, res) => {
  const { hash, description } = req.body;
  
  if (!hash || !description) {
    return res.status(400).json({ 
      status: 'error', 
      message: 'Hash and description are required' 
    });
  }

  anchorReportHash(hash, description, wallet)
    .then(result => {
      addBlockchainEvent(
        'ReportAnchored', 
        `Report anchored: ${description}`, 
        result.transactionHash, 
        result.blockNumber,
        new Date().toISOString()
      );

      res.json({ 
        status: 'ok', 
        transactionHash: result.transactionHash,
        blockNumber: result.blockNumber
      });
    })
    .catch(error => {
      console.error('Failed to anchor report:', error);
      res.status(500).json({ 
        status: 'error', 
        message: 'Failed to anchor report',
        error: error.message 
      });
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    blockchain: {
      connected: !!provider,
      network: IS_PRODUCTION ? 'mainnet' : 'localhost',
      contracts: {
        milestonePayments: !!milestonePayments,
        incidentWasteLog: !!incidentWasteLog
      }
    }
  });
});

// Start server
const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`Blockchain Service running on port ${PORT}`);
});