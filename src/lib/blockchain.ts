// Blockchain API client
export async function anchorReportToBlockchain(hash: string, description: string) {
  try {
    const res = await fetch('/api/blockchain/anchor-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hash, description }),
    });
    if (!res.ok) {
      return { status: 'error', message: `HTTP ${res.status}` };
    }
    return await res.json();
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
