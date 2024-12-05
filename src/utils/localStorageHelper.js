export const getDataFromLocalStorage = (key, fallbackData) => {
  const storedData = localStorage.getItem(key);
  if (storedData) {
    try {
      return JSON.parse(storedData); // Parse and return data from localStorage
    } catch (error) {
      console.error(`Error parsing localStorage data for key "${key}":`, error);
    }
  }
  return fallbackData; // Fallback to default data if not found or parse error occurs
};
