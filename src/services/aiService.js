// Client-side AI service wrapper: call the Next.js API route which proxies
// to the real AI microservice (if configured) or returns a safe demo payload.
export const fetchAISafetyData = async () => {
  try {
    const response = await fetch('/api/ai/safety', { cache: 'no-store' });
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    return { status: 'error', data: [], error: error?.message || String(error) };
  }
};
