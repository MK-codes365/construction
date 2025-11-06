// Blockchain hook
import { useState, useEffect } from 'react';
import { fetchProjectContracts } from '../services/blockchainService';

export function useBlockchain() {
  const [contracts, setContracts] = useState([]);
  useEffect(() => {
    fetchProjectContracts().then(res => setContracts(res.contracts));
  }, []);
  return contracts;
}
