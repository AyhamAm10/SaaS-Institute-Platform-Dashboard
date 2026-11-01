/**
 * Semantic Design Tokens — Single Source of Truth.
 *
 * Identity: Jeel Al-Salam Institute (logo orange #F16726 + ink black + white).
 * - Light (primary): warm off-white canvas, frosted glass surfaces, ink actions, orange accents.
 * - Dark (secondary): near-black canvas, smoked glass surfaces, orange actions.
 *
 * Every value here is emitted as a `--app-*` CSS variable by `appCssVariablesResolver`
 * (see ./css-variables.ts). UI code must consume the variables, never raw values.
 */

export interface ThemeSemanticTokens {
  // Surfaces
  bg: string;
  surface: string;
  surfaceSolid: string;
  subtle: string;
  hover: string;
  sidebarBg: string;
  sidebarSubtle: string;
  headerBg: string;

  // Borders
  border: string;
  borderSubtle: string;
  borderHover: string;

  // Typography
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textOnBrand: string;

  // Inputs
  inputBg: string;
  inputBgHover: string;
  inputBgFocus: string;
  inputBorder: string;
  inputBorderHover: string;
  inputFocusBorder: string;
  inputFocusRing: string;
  inputPlaceholder: string;

  // Tables
  tableBg: string;
  tableHeaderBg: string;
  tableBorder: string;
  tableHover: string;
  tableText: string;

  // Brand
  brandPrimary: string;
  brandPrimaryHover: string;
  brandAccent: string;
  brandAccentHover: string;
  brandAccentText: string;
  brandAccentSoft: string;
  brandAccentRing: string;
  badgeBg: string;
  badgeText: string;
  buttonBg: string;
  buttonHover: string;
  /** Small dot marking the active sidebar item (must contrast with the filled item). */
  navActiveDot: string;

  // Semantic tones (text, soft background, border)
  successText: string;
  successSoft: string;
  successBorder: string;
  dangerText: string;
  dangerSoft: string;
  dangerBorder: string;
  infoText: string;
  infoSoft: string;
  infoBorder: string;

  // Tabs (recessed track + raised indicator)
  tabsTrack: string;
  tabsTrackShadow: string;
  tabsIndicator: string;
  tabsIndicatorShadow: string;

  // Glass
  glassBg: string;
  glassBgStrong: string;
  glassBorder: string;
  glassHighlight: string;
  glassBlur: string;

  // Elevation
  cardShadow: string;
  elev1: string;
  elev2: string;
  elev3: string;
  dropdownShadow: string;
  brandGlow: string;

  // Ambient liquid blobs
  blobStart: string;
  blobMid: string;
  blobEnd: string;
  blobOpacity: string;
}

