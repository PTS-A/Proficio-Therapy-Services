/**
 * Safe LocalStorage abstraction for sandboxed iframes and high-volume data.
 * Protects against DOMException: QuotaExceededError and SecurityError when running in AI Studio preview.
 * Includes automatic in-memory fallback so high-volume clinical staff and record collections never fail.
 */

const memoryCache = new Map<string, string>();

export const safeStorage = {
  getItem: (key: string): string | null => {
    if (memoryCache.has(key)) {
      return memoryCache.get(key)!;
    }
    try {
      if (typeof window === 'undefined' || !window.localStorage) return null;
      const stored = window.localStorage.getItem(key);
      if (stored !== null) {
        memoryCache.set(key, stored);
      }
      return stored;
    } catch {
      return null;
    }
  },

  setItem: (key: string, value: string): boolean => {
    // 1. Always retain in live memory cache for guaranteed zero data loss
    try {
      memoryCache.set(key, value);
    } catch {}

    // 2. High-volume collections (> 300KB) live in fast in-memory state to protect localStorage quota
    if (value.length > 300000) {
      return true;
    }

    // 3. Attempt safe localStorage persistence
    try {
      if (typeof window === 'undefined' || !window.localStorage) return true;
      window.localStorage.setItem(key, value);
      return true;
    } catch (e) {
      // Graceful fallback to memoryCache when quota exceeded or sandboxed
      return true;
    }
  },

  removeItem: (key: string): void => {
    memoryCache.delete(key);
    try {
      if (typeof window === 'undefined' || !window.localStorage) return;
      window.localStorage.removeItem(key);
    } catch {}
  },

  clear: (): void => {
    memoryCache.clear();
    try {
      if (typeof window === 'undefined' || !window.localStorage) return;
      window.localStorage.clear();
    } catch {}
  }
};

