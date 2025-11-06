// Risk Predictor Component


import React from 'react';
import { useAI } from '../../hooks/useAI';

const RiskPredictor = () => {
  const data = useAI();
  const predictions = data && data.predictions ? data.predictions : null;
  return (
    <div>
      <h2>Risk Predictor</h2>
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
