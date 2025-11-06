import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory store for demo purposes.
// Note: Serverless functions are ephemeral — this keeps data for the lifetime
// of a warm runtime but is not durable. For production, use a database.
let wasteLogs: any[] = [];

export async function GET() {
  return NextResponse.json({ status: 'ok', logs: wasteLogs });
}

export async function POST(request: NextRequest) {
  try {
    const log = await request.json();
    log.timestamp = new Date().toISOString();
    if (!log.id) log.id = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
    wasteLogs.push(log);
    return NextResponse.json({ status: 'ok', log });
  } catch (err: any) {
    return NextResponse.json({ status: 'error', error: err?.message || String(err) }, { status: 400 });
  }
}
