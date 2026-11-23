import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';

const STORAGE_KEY = 'dna-theme';
const ThemeContext = createContext(null);

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const systemTheme = () => (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

function readStored() {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === 'light' || v === 'dark' ? v : null;
  } catch {
    return null;
  }
}

function writeStored(theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* storage blocked: the choice lasts for this visit */
  }
}

function paint(theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  document
    .querySelectorAll('meta[name="theme-color"]')
    .forEach((m) => m.setAttribute('content', theme === 'dark' ? '#0B0B0B' : '#FAF4E4'));
}

export function ThemeProvider({ children }) {
  // index.html has already painted the right theme before React loads.
  const [theme, setThemeState] = useState(() => document.documentElement.dataset.theme || readStored() || systemTheme());
  const hasExplicitChoice = useRef(readStored() !== null);
  const fadeTimer = useRef(0);

  /**
   * Switches theme with a crossfade.
   *  1. View Transitions API: the browser snapshots the page and crossfades
   *     everything (art + colours) in one pass.
   *  2. Fallback: `.theme-fading` turns on colour transitions for one cycle
   *     and <ThemedArt> fades its stacked images.
   *  3. Reduced motion: instant.
   */
  const applyTheme = useCallback((next, { persist = true } = {}) => {
    if (persist) {
      writeStored(next);
      hasExplicitChoice.current = true;
    }
    const root = document.documentElement;
    const commit = () => {
      paint(next);
      flushSync(() => setThemeState(next));
    };

    if (prefersReducedMotion()) {
      commit();
      return;
    }

    if (typeof document.startViewTransition === 'function') {
      root.classList.add('theme-vt');
      const transition = document.startViewTransition(commit);
      transition.finished.finally(() => root.classList.remove('theme-vt'));
      return;
    }

    window.clearTimeout(fadeTimer.current);
    root.classList.add('theme-fading');
    commit();
    fadeTimer.current = window.setTimeout(() => root.classList.remove('theme-fading'), 900);
  }, []);

  const toggleTheme = useCallback(() => {
    applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
  }, [applyTheme]);

  // Follow the OS setting until the visitor makes their own choice.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e) => {
      if (!hasExplicitChoice.current) applyTheme(e.matches ? 'dark' : 'light', { persist: false });
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [applyTheme]);

  const value = useMemo(() => ({ theme, setTheme: applyTheme, toggleTheme }), [theme, applyTheme, toggleTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}
