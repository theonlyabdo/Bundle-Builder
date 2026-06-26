const STORAGE_KEY = "bundle-builder:saved-system";

// Reads the saved system from localStorage.Returns null if nothing is saved.
export function loadSavedSystem() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch (err) {
    console.warn("Failed to load saved system from localStorage:", err);
    return null;
  }
}

// Persists the current system to localStorage so it can be restored on a later visit
export function saveSystem(snapshot) {
  try {
    const payload = {
      ...snapshot,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    return true;
  } catch (err) {
    console.warn("Failed to save system to localStorage:", err);
    return false;
  }
}

export function clearSavedSystem() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn("Failed to clear saved system:", err);
  }
}
