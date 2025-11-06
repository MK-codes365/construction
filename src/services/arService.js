// AR Service API integration

export const fetchBlueprints = async () => {
  try {
    const response = await fetch('http://localhost:4002/ar/blueprints');
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    return { status: 'error', blueprints: [], error: error.message };
  }
};

export const fetchWasteLogs = async () => {
  try {
    const response = await fetch('http://localhost:4002/ar/waste-logs');
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    return { status: 'error', logs: [], error: error.message };
  }
};

export const addWasteLogAR = async (log) => {
  try {
    const response = await fetch('http://localhost:4002/ar/waste-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(log),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    return { status: 'error', error: error.message };
  }
};
