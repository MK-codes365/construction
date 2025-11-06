// AR Service API integration

export const fetchBlueprints = async () => {
  try {
  const response = await fetch('/api/ar/blueprints');
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    return { status: 'error', blueprints: [], error: error.message };
  }
};

export const fetchWasteLogs = async () => {
  try {
  const response = await fetch('/api/ar/waste-logs');
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    return { status: 'error', logs: [], error: error.message };
  }
};

export const addWasteLogAR = async (log) => {
  try {
  // Sanitize the log before sending — File/FileList objects are not JSON-serializable
  const safeLog = { ...log };
  try {
    if (safeLog.photo) {
      // photo may be a FileList or array-like; extract basic metadata only
      const files = Array.from(safeLog.photo instanceof FileList ? safeLog.photo : (Array.isArray(safeLog.photo) ? safeLog.photo : [safeLog.photo]));
      safeLog.photo = files.map((f) => ({ name: f?.name, size: f?.size, type: f?.type }));
    }
  } catch (e) {
    // On any error sanitizing, drop the photo to avoid breaking the request
    safeLog.photo = null;
  }

  const response = await fetch('/api/ar/waste-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(safeLog),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    return { status: 'error', error: error.message };
  }
};
