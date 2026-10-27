/**
 * Semantic Design Tokens for SaaS Education Platform Admin Dashboard.
 * Single Source of Truth for both Light and Dark themes.
 *
 * Theme Concept: Warm Academic Editorial
 * - Light: Velvet Burgundy (#491d2b) + Warm Parchment / Alabaster Cashmere + Golden Ochre (#c4a66b)
 * - Dark: Velvet Midnight Wine Mahogany (#140c11) + Warm Amber Gold + Soft Ivory Parchment (#faf3eb)
 */

export interface ThemeSemanticTokens {
  // Surfaces
  canvas: string;
  surface: string;
  surfaceSubtle: string;
  surfaceHover: string;
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

  // Inputs
  inputBg: string;
  inputBgHover: string;
  inputBgFocus: string;
  inputBorder: string;
  inputBorderHover: string;
  inputBorderFocus: string;
  inputFocusRing: string;
  inputPlaceholder: string;

  // Tables
  tableBg: string;
  tableHeaderBg: string;
  tableBorder: string;
  tableRowHover: string;
  tableText: string;

  // Brand Highlights
  brandPrimary: string;
  brandPrimaryHover: string;
  brandAccent: string;
  brandAccentHover: string;
  badgeBg: string;
  badgeText: string;

  // Elevation
  shadowCard: string;
  shadowDropdown: string;
}

export const lightTokens: ThemeSemanticTokens = {
  // Surfaces - Clean warm porcelain / alabaster cashmere, ZERO yellowish tint
  canvas: '#f6f3ee',
  surface: '#fffdfa',
  surfaceSubtle: '#eee6de',
  surfaceHover: '#faf5ef',
  sidebarBg: '#fbf8f4',
  sidebarSubtle: '#eee6de',
  headerBg: 'rgba(251, 248, 244, 0.94)',

  // Borders - Soft warm sand
  border: '#e3d7cb',
  borderSubtle: '#ede4da',
  borderHover: '#cbbdaf',

  // Typography - High-contrast velvety plum-charcoal
  textPrimary: '#351b25',
  textSecondary: '#7a6663',
  textMuted: '#9c8983',

  // Inputs - Warm organic cream, eliminating cold dull gray
  inputBg: '#faf6f1',
  inputBgHover: '#ffffff',
  inputBgFocus: '#ffffff',
  inputBorder: '#ded2c5',
  inputBorderHover: '#cbbdaf',
  inputBorderFocus: '#491d2b',
  inputFocusRing: '0 0 0 3px rgba(73, 29, 43, 0.10)',
  inputPlaceholder: '#9c8983',

  // Tables - Balanced contrast with no harsh white glare
  tableBg: '#fffdfa',
  tableHeaderBg: '#f4ede5',
  tableBorder: '#e6ded5',
  tableRowHover: '#faf5ef',
  tableText: '#351b25',

  // Brand
  brandPrimary: '#491d2b',
  brandPrimaryHover: '#3d1824',
  brandAccent: '#c4a66b',
  brandAccentHover: '#8b6a34',
  badgeBg: '#eee6de',
  badgeText: '#8b6a34',

  // Elevation
  shadowCard: '0 4px 16px rgba(73, 29, 43, 0.04)',
  shadowDropdown: '0 12px 32px rgba(73, 29, 43, 0.10)',
};

export const darkTokens: ThemeSemanticTokens = {
  // Surfaces - Modern Slate Obsidian & Elevated Graphite (zero suffocating red flood)
  canvas: '#0c0e12',
  surface: '#151821',
  surfaceSubtle: '#1b1f2b',
  surfaceHover: '#1f2432',
  sidebarBg: '#10131a',
  sidebarSubtle: '#181c26',
  headerBg: 'rgba(16, 19, 26, 0.94)',

  // Borders - Crisp slate with subtle contrast
  border: '#242938',
  borderSubtle: '#1b202c',
  borderHover: '#373e54',

  // Typography - High-contrast crisp Alabaster & Cool Slate
  textPrimary: '#f8fafc',
  textSecondary: '#94a3b8',
  textMuted: '#64748b',

  // Inputs - Sleek dark slate with navy focus ring
  inputBg: '#10131a',
  inputBgHover: '#141822',
  inputBgFocus: '#141822',
  inputBorder: '#272d3d',
  inputBorderHover: '#384157',
  inputBorderFocus: '#2563eb',
  inputFocusRing: '0 0 0 3px rgba(37, 99, 235, 0.20)',
  inputPlaceholder: '#64748b',

  // Tables - Refined dark editorial with distinct header
  tableBg: '#151821',
  tableHeaderBg: '#1b202c',
  tableBorder: '#222735',
  tableRowHover: '#1a1f2b',
  tableText: '#f8fafc',

  // Brand - Academic Deep Navy for buttons & Warm Amber for prestigious accents
  brandPrimary: '#1e40af',
  brandPrimaryHover: '#1d3899',
  brandAccent: '#d4a359',
  brandAccentHover: '#e6b973',
  badgeBg: 'rgba(30, 64, 175, 0.15)',
  badgeText: '#93c5fd',

  // Elevation
  shadowCard: '0 6px 20px rgba(0, 0, 0, 0.45)',
  shadowDropdown: '0 16px 40px rgba(0, 0, 0, 0.60)',
};

export const appTokens = {
  light: lightTokens,
  dark: darkTokens,
};
