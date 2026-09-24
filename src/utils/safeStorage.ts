/**
 * Safe LocalStorage abstraction for sandboxed iframes and high-volume data.
 * Protects against DOMException: QuotaExceededError and SecurityError when running in AI Studio preview.
 */

export const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return null;
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },

  setItem: (key: string, value: string): boolean => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return false;
      window.localStorage.setItem(key, value);
      return true;
    } catch (err: any) {
      try {
        // If quota exceeded, clear stale auxiliary caches
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.removeItem('pts_supabase_cache_records');
          window.localStorage.removeItem('pts_supabase_cache_providers');
          window.localStorage.removeItem('pts_supabase_cache_clinical_staff');
          window.localStorage.removeItem('cred_records');
          window.localStorage.removeItem('cred_providers');
          try {
            window.localStorage.setItem(key, value);
            return true;
          } catch {
            // Cannot fit; safe to fail silently without throwing an uncaught exception
            return false;
          }
        }
      } catch {}
      return false;
    }
  },

  removeItem: (key: string): void => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return;
      window.localStorage.removeItem(key);
    } catch {}
  },

  clear: (): void => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return;
      window.localStorage.clear();
    } catch {}
  }
};
