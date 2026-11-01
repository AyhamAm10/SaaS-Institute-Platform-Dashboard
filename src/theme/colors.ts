import { MantineColorsTuple } from '@mantine/core';
import { appTokens, darkTokens, lightTokens, ThemeSemanticTokens } from './tokens';

/**
 * Brand Orange — official logo color #F16726 (index 6).
 * Used for accents, highlights, focus rings and ambient blobs. Index 8 is the text-safe shade on white.
 */
export const brandOrangeColor: MantineColorsTuple = [
  '#FFF3EC', // 0 ultra soft background
  '#FFE3D3', // 1 badge background / selection ring
  '#FDC4A4', // 2 focus ring
  '#F9A272', // 3 blob gradient start
  '#F5844A', // 4 glow
  '#F37334', // 5
  '#F16726', // 6 official logo orange
  '#D4541A', // 7 hover / gradient end
  '#A94215', // 8 text on white (AA)
  '#7C3112', // 9 deepest
];

/**
 * Ink — the primary action color (black with orange touches).
 * Index 6 is the main shade so existing `primary-6` references stay the brand black;
 * index 7 is the (lighter) hover shade Mantine uses for filled buttons.
 */
export const inkColor: MantineColorsTuple = [
  '#F5F3F0', // 0 canvas
  '#EEECE9', // 1 soft container
  '#E2DFDB', // 2 border
  '#CBC7C2', // 3 strong border
  '#A29E99', // 4 muted icons / placeholder
  '#55524F', // 5 secondary text
  '#141416', // 6 brand ink (buttons, active states)
  '#2E2D2C', // 7 hover
  '#0E0E10', // 8 pressed
  '#000000', // 9
];

/** Warm neutral gray scale replacing Mantine's cold default. */
export const warmGrayScale: MantineColorsTuple = [
  '#F5F3F0', // 0 subtle surface
  '#EEECE9', // 1 soft container
  '#E2DFDB', // 2 default border
  '#CBC7C2', // 3 strong border
  '#A29E99', // 4 muted icons
  '#8F8A85', // 5 placeholder
  '#5F5B57', // 6 secondary text
  '#3A3836', // 7 dark text
  '#1C1C1E', // 8 headings
  '#141416', // 9 near black
];

/** Dark-scheme neutrals (Mantine uses `dark` for dark-mode surfaces). */
export const warmDarkScale: MantineColorsTuple = [
  '#D9D5D0',
  '#B5B0AA',
  '#85807A',
  '#5F5B57',
  '#3A3836',
  '#2A2A2D',
  '#1E1E21',
  '#161618',
  '#111113',
  '#0B0B0C',
];

/** Muted olive green for success states. */
export const successColor: MantineColorsTuple = [
  '#EEF7F1', '#D8EDE0', '#B2DBC2', '#89C8A2', '#66B787',
  '#4FA674', '#2F8F5B', '#27784C', '#1F603D', '#16462D',
];

/** Muted brick red for destructive/danger states. */
export const dangerColor: MantineColorsTuple = [
  '#FCEFEC', '#F7D9D3', '#EEB3A8', '#E48A7A', '#DA6955',
  '#CF5640', '#C2412D', '#A33524', '#82291C', '#5F1E14',
];

/** Quiet slate for neutral information (replaces blue / indigo / violet). */
export const infoColor: MantineColorsTuple = [
  '#F3F3F2', '#E6E5E3', '#CDCAC7', '#B0ACA8', '#928D88',
  '#77736F', '#5F5B57', '#4A4744', '#363431', '#22201F',
];

export const defaultPrimaryColor: MantineColorsTuple = inkColor;
export const defaultSecondaryColor: MantineColorsTuple = brandOrangeColor;

export { appTokens, lightTokens, darkTokens };
export type { ThemeSemanticTokens };

/**
 * Multi-Tenant White-Labeling Branding Configuration Interface.
 * Today only Jeel Al-Salam is configured; swapping `accentShades` re-brands the accent tuple.
 */
export interface InstituteBrandConfig {
  name: string;
  logoUrl?: string;
  primaryColor?: string;
  primaryShades?: MantineColorsTuple;
  accentShades?: MantineColorsTuple;
  secondaryColor?: string;
}
