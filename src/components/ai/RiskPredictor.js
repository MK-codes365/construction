"use client";
// Risk Predictor Component


import React, { useEffect, useMemo, useState } from 'react';
import { useAI } from '../../hooks/useAI';

const RiskPredictor = () => {
  const data = useAI();
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    if (!data) return;
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
        // ignore
      }
    }
    setLastUpdated(new Date());
  }, [data]);

  const predictions = data && data.predictions ? data.predictions : null;

  return (
    <div>
      <h2>Risk Predictor</h2>

      {data === null && <p style={{ opacity: 0.8 }}>Loading predictions...</p>}

      {data && data.status === 'error' && (
        <div style={{ color: '#e07a5f' }}>
          <strong>Error:</strong> {data.error || 'Failed to load predictions.'}
        </div>
      )}

      {lastUpdated && (
        <div style={{ fontSize: '12px', color: '#9aa0a6', marginBottom: '8px' }}>Last updated: {lastUpdated.toLocaleString()}</div>
      )}

      {predictions ? (
        <div>
          <p>Risk Score: <strong>{predictions.risk_score}</strong></p>
          <p>Next Incident Estimate: <strong>{predictions.next_incident_estimate}</strong></p>
        </div>
      ) : (
        <p>No prediction data available.</p>
      )}
    </div>
  );
};

export default RiskPredictor;
