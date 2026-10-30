/** Small discoveries should never depend on browser storage being available. */
export function readSession<T>(key: string, fallback: T): T {
  try {
    const value = sessionStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeSession(key: string, value: unknown) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Private browsing and storage policies should not break the portfolio.
  }
}

/** Validate persisted lists before using them as iterable application state. */
export function readSessionList<T>(
  key: string,
  isItem: (value: unknown) => value is T
): T[] {
  const stored = readSession<unknown>(key, []);
  return Array.isArray(stored) ? stored.slice(0, 100).filter(isItem) : [];
}
