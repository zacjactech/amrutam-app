// Theme Provider with Context

import React, { createContext, useContext, ReactNode } from 'react';
import { lightTheme, darkTheme, Theme } from '../design-system/theme';

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

export function ThemeProvider({
  children,
  initialMode = 'light',
}: ThemeProviderProps): React.JSX.Element {
  const [mode, setMode] = React.useState<ThemeMode>(initialMode);
  const theme = mode === 'light' ? lightTheme : darkTheme;

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
