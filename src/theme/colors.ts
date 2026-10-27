import { MantineColorsTuple } from '@mantine/core';
import { appTokens, darkTokens, lightTokens, ThemeSemanticTokens } from './tokens';

/**
 * Primary Brand Color: Institutional Burgundy / Wine (#491d2b)
 * Warm, authoritative, and elegant educational institution color scheme.
 */
export const academicWineColor: MantineColorsTuple = [
  '#fdf7f7', // 0: ultra light porcelain pink
  '#f5e6e8', // 1: soft wine badge background
  '#e8c9ce', // 2: subtle focus ring / warm glow
  '#d5a3ab', // 3: muted wine accent
  '#b26a76', // 4: active warm border
  '#803946', // 5: intermediate wine accent
  '#491d2b', // 6: primary brand shade (high contrast WCAG AAA compliant)
  '#3d1824', // 7: dark hover
  '#30131d', // 8: deep plum wine
  '#1f0a12', // 9: midnight wine
];

/**
 * Secondary Accent Color: Golden Ochre / Camel Warmth (#c4a66b / #8b6a34)
 * Prestigious academic accent for indicators, badges, and progress states.
 */
export const goldenOchreColor: MantineColorsTuple = [
  '#fdfaf3', // 0: ultra light warm cream
  '#f9f2e3', // 1: soft gold badge
  '#f0e0be', // 2: subtle gold ring
  '#e4cb93', // 3: warm camel accent
  '#d6b468', // 4: golden accent
  '#c4a66b', // 5: hero ochre gold
  '#8b6a34', // 6: primary accent text shade (high contrast)
  '#745729', // 7: dark gold hover
  '#59421e', // 8: deep bronze
  '#3e2d13', // 9: midnight bronze
];

/**
 * Warm Neutral Scale (Parchment, Alabaster Cashmere, Warm Sand).
 * Zero yellowish/muddy cast - refined, high-end editorial surfaces.
 */
export const warmSandNeutral: MantineColorsTuple = [
  '#f6f3ee', // 0: warm canvas
  '#fbf8f4', // 1: sidebar & header surface
  '#fffdfa', // 2: card surface
  '#eee6de', // 3: secondary container / subtle surface
  '#e3d7cb', // 4: primary border
  '#b8a5a2', // 5: muted icons & secondary text
  '#9c8983', // 6: placeholder & captions
  '#7a6663', // 7: secondary body text
  '#4a333c', // 8: deep plum charcoal
  '#351b25', // 9: headings & deep text
];

/**
 * Custom Warm Gray scale replacing Mantine's default cold blue-gray.
 * Ensures any Mantine component or utility referencing 'gray' inherits the warm aesthetic.
 */
export const warmGrayScale: MantineColorsTuple = [
  '#f6f3ee', // gray 0: subtle light surface
  '#eee6de', // gray 1: soft container
  '#e3d7cb', // gray 2: default border
  '#d6c9bc', // gray 3: stronger border
  '#b8a5a2', // gray 4: muted icons
  '#9c8983', // gray 5: placeholder
  '#7a6663', // gray 6: secondary text
  '#4a333c', // gray 7: dark text
  '#351b25', // gray 8: headings
  '#1c1218', // gray 9: near black
];

/**
 * Default assignments for Mantine core provider.
 */
export const defaultPrimaryColor: MantineColorsTuple = academicWineColor;
export const defaultSecondaryColor: MantineColorsTuple = goldenOchreColor;
export const slateNeutral: MantineColorsTuple = warmSandNeutral;

/**
 * Academic Royal Navy scale for buttons and crisp contrast in dark mode.
 */
export const deepNavyColor: MantineColorsTuple = [
  '#f0f5fa', // 0: ultra light ice blue
  '#dbe7f4', // 1: soft navy tint
  '#b8d2ec', // 2: subtle navy glow
  '#8bb4df', // 3: muted navy accent
  '#5991cc', // 4: intermediate blue
  '#3573b7', // 5: vibrant royal blue
  '#2563eb', // 6: primary bright navy
  '#1e40af', // 7: academic deep royal navy (primary action)
  '#1e3a8a', // 8: midnight navy hover
  '#0f172a', // 9: deepest midnight navy
];

export { appTokens, lightTokens, darkTokens };
export type { ThemeSemanticTokens };

/**
 * Multi-Tenant White-Labeling Branding Configuration Interface.
 */
export interface InstituteBrandConfig {
  name: string;
  logoUrl?: string;
  primaryColor?: string;
  primaryShades?: MantineColorsTuple;
  secondaryColor?: string;
}
