/**
 * Safe localStorage wrapper
 * ─────────────────────────
 * Guards against:
 *   - QuotaExceededError (storage full)
 *   - SecurityError (private browsing / iframe restrictions)
 *   - JSON parse failures on corrupted data
 *   - SSR environments where localStorage doesn't exist
 */

const isAvailable = (): boolean => {
  try {
    const key = '__storage_test__';
    localStorage.setItem(key, '1');
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
};

const STORAGE_AVAILABLE = isAvailable();

export const safeStorage = {
  /**
   * Read and parse an item. Returns null on any failure.
   */
  getItem<T>(key: string): T | null {
    if (!STORAGE_AVAILABLE) return null;
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return null;
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },

  /**
   * Serialize and write an item.
   * Returns true on success, false on failure (quota, security, etc.)
   */
  setItem(key: string, value: unknown): boolean {
    if (!STORAGE_AVAILABLE) return false;
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      if (err instanceof DOMException && err.name === 'QuotaExceededError') {
        console.warn('[storage] Quota exceeded - clearing oldest entry for key:', key);
        // Attempt to free space by removing the item first, then retry
        try {
          localStorage.removeItem(key);
          localStorage.setItem(key, JSON.stringify(value));
          return true;
        } catch {
          return false;
        }
      }
      return false;
    }
  },

  /**
   * Remove an item safely.
   */
  removeItem(key: string): void {
    if (!STORAGE_AVAILABLE) return;
    try {
      localStorage.removeItem(key);
    } catch { /* ignore */ }
  },

  /**
   * Check if storage is available in this environment.
   */
  isAvailable(): boolean {
    return STORAGE_AVAILABLE;
  },
};

/**
 * Debounce helper for storage writes.
 * Prevents excessive I/O on rapid state updates.
 */
export function debounce<T extends (...args: Parameters<T>) => void>(
  fn: T,
  delayMs: number,
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
      timer = null;
    }, delayMs);
  };
}

/**
 * Generate a cryptographically random ID.
 * Falls back to Math.random() in environments without crypto.randomUUID.
 */
export function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Polyfill for environments without crypto.randomUUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
