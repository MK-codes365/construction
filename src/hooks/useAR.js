// AR hook
import { useState, useEffect } from 'react';
import { fetchBlueprints } from '../services/arService';

export function useAR() {
  const [blueprints, setBlueprints] = useState([]);
  useEffect(() => {
    fetchBlueprints().then(res => setBlueprints(res.blueprints));
  }, []);
  return blueprints;
}
