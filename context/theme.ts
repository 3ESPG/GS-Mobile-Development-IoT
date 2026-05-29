// context/theme.ts
// Sistema de tokens de design do AgroSat AI

export const Colors = {
  dark: {
    background: '#050d1a',
    surface: '#0d1f35',
    surfaceElevated: '#122840',
    border: '#1e3a5f',
    borderLight: '#1a3050',
    primary: '#00d4aa',
    primaryDim: '#00a882',
    accent: '#4fc3f7',
    warning: '#ffb74d',
    danger: '#ef5350',
    success: '#66bb6a',
    textPrimary: '#e8f4fd',
    textSecondary: '#8ab4d4',
    textMuted: '#4d7a9e',
    cardBg: 'rgba(13, 31, 53, 0.95)',
  },
  light: {
    background: '#f0f7ff',
    surface: '#ffffff',
    surfaceElevated: '#e8f4ff',
    border: '#b8d4ec',
    borderLight: '#cde0f2',
    primary: '#007a60',
    primaryDim: '#005a46',
    accent: '#0277bd',
    warning: '#ef8c00',
    danger: '#c62828',
    success: '#2e7d32',
    textPrimary: '#0a1628',
    textSecondary: '#2c5f84',
    textMuted: '#5e8aaa',
    cardBg: 'rgba(255, 255, 255, 0.95)',
  },
};

export const Typography = {
  fontSizes: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 24,
    xxxl: 30,
  },
  fontWeights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};
