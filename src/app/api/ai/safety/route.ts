import { NextResponse } from 'next/server';

// Server-side proxy/api for AI safety data.
// It will attempt to fetch from AI_BASE (server env) if configured, otherwise
// return a simulated demo payload so the frontend remains functional.

const AI_BASE = process.env.AI_BASE || process.env.NEXT_PUBLIC_AI_BASE || '';

function demoPayload() {
  const now = new Date().toISOString();
  return {
    status: 'ok',
    alerts: [
      { timestamp: now, type: 'Info', message: 'Demo: No issues detected.', confidence: 0.95 },
    ],
    predictions: { risk_score: 0.12, next_incident_estimate: '48 hours' },
  };
}

export async function GET() {
  // Prefer server-side configured AI_BASE to avoid CORS and cross-origin issues.
  if (AI_BASE) {
    try {
      const url = AI_BASE.replace(/\/$/, '') + '/ai/safety';
      const resp = await fetch(url, { method: 'GET' });
      if (!resp.ok) {
        // return demo payload on bad response
        return NextResponse.json(demoPayload());
      }
      const data = await resp.json();
      return NextResponse.json(data);
    } catch (err) {
      return NextResponse.json(demoPayload());
    }
  }

  // no AI backend configured: return demo payload
  return NextResponse.json(demoPayload());
}
