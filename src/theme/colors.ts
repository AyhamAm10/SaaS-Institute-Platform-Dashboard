import { MantineColorsTuple } from '@mantine/core';

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
 * Warm Sand & Porcelain Surface Scale for editorial backgrounds and borders.
 */
export const warmSandNeutral: MantineColorsTuple = [
  '#f5eee6', // 0: warm parchment canvas background
  '#fbf7f2', // 1: sidebar and header background
  '#fffaf5', // 2: crisp card surface background
  '#f0e3d8', // 3: secondary container tint
  '#e5d9cf', // 4: warm sand border
  '#b29a8e', // 5: muted icons and dividers
  '#9d817a', // 6: light taupe captions & subtitles
  '#806c69', // 7: muted taupe body text
  '#4d2936', // 8: dark burgundy charcoal
  '#351b25', // 9: primary plum headings
];

/**
 * Default assignments for Mantine core provider.
 * Existing code using 'primary', 'secondary', or 'slate' will automatically inherit this warm palette.
 */
export const defaultPrimaryColor: MantineColorsTuple = academicWineColor;
export const defaultSecondaryColor: MantineColorsTuple = goldenOchreColor;
export const slateNeutral: MantineColorsTuple = warmSandNeutral;

/**
 * Retained for backward compatibility with white-labeling configs.
 */
export const deepNavyColor: MantineColorsTuple = [
  '#f5eee6',
  '#e5d9cf',
  '#9d817a',
  '#806c69',
  '#59421e',
  '#4d2936',
  '#351b25',
  '#2a141d',
  '#1f0a12',
  '#15060c',
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
