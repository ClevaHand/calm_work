/**
 * Calm Work design system
 * Primary: warm coral (reference UI)
 * Secondary: soft teal for calm focus accents
 * Supports light + dark schemes
 */

const palette = {
  coral50: '#FFF5F5',
  coral100: '#FFE4E1',
  coral200: '#FFCDD2',
  coral300: '#FFAB91',
  coral400: '#FF8A80',
  coral500: '#F48A7B',
  coral600: '#E57373',
  coral700: '#C75B5B',
  coral800: '#A34848',

  teal50: '#F0FDFA',
  teal100: '#CCFBF1',
  teal400: '#2DD4BF',
  teal500: '#14B8A6',
  teal600: '#0D9488',

  slate50: '#F8FAFC',
  slate100: '#F1F5F9',
  slate200: '#E2E8F0',
  slate300: '#CBD5E1',
  slate400: '#94A3B8',
  slate500: '#64748B',
  slate600: '#475569',
  slate700: '#334155',
  slate800: '#1E293B',
  slate900: '#0F172A',
  slate950: '#020617',

  white: '#FFFFFF',
  black: '#000000',

  success: '#10B981',
  successBg: '#D1FAE5',
  warning: '#F59E0B',
  warningBg: '#FEF3C7',
  error: '#EF4444',
  errorBg: '#FEE2E2',
  info: '#3B82F6',
  infoBg: '#DBEAFE',
};

export const LightColors = {
  primary: palette.coral400,
  primaryDark: palette.coral600,
  primaryLight: palette.coral300,
  primarySoft: palette.coral200,
  primaryBg: palette.coral50,

  secondary: palette.teal500,
  secondaryDark: palette.teal600,
  secondarySoft: palette.teal100,
  secondaryBg: palette.teal50,

  white: palette.white,
  offWhite: palette.slate50,
  background: '#F7F6F5',
  surface: palette.white,
  surfaceElevated: palette.white,
  surfaceMuted: palette.slate100,

  text: palette.slate900,
  textSecondary: palette.slate500,
  textMuted: palette.slate400,
  textInverse: palette.white,

  border: palette.slate200,
  borderLight: palette.slate100,

  success: palette.success,
  successBg: palette.successBg,
  warning: palette.warning,
  warningBg: palette.warningBg,
  error: palette.error,
  errorBg: palette.errorBg,
  info: palette.info,
  infoBg: palette.infoBg,

  tabInactive: palette.slate400,
  tabActive: palette.coral400,

  cardShadow: 'rgba(15, 23, 42, 0.06)',

  wavePink: palette.coral400,
  wavePinkLight: palette.coral300,

  overlay: 'rgba(15, 23, 42, 0.45)',
};

export const DarkColors: typeof LightColors = {
  primary: palette.coral400,
  primaryDark: palette.coral300,
  primaryLight: palette.coral500,
  primarySoft: '#3D2A2A',
  primaryBg: '#2A1F1F',

  secondary: palette.teal400,
  secondaryDark: palette.teal500,
  secondarySoft: '#1A2E2B',
  secondaryBg: '#152422',

  white: palette.white,
  offWhite: palette.slate800,
  background: palette.slate950,
  surface: palette.slate900,
  surfaceElevated: palette.slate800,
  surfaceMuted: palette.slate800,

  text: palette.slate50,
  textSecondary: palette.slate400,
  textMuted: palette.slate500,
  textInverse: palette.slate950,

  border: palette.slate700,
  borderLight: palette.slate800,

  success: '#34D399',
  successBg: '#064E3B',
  warning: '#FBBF24',
  warningBg: '#78350F',
  error: '#F87171',
  errorBg: '#7F1D1D',
  info: '#60A5FA',
  infoBg: '#1E3A5F',

  tabInactive: palette.slate500,
  tabActive: palette.coral400,

  cardShadow: 'rgba(0, 0, 0, 0.35)',

  wavePink: palette.coral500,
  wavePinkLight: palette.coral400,

  overlay: 'rgba(0, 0, 0, 0.6)',
};

/** Default export for screens that don't need theme switching yet */
export const Colors = LightColors;

export type ColorScheme = typeof LightColors;
export { palette };
