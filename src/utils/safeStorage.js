// Wrappers around localStorage that never throw.
// Access can throw in some environments (private mode, disabled storage,
// exceeded quota), which would otherwise crash render/effect code.

export function getStoredValue(key) {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(key);
  } catch (error) {
    console.warn(`Unable to read "${key}" from localStorage:`, error);
    return null;
  }
}

export function setStoredValue(key, value) {
  if (typeof window === 'undefined') return false;
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.warn(`Unable to write "${key}" to localStorage:`, error);
    return false;
  }
}
