import { ethers } from 'ethers';
import { NextRequest, NextResponse } from 'next/server';

// Initialize provider
const provider = new ethers.providers.JsonRpcProvider(process.env.ETH_RPC_URL);
const wallet = new ethers.Wallet(process.env.MAINNET_PRIVATE_KEY || '', provider);

// Contract addresses
const milestonePaymentsAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';
const incidentWasteLogAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

export async function GET() {
  try {
    const blockNumber = await provider.getBlockNumber();
    const network = await provider.getNetwork();

    return NextResponse.json({
      status: 'ok',
      blockchain: {
        connected: true,
        network: network.name,
        blockNumber,
        contracts: {
          milestonePayments: milestonePaymentsAddress,
          incidentWasteLog: incidentWasteLogAddress
        }
      }
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to connect to blockchain' },
      { status: 500 }
    );
  }
}