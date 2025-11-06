// AI hook
import { useState, useEffect, useRef } from 'react';
import { fetchAISafetyData } from '../services/aiService';
import { setFeedState } from '../lib/aiFeedStore';

// useAI hook
// - mode: 'ws' for WebSocket (default), 'poll' for HTTP polling
// - pollInterval: milliseconds between fetches when mode='poll' (default 5000ms)
export function useAI(mode = 'ws', pollInterval = 5000) {
  const [data, setData] = useState(null);
  const mountedRef = useRef(false);
  const wsRef = useRef(null);
  const reconnectTimerRef = useRef(null);
  const wsTimeoutRef = useRef(null);
  const pollingIntervalRef = useRef(null);
  const dataReceivedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;

  // WebSocket mode
    if (mode === 'ws' && typeof window !== 'undefined') {
      // Derive WS URL from NEXT_PUBLIC_AI_BASE when provided, else derive from window.location
      let wsUrl = null;
      const envBase = (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_AI_BASE)
        ? process.env.NEXT_PUBLIC_AI_BASE.replace(/\/$/, '')
        : null;

      if (envBase) {
        // http:// -> ws://, https:// -> wss://
        wsUrl = envBase.replace(/^http/, 'ws') + '/ai/ws';
      } else if (typeof window !== 'undefined') {
        const loc = window.location;
        const scheme = loc.protocol === 'https:' ? 'wss' : 'ws';
        wsUrl = `${scheme}://${loc.host}/ai/ws`;
      } else {
        wsUrl = 'ws://localhost:4000/ai/ws';
      }

      const startPolling = async () => {
        // begin HTTP polling as a fallback
        try { setFeedState({ status: 'polling' }); } catch (e) {}
        const getData = async () => {
          try {
            const res = await fetchAISafetyData();
            if (mountedRef.current) setData(res);
            try {
              const risk = res && res.predictions && typeof res.predictions.risk_score === 'number' ? res.predictions.risk_score : null;
              const last = res && res.alerts && res.alerts.length ? res.alerts.reduce((a, b) => (new Date(a.timestamp) > new Date(b.timestamp) ? a : b)).timestamp : new Date().toISOString();
              setFeedState({ status: 'polling', riskScore: risk, lastUpdated: last });
            } catch (e) {}
          } catch (err) {
            if (mountedRef.current) setData({ status: 'error', error: err.message || String(err) });
            try { setFeedState({ status: 'error' }); } catch (e) {}
          }
        };

        // immediate fetch then interval
        await getData();
        if (pollInterval > 0) pollingIntervalRef.current = setInterval(getData, pollInterval);
      };

      const connect = () => {
        // notify subscribers we're attempting to connect
        try { setFeedState({ status: 'connecting' }); } catch (e) {}
        // set a timeout: if no data comes within 6s, fallback to polling
        try { if (wsTimeoutRef.current) clearTimeout(wsTimeoutRef.current); } catch (e) {}
        dataReceivedRef.current = false;
        wsTimeoutRef.current = setTimeout(() => {
          // only fallback if still mounted and no data received
          if (mountedRef.current && !dataReceivedRef.current) {
            startPolling();
          }
        }, 6000);
        try {
          const ws = new WebSocket(wsUrl);
          wsRef.current = ws;

          ws.onopen = () => {
            // clear any previous error state
            if (mountedRef.current) setData(prev => (prev && prev.status === 'error' ? null : prev));
            try { setFeedState({ status: 'connected' }); } catch (e) {}
          };

          ws.onmessage = (event) => {
            try {
              const parsed = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
              if (mountedRef.current) setData(parsed);
              dataReceivedRef.current = true;
              // update central feed state
              try {
                const risk = parsed && parsed.predictions && typeof parsed.predictions.risk_score === 'number'
                  ? parsed.predictions.risk_score
                  : null;
                const last = parsed && parsed.alerts && parsed.alerts.length
                  ? parsed.alerts.reduce((a, b) => (new Date(a.timestamp) > new Date(b.timestamp) ? a : b)).timestamp
                  : new Date().toISOString();
                setFeedState({ status: 'connected', riskScore: risk, lastUpdated: last });
              } catch (e) {}
              // clear any polling fallback if it was started
              try { if (pollingIntervalRef.current) { clearInterval(pollingIntervalRef.current); pollingIntervalRef.current = null; } } catch (e) {}
              try { if (wsTimeoutRef.current) { clearTimeout(wsTimeoutRef.current); wsTimeoutRef.current = null; } } catch (e) {}
            } catch (err) {
              // ignore malformed messages
            }
          };

          ws.onclose = () => {
            // try to reconnect after a short delay
            try { setFeedState({ status: 'disconnected' }); } catch (e) {}
            if (mountedRef.current) {
              reconnectTimerRef.current = setTimeout(() => {
                connect();
              }, 2000);
            }
          };

          ws.onerror = () => {
            // close socket to trigger reconnect path
            try { setFeedState({ status: 'disconnected' }); } catch (e) {}
            try { ws.close(); } catch (e) {}
          };
        } catch (err) {
          // schedule reconnect
          try { setFeedState({ status: 'disconnected' }); } catch (e) {}
          if (mountedRef.current) {
            reconnectTimerRef.current = setTimeout(() => connect(), 2000);
          }
        }
      };

      connect();
    }

    // Polling fallback mode
    let timer = null;
    if (mode !== 'ws') {
      const getData = async () => {
        try {
          const res = await fetchAISafetyData();
          if (mountedRef.current) setData(res);
        } catch (err) {
          if (mountedRef.current) setData({ status: 'error', error: err.message || String(err) });
        }
      };

      // initial fetch
      getData();
      if (pollInterval > 0) timer = setInterval(getData, pollInterval);
    }

    return () => {
      mountedRef.current = false;
      if (wsRef.current) {
        try { wsRef.current.close(); } catch (e) {}
        wsRef.current = null;
      }
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }
      try { if (wsTimeoutRef.current) { clearTimeout(wsTimeoutRef.current); wsTimeoutRef.current = null; } } catch (e) {}
      try { if (pollingIntervalRef.current) { clearInterval(pollingIntervalRef.current); pollingIntervalRef.current = null; } } catch (e) {}
      try { setFeedState({ status: 'disconnected' }); } catch (e) {}
      if (timer) clearInterval(timer);
    };
  }, [mode, pollInterval]);

  return data;
}
