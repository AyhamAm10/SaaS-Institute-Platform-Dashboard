import { createTheme, MantineThemeOverride, rem } from '@mantine/core';
import {
  brandOrangeColor,
  dangerColor,
  defaultPrimaryColor,
  infoColor,
  InstituteBrandConfig,
  successColor,
  warmDarkScale,
  warmGrayScale,
} from './colors';
import { defaultFontFamily, defaultFontFamilyMonospace, defaultHeadings } from './typography';
import { defaultComponents } from './components';

/**
 * Base Theme — Jeel Al-Salam identity: ink actions, logo-orange accents, frosted glass surfaces.
 *
 * Legacy Mantine palette names still used by page code (teal, blue, indigo, violet, yellow, ...)
 * are remapped onto the semantic tuples so every screen stays on-brand.
 */
export const baseTheme = createTheme({
  primaryColor: 'primary',
  primaryShade: { light: 6, dark: 6 },
  colors: {
    primary: defaultPrimaryColor,
    brand: brandOrangeColor,
    secondary: brandOrangeColor,
    orange: brandOrangeColor,
    yellow: brandOrangeColor,
    success: successColor,
    teal: successColor,
    green: successColor,
    danger: dangerColor,
    red: dangerColor,
    info: infoColor,
    blue: infoColor,
    indigo: infoColor,
    violet: infoColor,
    cyan: infoColor,
    grape: infoColor,
    navy: infoColor,
    slate: warmGrayScale,
    gray: warmGrayScale,
    dark: warmDarkScale,
  },
  white: '#FFFFFF',
  black: '#141416',
  fontFamily: defaultFontFamily,
  fontFamilyMonospace: defaultFontFamilyMonospace,
  headings: defaultHeadings,
  components: defaultComponents,
  defaultRadius: 'md',
  cursorType: 'pointer',
  radius: {
    xs: rem(8),
    sm: rem(10),
    md: rem(14),
    lg: rem(20),
    xl: rem(28),
  },
  spacing: {
    xs: rem(6),
    sm: rem(10),
    md: rem(16),
    lg: rem(22),
    xl: rem(30),
  },
});

/**
 * Creates a customized Mantine theme for a specific Institute.
 * Allows runtime multi-tenant white-labeling without altering UI code.
 */
export function createInstituteTheme(brand?: InstituteBrandConfig): MantineThemeOverride {
  if (!brand || (!brand.primaryShades && !brand.accentShades)) {
    return baseTheme;
  }

  return createTheme({
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      ...(brand.primaryShades && { primary: brand.primaryShades }),
      ...(brand.accentShades && { brand: brand.accentShades, secondary: brand.accentShades }),
    },
  });
}

export * from './tokens';
export * from './colors';
export * from './typography';
export * from './components';
export * from './css-variables';
