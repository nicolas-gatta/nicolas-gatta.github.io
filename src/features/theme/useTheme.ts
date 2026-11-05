import { useEffect, useState } from 'react';

type Theme = 'dark' | 'light';
const storageKey = 'ng:theme';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      'content', theme === 'light' ? '#f3f5f4' : '#080b0e'
    );
    try {
      localStorage.setItem(storageKey, theme);
    } catch {
      // The switch remains usable when browser storage is unavailable.
    }
  }, [theme]);

  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key === storageKey)
        setTheme(event.newValue === 'light' ? 'light' : 'dark');
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  return {
    theme,
    toggleTheme: () => setTheme((current) => current === 'dark' ? 'light' : 'dark'),
  };
}
