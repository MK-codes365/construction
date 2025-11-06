// AI Safety Monitor Component


import React from 'react';
import { useAI } from '../../hooks/useAI';

const AISafetyMonitor = () => {
  const data = useAI();
  return (
    <div>
      <h2>AI Safety Monitor</h2>
      {data && data.alerts && (
        <div>
          <h3>Real-Time Safety Alerts</h3>
          <ul>
            {data.alerts.map((alert, idx) => (
              <li key={idx} style={{marginBottom: '8px'}}>
                <strong>{alert.type}</strong> ({alert.timestamp}):<br />
                {alert.message}<br />
                Confidence: {alert.confidence}
              </li>
            ))}
          </ul>
        </div>
      )}
      {data && data.predictions && (
        <div style={{marginTop: '16px'}}>
          <h3>Risk Prediction</h3>
          <p>Risk Score: <strong>{data.predictions.risk_score}</strong></p>
          <p>Next Incident Estimate: <strong>{data.predictions.next_incident_estimate}</strong></p>
        </div>
      )}
    </div>
  );
};

export default AISafetyMonitor;