export const lightTokens: ThemeSemanticTokens = {
  bg: '#F5F3F0',
  surface: 'rgba(255, 255, 255, 0.62)',
  surfaceSolid: '#FFFFFF',
  subtle: '#EFECE8',
  hover: 'rgba(255, 255, 255, 0.88)',
  sidebarBg: 'rgba(255, 255, 255, 0.55)',
  sidebarSubtle: 'rgba(20, 20, 22, 0.05)',
  headerBg: 'rgba(255, 255, 255, 0.55)',

  border: 'rgba(20, 20, 22, 0.08)',
  borderSubtle: 'rgba(20, 20, 22, 0.05)',
  borderHover: 'rgba(20, 20, 22, 0.18)',

  textPrimary: '#1C1C1E',
  textSecondary: '#5F5B57',
  textMuted: '#8F8A85',
  textOnBrand: '#FFFFFF',

  inputBg: 'rgba(255, 255, 255, 0.72)',
  inputBgHover: '#FFFFFF',
  inputBgFocus: '#FFFFFF',
  inputBorder: 'rgba(20, 20, 22, 0.12)',
  inputBorderHover: 'rgba(20, 20, 22, 0.24)',
  inputFocusBorder: '#141416',
  inputFocusRing: '0 0 0 4px rgba(241, 103, 38, 0.18)',
  inputPlaceholder: '#A29E99',

  tableBg: 'rgba(255, 255, 255, 0.5)',
  tableHeaderBg: 'transparent',
  tableBorder: 'rgba(255, 255, 255, 0.75)',
  tableHover: '#FFFFFF',
  tableText: '#1C1C1E',

  brandPrimary: '#141416',
  brandPrimaryHover: '#2E2D2C',
  brandAccent: '#F16726',
  brandAccentHover: '#D4541A',
  brandAccentText: '#A94215',
  brandAccentSoft: '#FFF3EC',
  brandAccentRing: '#FFE3D3',
  badgeBg: '#FFF3EC',
  badgeText: '#A94215',
  buttonBg: '#141416',
  buttonHover: '#2E2D2C',
  navActiveDot: '#F16726',

  successText: '#2F8F5B',
  successSoft: 'rgba(47, 143, 91, 0.08)',
  successBorder: 'rgba(47, 143, 91, 0.25)',
  dangerText: '#C2412D',
  dangerSoft: 'rgba(194, 65, 45, 0.07)',
  dangerBorder: 'rgba(194, 65, 45, 0.25)',
  infoText: '#55524F',
  infoSoft: 'rgba(20, 20, 22, 0.04)',
  infoBorder: 'rgba(20, 20, 22, 0.12)',

  tabsTrack: 'rgba(20, 20, 22, 0.05)',
  tabsTrackShadow: 'inset 0 1px 3px rgba(20, 20, 22, 0.08)',
  tabsIndicator: '#FFFFFF',
  tabsIndicatorShadow:
    'inset 0 1px 0 rgba(255, 255, 255, 0.9), 0 1px 2px rgba(20, 20, 22, 0.08), 0 8px 16px -8px rgba(20, 20, 22, 0.3)',

  glassBg: 'rgba(255, 255, 255, 0.5)',
  glassBgStrong: 'rgba(255, 255, 255, 0.78)',
  glassBorder: 'rgba(255, 255, 255, 0.75)',
  glassHighlight: 'inset 0 1px 0 rgba(255, 255, 255, 0.9)',
  glassBlur: 'blur(22px) saturate(160%)',

  cardShadow:
    'inset 0 1px 0 rgba(255, 255, 255, 0.9), 0 1px 2px rgba(20, 20, 22, 0.04), 0 8px 24px -8px rgba(20, 20, 22, 0.08)',
  elev1: '0 1px 2px rgba(20, 20, 22, 0.04), 0 8px 24px -8px rgba(20, 20, 22, 0.08)',
  elev2: '0 2px 4px rgba(20, 20, 22, 0.04), 0 18px 40px -12px rgba(20, 20, 22, 0.14)',
  elev3: '0 4px 8px rgba(20, 20, 22, 0.05), 0 32px 64px -16px rgba(20, 20, 22, 0.22)',
  dropdownShadow: '0 4px 8px rgba(20, 20, 22, 0.04), 0 18px 40px -10px rgba(20, 20, 22, 0.18)',
  brandGlow: '0 12px 24px -10px rgba(241, 103, 38, 0.6)',

  blobStart: '#F9A272',
  blobMid: '#F16726',
  blobEnd: '#D4541A',
  blobOpacity: '0.55',
};

