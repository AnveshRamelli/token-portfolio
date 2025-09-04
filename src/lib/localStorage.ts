import type { GlobalTokensState } from "../features/tokens/types";

const STORAGE_KEY = 'globalState';

export const saveStateToLocalStorage = (state: GlobalTokensState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save state:', err);
  }
};

export const loadStateFromLocalStorage = (): GlobalTokensState | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    return JSON.parse(saved);
  } catch (err) {
    console.error('Failed to load state:', err);
    return null;
  }
};
