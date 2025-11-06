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
    // Forward the waste log to the AI service for immediate analysis (best-effort)
    try {
      const AI_BASE = process.env.AI_BASE || 'http://localhost:4000';
      const aiRes = await fetch(`${AI_BASE}/ai/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(log),
      });
      if (aiRes.ok) {
        const analysis = await aiRes.json();
        // deliver analysis but also attempt to notify GIS service asynchronously
        (async () => {
          try {
            const GIS_BASE = process.env.GIS_BASE || 'http://localhost:4003';
            await fetch(`${GIS_BASE}/gis/publish`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(log) });
          } catch (e) { /* best-effort */ }
        })();
        // attach analysis to response
        return NextResponse.json({ status: 'ok', log, analysis });
      } else {
        try {
          const GIS_BASE = process.env.GIS_BASE || 'http://localhost:4003';
          await fetch(`${GIS_BASE}/gis/publish`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(log) });
        } catch (e) { /* best-effort */ }
        return NextResponse.json({ status: 'ok', log, analysis: { status: 'error', error: 'AI service returned error' } });
      }
    } catch (e) {
      try {
        const GIS_BASE = process.env.GIS_BASE || 'http://localhost:4003';
        await fetch(`${GIS_BASE}/gis/publish`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(log) });
      } catch (e) { /* best-effort */ }
      return NextResponse.json({ status: 'ok', log, analysis: { status: 'error', error: String(e) } });
    }
  } catch (err: any) {
    return NextResponse.json({ status: 'error', error: err?.message || String(err) }, { status: 400 });
  }
}
