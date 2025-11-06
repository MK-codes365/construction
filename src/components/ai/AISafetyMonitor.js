"use client";
// AI Safety Monitor Component


import React, { useEffect, useMemo, useState } from 'react';
import { useAI } from '../../hooks/useAI';

const AISafetyMonitor = () => {
  const data = useAI();
  const [lastUpdated, setLastUpdated] = useState(null);

  // derive a friendly last-updated timestamp from incoming alerts if available
  useEffect(() => {
    if (!data) return; // still loading
    if (data.status === 'error') {
      setLastUpdated(null);
      return;
    }

    if (data.alerts && data.alerts.length) {
      try {
        const latest = data.alerts.reduce((a, b) => (new Date(a.timestamp) > new Date(b.timestamp) ? a : b));
        setLastUpdated(new Date(latest.timestamp));
        return;
      } catch (e) {
        // fall through
      }
    }

    // fallback to now if no alert timestamps are present
    setLastUpdated(new Date());
  }, [data]);

  const alertsList = useMemo(() => (data && data.alerts) || [], [data]);
  const predictions = data && data.predictions ? data.predictions : null;

  return (
    <div>
      <h2>AI Safety Monitor</h2>

      {/* Loading state */}
      {data === null && <p style={{ opacity: 0.8 }}>Loading AI safety data...</p>}

      {/* Error state */}
      {data && data.status === 'error' && (
        <div style={{ color: '#e07a5f' }}>
          <strong>Error:</strong> {data.error || 'Failed to load AI data.'}
        </div>
      )}

      {/* Last updated */}
      {lastUpdated && (
        <div style={{ fontSize: '12px', color: '#9aa0a6', marginBottom: '8px' }}>Last updated: {lastUpdated.toLocaleString()}</div>
      )}

      {alertsList.length > 0 && (
        <div>
          <h3>Real-Time Safety Alerts</h3>
          <ul>
            {alertsList.map((alert, idx) => (
              <li key={idx} style={{ marginBottom: '8px' }}>
                <strong>{alert.type}</strong> ({alert.timestamp}):<br />
                {alert.message}<br />
                Confidence: {alert.confidence}
              </li>
            ))}
          </ul>
        </div>
      )}

      {predictions && (
        <div style={{ marginTop: '16px' }}>
          <h3>Risk Prediction</h3>
          <p>Risk Score: <strong>{predictions.risk_score}</strong></p>
          <p>Next Incident Estimate: <strong>{predictions.next_incident_estimate}</strong></p>
        </div>
      )}
    </div>
  );
};

export default AISafetyMonitor;
