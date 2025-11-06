import React, { useEffect, useState } from 'react';

export type BlockchainEvent = {
  type: string;
  description: string;
  txHash: string;
  blockNumber: number;
  timestamp?: string;
};

export default function BlockchainEventsPanel() {
  const [events, setEvents] = useState<BlockchainEvent[]>([]);

  useEffect(() => {
    async function fetchEvents() {
      // Use the Next API route so this works when deployed to Vercel
      const res = await fetch('/api/blockchain/events');
      const data = await res.json();
      if (data.status === 'ok') setEvents(data.events);
    }
    fetchEvents();
    const interval = setInterval(fetchEvents, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2 style={{ fontWeight: 600, marginBottom: '1rem' }}>Blockchain Activity</h2>
      {events.length === 0 ? (
        <p>No blockchain events found.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {events.map((ev, idx) => (
            <li key={ev.txHash + idx} style={{ marginBottom: '1rem', background: '#fafafa', borderRadius: '8px', padding: '1rem', boxShadow: '0 1px 6px rgba(0,0,0,0.07)' }}>
              <div><strong>Type:</strong> {ev.type}</div>
              <div><strong>Description:</strong> {ev.description}</div>
              <div><strong>Tx Hash:</strong> <a href={`https://goerli.etherscan.io/tx/${ev.txHash}`} target="_blank" rel="noopener noreferrer">{ev.txHash}</a></div>
              <div><strong>Block:</strong> {ev.blockNumber}</div>
              {ev.timestamp && <div><strong>Timestamp:</strong> {ev.timestamp}</div>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
