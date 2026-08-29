// Theme Provider with Context + SecureStore persistence

import React, { createContext, useContext, ReactNode } from 'react';
import { lightTheme, darkTheme, Theme } from '../design-system/theme';
import * as SecureStore from 'expo-secure-store';

const THEME_KEY = 'app_theme_mode';

type ThemeMode = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  initialMode?: ThemeMode;
}

function loadPersistedMode(): ThemeMode {
  try {
    const stored = SecureStore.getItem(THEME_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {}
  return 'light';
}

export function ThemeProvider({
  children,
}: ThemeProviderProps): React.JSX.Element {
  const [mode, setModeState] = React.useState<ThemeMode>(loadPersistedMode);
  const theme = mode === 'light' ? lightTheme : darkTheme;

  const setMode = React.useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
    try {
      SecureStore.setItem(THEME_KEY, newMode);
    } catch {}
  }, []);

  const value: ThemeContextValue = {
    theme,
    mode,
    setMode,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export function useThemeColors(): Theme['colors'] {
  return useTheme().theme.colors;
}

export function useThemeSpacing(): Theme['spacing'] {
  return useTheme().theme.spacing;
}

export function useThemeTypography(): Theme['typography'] {
  return useTheme().theme.typography;
}
