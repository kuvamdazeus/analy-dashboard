export const getJsonStorageData = (key: string) => {
  try {
    return JSON.parse(localStorage.getItem(key) || "");
  } catch {
    return null;
  }
};
