import { DarkTheme, DefaultTheme, type Theme as NavigationTheme } from '@react-navigation/native';

/**
 * Warm dishlist palette — neutral canvas, red accents on actions & profile hero.
 */
export const Theme = {
  colors: {
    primary: '#DC2626',
    primaryDark: '#B91C1C',
    primaryDarker: '#991B1B',
    primaryLight: '#FEE2E2',
    primaryMuted: '#FECACA',
    accent: '#EF4444',
    background: '#FFFFFF',
    surface: '#FFFFFF',
    inputBackground: '#FAFAFA',
    surfaceMuted: '#FEE2E2',
    chip: '#FEE2E2',
    chipBorder: '#FECACA',
    chipInactive: '#F5F5F4',
    border: '#FECACA',
    borderNeutral: '#E7E5E4',
    text: '#1C1917',
    textSecondary: '#57534E',
    textMuted: '#78716C',
    textWarm: '#991B1B',
    white: '#FFFFFF',
    black: '#000000',
    destructive: '#B91C1C',
    destructiveBg: '#FEE2E2',
    destructiveBorder: '#FCA5A5',
    shadow: '#7F1D1D',
    stoneDark: '#292524',
    stoneBorder: '#44403C',
    stoneText: '#FAFAF9',
    stoneTextMuted: '#A8A29E',
    placeholder: '#9CA3AF',
    disabled: '#A8A29E',
    disabledBg: '#E7E5E4',
    gradient: ['#EF4444', '#DC2626', '#991B1B'] as const,
  },
} as const;

export type ThemeColors = typeof Theme.colors;

/** @deprecated Prefer `Theme.colors` — kept for tab bar / legacy hooks. */
export const Colors = {
  light: {
    text: Theme.colors.text,
    background: Theme.colors.background,
    tint: Theme.colors.primary,
    icon: Theme.colors.textMuted,
    tabIconDefault: Theme.colors.textMuted,
    tabIconSelected: Theme.colors.primary,
  },
  dark: {
    text: '#FAFAF9',
    background: Theme.colors.stoneDark,
    tint: Theme.colors.accent,
    icon: Theme.colors.stoneTextMuted,
    tabIconDefault: Theme.colors.stoneTextMuted,
    tabIconSelected: Theme.colors.accent,
  },
};

export const AppLightTheme: NavigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Theme.colors.primary,
    background: Theme.colors.background,
    card: Theme.colors.surface,
    text: Theme.colors.text,
    border: Theme.colors.borderNeutral,
    notification: Theme.colors.accent,
  },
};

export const AppDarkTheme: NavigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: Theme.colors.accent,
    background: Theme.colors.stoneDark,
    card: '#1C1917',
    text: Theme.colors.stoneText,
    border: Theme.colors.stoneBorder,
    notification: Theme.colors.accent,
  },
};
