// Simple pub/sub store for AI feed state (lastUpdated, riskScore, status)
const listeners = new Set();
let state = {
  lastUpdated: null, // ISO string or null
  riskScore: null, // number 0..1
  status: 'unknown', // 'unknown' | 'connecting' | 'connected' | 'disconnected' | 'error'
};

export function subscribe(fn) {
  listeners.add(fn);
  // call immediately with current state
  try { fn(state); } catch (e) {}
  return () => listeners.delete(fn);
}

export function setFeedState(partial) {
  state = { ...state, ...partial };
  for (const l of Array.from(listeners)) {
    try { l(state); } catch (e) { /* ignore listener errors */ }
  }
}

export function getFeedState() {
  return state;
}

export default { subscribe, setFeedState, getFeedState };
