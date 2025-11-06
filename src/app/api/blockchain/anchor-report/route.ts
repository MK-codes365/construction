import { ethers } from 'ethers';
import { NextRequest, NextResponse } from 'next/server';

// Initialize provider
const provider = new ethers.providers.JsonRpcProvider(process.env.ETH_RPC_URL);
const wallet = new ethers.Wallet(process.env.MAINNET_PRIVATE_KEY || '', provider);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { hash, description } = body;

    if (!hash || !description) {
      return NextResponse.json(
        { status: 'error', message: 'Hash and description are required' },
        { status: 400 }
      );
    }

    // Create transaction (replace with your actual contract call)
    const transaction = await wallet.sendTransaction({
      to: ethers.constants.AddressZero,
      data: ethers.utils.hexlify(ethers.utils.toUtf8Bytes(hash))
    });

    // Wait for transaction to be mined
    const receipt = await transaction.wait();

    return NextResponse.json({
      status: 'ok',
      transactionHash: receipt.transactionHash,
      blockNumber: receipt.blockNumber
    });
  } catch (error: any) {
    console.error('Failed to anchor report:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to anchor report',
        error: error.message 
      },
      { status: 500 }
    );
  }
}