export const darkTokens: ThemeSemanticTokens = {
  bg: '#0E0E10',
  surface: 'rgba(30, 30, 33, 0.62)',
  surfaceSolid: '#1A1A1D',
  subtle: '#232326',
  hover: 'rgba(44, 44, 48, 0.85)',
  sidebarBg: 'rgba(24, 24, 27, 0.6)',
  sidebarSubtle: 'rgba(255, 255, 255, 0.05)',
  headerBg: 'rgba(24, 24, 27, 0.6)',

  border: 'rgba(255, 255, 255, 0.08)',
  borderSubtle: 'rgba(255, 255, 255, 0.05)',
  borderHover: 'rgba(255, 255, 255, 0.18)',

  textPrimary: '#F5F3F0',
  textSecondary: '#B5B0AA',
  textMuted: '#85807A',
  textOnBrand: '#FFFFFF',

  inputBg: 'rgba(255, 255, 255, 0.04)',
  inputBgHover: 'rgba(255, 255, 255, 0.07)',
  inputBgFocus: 'rgba(255, 255, 255, 0.07)',
  inputBorder: 'rgba(255, 255, 255, 0.1)',
  inputBorderHover: 'rgba(255, 255, 255, 0.2)',
  inputFocusBorder: '#F16726',
  inputFocusRing: '0 0 0 4px rgba(241, 103, 38, 0.22)',
  inputPlaceholder: '#77736F',

  tableBg: 'rgba(255, 255, 255, 0.03)',
  tableHeaderBg: 'transparent',
  tableBorder: 'rgba(255, 255, 255, 0.06)',
  tableHover: 'rgba(255, 255, 255, 0.07)',
  tableText: '#F5F3F0',

  brandPrimary: '#F5F3F0',
  brandPrimaryHover: '#FFFFFF',
  brandAccent: '#F16726',
  brandAccentHover: '#F5844A',
  brandAccentText: '#F9A272',
  brandAccentSoft: 'rgba(241, 103, 38, 0.12)',
  brandAccentRing: 'rgba(241, 103, 38, 0.3)',
  badgeBg: 'rgba(241, 103, 38, 0.14)',
  badgeText: '#F9A272',
  buttonBg: '#F16726',
  buttonHover: '#D4541A',
  navActiveDot: '#FFFFFF',

  successText: '#5FC08B',
  successSoft: 'rgba(95, 192, 139, 0.1)',
  successBorder: 'rgba(95, 192, 139, 0.3)',
  dangerText: '#EF7A66',
  dangerSoft: 'rgba(239, 122, 102, 0.1)',
  dangerBorder: 'rgba(239, 122, 102, 0.3)',
  infoText: '#B5B0AA',
  infoSoft: 'rgba(255, 255, 255, 0.05)',
  infoBorder: 'rgba(255, 255, 255, 0.12)',

  tabsTrack: 'rgba(0, 0, 0, 0.3)',
  tabsTrackShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.5)',
  tabsIndicator: '#2C2C30',
  tabsIndicatorShadow:
    'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 1px 2px rgba(0, 0, 0, 0.4), 0 8px 16px -8px rgba(0, 0, 0, 0.7)',

  glassBg: 'rgba(30, 30, 33, 0.55)',
  glassBgStrong: 'rgba(30, 30, 33, 0.82)',
  glassBorder: 'rgba(255, 255, 255, 0.08)',
  glassHighlight: 'inset 0 1px 0 rgba(255, 255, 255, 0.06)',
  glassBlur: 'blur(22px) saturate(140%)',

  cardShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 10px 30px -8px rgba(0, 0, 0, 0.5)',
  elev1: '0 10px 30px -8px rgba(0, 0, 0, 0.5)',
  elev2: '0 18px 40px -12px rgba(0, 0, 0, 0.6)',
  elev3: '0 32px 64px -16px rgba(0, 0, 0, 0.7)',
  dropdownShadow: '0 18px 40px -10px rgba(0, 0, 0, 0.7)',
  brandGlow: '0 12px 24px -10px rgba(241, 103, 38, 0.7)',

  blobStart: '#F5844A',
  blobMid: '#D4541A',
  blobEnd: '#7C3112',
  blobOpacity: '0.35',
};

/** Scheme-independent tokens (shape & motion). */
export const sharedTokens = {
  radiusSm: '10px',
  radiusMd: '14px',
  radiusLg: '20px',
  radiusXl: '28px',
  radiusPill: '999px',
  easeSoft: 'cubic-bezier(0.16, 1, 0.3, 1)',
  durationFast: '160ms',
  durationBase: '240ms',
  durationSlow: '400ms',
} as const;

export const appTokens = {
  light: lightTokens,
  dark: darkTokens,
  shared: sharedTokens,
};

/** camelCase token key -> `--app-kebab-case` CSS variable name. */
export function tokenVar(key: string): string {
  return `--app-${key.replace(/[A-Z0-9]/g, (m) => `-${m.toLowerCase()}`)}`;
}
