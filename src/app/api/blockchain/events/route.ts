import { ethers } from 'ethers';
import { NextResponse } from 'next/server';
import { config } from '@/lib/config';

// Query recent logs from the configured RPC for known contract addresses.
const provider = new ethers.providers.JsonRpcProvider(config.alchemy.rpcUrl);

// Keep the same addresses used elsewhere in the project
const milestonePaymentsAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';
const incidentWasteLogAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

export async function GET() {
  try {
    const latest = await provider.getBlockNumber();
    const from = Math.max(0, latest - 200); // look back ~200 blocks

    const logs = await provider.getLogs({
      fromBlock: from,
      toBlock: latest,
      // ethers v5 typings in this environment may expect a single string; cast to any to allow array
      address: [milestonePaymentsAddress, incidentWasteLogAddress] as any,
    });

    // Fetch timestamps for each block referenced by logs (dedupe)
    const blockNums = Array.from(new Set(logs.map((l) => l.blockNumber))).slice(0, 50);
    const blocks = await Promise.all(blockNums.map((n) => provider.getBlock(n)));
    const blockTimestamp = new Map<number, number>(blocks.map((b) => [b.number, b.timestamp]));

    // Map logs to a small event shape the frontend expects
    const events = logs
      .slice(-50) // limit to most recent 50 logs
      .reverse()
      .map((l) => ({
        type: 'contract_event',
        description: l.topics && l.topics.length ? l.topics[0] : 'Event',
        txHash: l.transactionHash,
        blockNumber: l.blockNumber,
        timestamp: blockTimestamp.get(l.blockNumber)
          ? new Date((blockTimestamp.get(l.blockNumber) as number) * 1000).toISOString()
          : undefined,
      }));

    return NextResponse.json({ status: 'ok', events });
  } catch (err: any) {
    console.error('Failed to fetch blockchain events:', err);
    return NextResponse.json({ status: 'error', message: err?.message || String(err) }, { status: 500 });
  }
}
