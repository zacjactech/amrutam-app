// Theme Design Tokens

export const lightTheme = {
  colors: {
    background: {
      primary: '#F7F8F6',
      secondary: '#F1F4F1',
    },
    surface: {
      default: '#FFFFFF',
      elevated: '#FFFFFF',
    },
    text: {
      primary: '#17251D',
      secondary: '#5B6B61',
      disabled: '#A9B4AC',
    },
    border: {
      default: '#E3E8E4',
    },
    action: {
      primary: '#1B5E3A',
      primaryPressed: '#144A2E',
      primarySoft: '#E8F3EC',
      secondary: '#C98A2D',
    },
    status: {
      success: '#2E9E63',
      warning: '#E8A33D',
      error: '#D9534F',
      info: '#3D7AAD6',
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    xxxxl: 40,
    xxxxxl: 48,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    pill: 999,
  },
  typography: {
    display: { fontSize: 32, lineHeight: 40, fontWeight: '700' as const },
    h1: { fontSize: 26, lineHeight: 34, fontWeight: '700' as const },
    h2: { fontSize: 22, lineHeight: 30, fontWeight: '700' as const },
    h3: { fontSize: 18, lineHeight: 26, fontWeight: '600' as const },
    bodyLarge: { fontSize: 16, lineHeight: 24, fontWeight: '400' as const },
    body: { fontSize: 14, lineHeight: 20, fontWeight: '400' as const },
    bodySmall: { fontSize: 12, lineHeight: 16, fontWeight: '400' as const },
    caption: { fontSize: 11, lineHeight: 14, fontWeight: '400' as const },
    button: { fontSize: 15, lineHeight: 20, fontWeight: '600' as const },
    label: { fontSize: 12, lineHeight: 16, fontWeight: '600' as const },
  },
};

export const darkTheme: typeof lightTheme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    background: {
      primary: '#0F1512',
      secondary: '#1F2A23',
    },
    surface: {
      default: '#17201B',
      elevated: '#1F2A23',
    },
    text: {
      primary: '#EDF3EE',
      secondary: '#A8B5AC',
      disabled: '#5B6B61',
    },
    border: {
      default: '#2A362F',
    },
    action: {
      primary: '#5FBF8A',
      primaryPressed: '#4CC48A',
      primarySoft: '#1E3A2C',
      secondary: '#E8B45A',
    },
    status: {
      success: '#4CC48A',
      warning: '#E8B45A',
      error: '#E37B77',
      info: '#6FA8CE',
    },
  },
};

export type Theme = typeof lightTheme;
