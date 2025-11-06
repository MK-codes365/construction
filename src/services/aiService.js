// AI Service API integration
// Uses NEXT_PUBLIC_AI_BASE when available (client-side env var).
const AI_BASE = (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_AI_BASE)
  ? process.env.NEXT_PUBLIC_AI_BASE.replace(/\/$/, '')
  : 'http://localhost:4000';

export const fetchAISafetyData = async () => {
  try {
    const response = await fetch(`${AI_BASE}/ai/safety`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    return { status: 'error', data: [], error: error.message };
  }
};
