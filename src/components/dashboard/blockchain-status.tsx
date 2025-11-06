import { use, useEffect, useState } from 'react';
import { Card } from '../ui/card';
import { getBlockchainHealth } from '@/lib/blockchain';

interface BlockchainEvent {
  type: string;
  description: string;
  txHash: string;
  blockNumber: number;
  timestamp?: string;
}

export default function BlockchainEventsPanel() {
  const [health, setHealth] = useState<any>(null);

  useEffect(() => {
    async function checkHealth() {
      const result = await getBlockchainHealth();
      if (result.status === 'ok') {
        setHealth(result.blockchain);
      }
    }
    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  if (!health) return null;

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Blockchain Status</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Connection:</span>
          <span className={health.connected ? 'text-green-500' : 'text-red-500'}>
            {health.connected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Network:</span>
          <span>{health.network}</span>
        </div>
        <div className="flex justify-between">
          <span>Block:</span>
          <span>{health.blockNumber}</span>
        </div>
        <div className="flex justify-between">
          <span>Contracts:</span>
          <span>
            {Object.entries(health.contracts)
              .filter(([, active]) => active)
              .map(([name]) => name)
              .join(', ')}
          </span>
        </div>
      </div>
    </Card>
  );
}