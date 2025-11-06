// AI Service API integration
export const fetchAISafetyData = async () => {
  try {
    const response = await fetch('http://localhost:4000/ai/safety');
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    return { status: 'error', data: [], error: error.message };
  }
};
