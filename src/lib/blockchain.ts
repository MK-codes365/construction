// Blockchain API client
export async function anchorReportToBlockchain(hash: string, description: string) {
  try {
    const res = await fetch('/api/blockchain/anchor-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hash, description }),
    });
    // Try to parse JSON body even when the response status is an error so the
    // client receives the backend's explanatory message (not just "HTTP 500").
    let json: any = null;
    try {
      json = await res.json();
    } catch (e) {
      // If body isn't JSON, fall back to generic error message for non-ok
      if (!res.ok) {
        return { status: 'error', message: `HTTP ${res.status}` };
      }
      throw e;
    }

    // If the backend returned a non-2xx status but included a JSON payload,
    // forward that payload so the UI gets the detailed error message.
    if (!res.ok) return json;

    return json;
  } catch (err) {
    return { status: 'error', message: err instanceof Error ? err.message : String(err) };
  }
}

export async function getBlockchainHealth() {
  try {
    const res = await fetch('/api/blockchain/health');
    if (!res.ok) {
      return { status: 'error', message: `HTTP ${res.status}` };
    }
    return await res.json();
  } catch (err) {
    return { status: 'error', message: err instanceof Error ? err.message : String(err) };
  }
}

export async function getBlockchainContracts() {
  try {
    const res = await fetch('/api/blockchain/contracts');
    if (!res.ok) {
      return { status: 'error', message: `HTTP ${res.status}` };
    }
    return await res.json();
  } catch (err) {
    return { status: 'error', message: err instanceof Error ? err.message : String(err) };
  }
}
