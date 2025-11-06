import { ethers } from 'ethers';
import { NextRequest, NextResponse } from 'next/server';

// Contract addresses
const milestonePaymentsAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';
const incidentWasteLogAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    contracts: {
      milestonePayments: milestonePaymentsAddress,
      incidentWasteLog: incidentWasteLogAddress,
    },
  });
}