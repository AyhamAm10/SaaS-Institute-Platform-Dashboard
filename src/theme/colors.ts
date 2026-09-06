import { MantineColorsTuple } from '@mantine/core';

/**
 * Default SaaS Platform Primary Color: Vibrant Cyan-Teal
 * Calibrated to match the login-hero illustration and modern SaaS aesthetics.
 */
export const defaultPrimaryColor: MantineColorsTuple = [
  '#e6f9fd', // 0: ultra light ice-cyan
  '#c7effa', // 1: soft cyan badge
  '#8fe0f5', // 2: subtle focus ring / glow
  '#4ec7eb', // 3: vibrant cyan accent
  '#20b7df', // 4: active cyan border
  '#00a8cc', // 5: hero cyan accent
  '#008fae', // 6: primary brand shade (high contrast WCAG compliant)
  '#00748e', // 7: dark hover
  '#055b70', // 8: deep ocean
  '#084b5c', // 9: midnight cyan
];

/**
 * Secondary Accent Color: Educational Mint-Teal (matching hero sweater and beanbag)
 */
export const defaultSecondaryColor: MantineColorsTuple = [
  '#e6fcfb',
  '#ccfbf1',
  '#99f6e4',
  '#5eead4',
  '#2dd4bf',
  '#14b8a6',
  '#0d9488', // Accent shade (index 6)
  '#0f766e',
  '#115e59',
  '#134e4a',
];

/**
 * Midnight Deep Navy Scale (matching hero window frames and dark login button)
 */
export const deepNavyColor: MantineColorsTuple = [
  '#f1f5f9',
  '#e2e8f0',
  '#cbd5e1',
  '#94a3b8',
  '#64748b',
  '#334155',
  '#1e293b',
  '#0f172a',
  '#0a1128', // Dark button color
  '#050b18',
];

/**
 * Neutral Slate Surface Scale for refined light & dark backgrounds
 */
export const slateNeutral: MantineColorsTuple = [
  '#f8fafc',
  '#f1f5f9',
  '#e2e8f0',
  '#cbd5e1',
  '#94a3b8',
  '#64748b',
  '#475569',
  '#334155',
  '#1e293b',
  '#0f172a',
];

/**
 * Multi-Tenant White-Labeling Branding Configuration Interface.
 * Institutes can customize primary, secondary colors and logos.
 */
export interface InstituteBrandConfig {
  name: string;
  logoUrl?: string;
  primaryColor?: string; // hex or color key
  primaryShades?: MantineColorsTuple;
  secondaryColor?: string;
}
