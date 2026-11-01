import { MantineColorsTuple } from '@mantine/core';

/**
 * Color palette for the Admin Dashboard.
 *
 * Every color used in the UI must come from one of these named palettes:
 *   primary   – Academic Wine: brand, primary actions, active navigation
 *   secondary – Golden Ochre: brand accent, highlights, "current" markers
 *   gray      – Warm neutrals: surfaces, borders, secondary text
 *   success / warning / danger / info – semantic states only
 *
 * Semantic CSS variables (--app-*) live in `src/app/globals.css`.
 */

/** Primary brand color: Academic Wine (#491d2b) */
export const primaryColor: MantineColorsTuple = [
  '#fdf7f7',
  '#f5e6e8',
  '#e8c9ce',
  '#d5a3ab',
  '#b26a76',
  '#803946',
  '#491d2b',
  '#3d1824',
  '#30131d',
  '#1f0a12',
];

/** Brand accent: Golden Ochre (#c4a66b) */
export const secondaryColor: MantineColorsTuple = [
  '#fdfaf3',
  '#f9f2e3',
  '#f0e0be',
  '#e4cb93',
  '#d6b468',
  '#c4a66b',
  '#8b6a34',
  '#745729',
  '#59421e',
  '#3e2d13',
];

/** Warm neutral scale replacing Mantine's cold blue-gray */
export const grayColor: MantineColorsTuple = [
  '#f6f3ee',
  '#eee6de',
  '#e3d7cb',
  '#d6c9bc',
  '#b8a5a2',
  '#9c8983',
  '#7a6663',
  '#4a333c',
  '#351b25',
  '#1c1218',
];

/** Warm dark scale for dark mode (Mantine's `dark` palette drives dark surfaces and text) */
export const darkColor: MantineColorsTuple = [
  '#ece3de',
  '#c9bab4',
  '#a8968f',
  '#7f6d68',
  '#58474b',
  '#403037',
  '#2a1f24',
  '#1d1519',
  '#181114',
  '#0f0a0c',
];

/** Success: Sage green */
export const successColor: MantineColorsTuple = [
  '#f1f7f2',
  '#dfeee2',
  '#bddcc4',
  '#97c7a3',
  '#73b183',
  '#559c69',
  '#3f8556',
  '#336b46',
  '#285538',
  '#1b3a26',
];

/** Warning: Amber */
export const warningColor: MantineColorsTuple = [
  '#fff6eb',
  '#fde8cc',
  '#f9cf98',
  '#f4b260',
  '#ee9a37',
  '#e0861f',
  '#c06d14',
  '#9a5611',
  '#77420f',
  '#4f2b09',
];

/** Danger: Brick red */
export const dangerColor: MantineColorsTuple = [
  '#fdf2f1',
  '#f9e0de',
  '#f1bdb8',
  '#e7948d',
  '#dc6c63',
  '#cf4c42',
  '#b83a31',
  '#972f28',
  '#752520',
  '#4d1814',
];

/** Info: Dusty blue */
export const infoColor: MantineColorsTuple = [
  '#eff5f8',
  '#dbe8ef',
  '#b6d0de',
  '#8db5ca',
  '#679bb6',
  '#4d84a2',
  '#3d6d88',
  '#32586e',
  '#284555',
  '#1a2e39',
];

/** Default brand colors, used as fallbacks for institutes without their own branding */
export const DEFAULT_BRAND_PRIMARY = primaryColor[6];
export const DEFAULT_BRAND_SECONDARY = secondaryColor[5];

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
