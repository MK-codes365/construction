// AI hook
import { useState, useEffect } from 'react';
import { fetchAISafetyData } from '../services/aiService';

export function useAI() {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetchAISafetyData().then(res => setData(res.data));
  }, []);
  return data;
}
