import { ethers } from 'ethers';
import { NextRequest, NextResponse } from 'next/server';

// Initialize provider and wallet safely (trim environment values)
const rpcUrl = (process.env.ETH_RPC_URL || '').trim();
const mainnetKey = (process.env.MAINNET_PRIVATE_KEY || '').trim();
const provider = rpcUrl ? new ethers.providers.JsonRpcProvider(rpcUrl) : undefined;
const wallet = mainnetKey && provider ? new ethers.Wallet(mainnetKey, provider) : undefined;

// URL of an external blockchain anchoring service (optional). If provided,
// requests will be proxied to that service when the local server wallet is not
// configured. Default to localhost backend used in development.
const BLOCKCHAIN_SERVICE_URL = (process.env.BLOCKCHAIN_SERVICE_URL || 'http://localhost:4001').trim();

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

    if (!wallet) {
      // If the server wallet is not available, try proxying the request to an
      // external blockchain service (e.g. backend/blockchain-listener). This
      // allows anchoring to succeed in development where a separate service
      // runs the contract interactions.
      try {
        const forwardRes = await fetch(`${BLOCKCHAIN_SERVICE_URL}/blockchain/anchor-report`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ hash, description }),
        });

        const forwardJson = await forwardRes.json();
        // Forward the backend response status and payload
        return NextResponse.json(forwardJson, { status: forwardRes.status });
      } catch (err: any) {
        console.error('Failed to proxy anchor request to blockchain service:', err);
        return NextResponse.json(
          { status: 'error', message: 'Server wallet not configured and proxy failed', error: err?.message },
          { status: 500 }
        );
      }
    }

    // Create transaction (replace with your actual contract call)
    const transaction = await wallet.sendTransaction({
      to: ethers.constants.AddressZero,
      data: ethers.utils.hexlify(ethers.utils.toUtf8Bytes(hash)),
    });

    // Wait for transaction to be mined
    const receipt = await transaction.wait();

    return NextResponse.json({
      status: 'ok',
      transactionHash: receipt.transactionHash,
      blockNumber: receipt.blockNumber,
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