"use client";

import { useEffect, useRef } from 'react';

export type WasteMsg = {
  type: string;
  payload: any;
};

// Lightweight reconnecting websocket hook for receiving waste log events from the
// backend GIS service. Calls `onMessage` with the payload when a `waste` event
// is received.
export default function useWasteLive(onMessage: (payload: any) => void, enabled = true) {
  const wsRef = useRef<WebSocket | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;
    let mounted = true;
    let backoff = 1000;

    const connect = () => {
      if (!mounted) return;
      const envBase = (process.env.NEXT_PUBLIC_GIS_BASE as string) || '';
      const hostBase = envBase || ((window.location.protocol === 'https:') ? 'https://' : 'http://') + window.location.hostname + ':4003';
      const wsUrl = hostBase.replace(/^http/, 'ws').replace(/^https/, 'wss') + '/gis/ws';

      try {
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          backoff = 1000;
          // console.debug('useWasteLive connected', wsUrl);
        };

        ws.onmessage = (ev) => {
          try {
            const msg: WasteMsg = JSON.parse(ev.data);
            if (msg && msg.type === 'waste' && msg.payload) {
              onMessage(msg.payload);
            }
          } catch (e) {
            // ignore parse errors
          }
        };

        ws.onclose = () => {
          if (!mounted) return;
          // schedule reconnect with backoff
          timeoutRef.current = window.setTimeout(() => connect(), backoff) as unknown as number;
          backoff = Math.min(30000, Math.floor(backoff * 1.5));
        };

        ws.onerror = () => {
          try {
            ws.close();
          } catch (e) {
            // ignore
          }
        };
      } catch (e) {
        // schedule reconnect
        timeoutRef.current = window.setTimeout(() => connect(), backoff) as unknown as number;
        backoff = Math.min(30000, Math.floor(backoff * 1.5));
      }
    };

    connect();

    return () => {
      mounted = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (wsRef.current) {
        try {
          wsRef.current.close();
        } catch (e) {
          // ignore
        }
      }
    };
  }, [enabled, onMessage]);
}
