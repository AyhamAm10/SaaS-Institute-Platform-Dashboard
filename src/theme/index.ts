import { createTheme, MantineThemeOverride, rem } from '@mantine/core';
import {
  defaultPrimaryColor,
  defaultSecondaryColor,
  slateNeutral,
  warmGrayScale,
  deepNavyColor,
  InstituteBrandConfig,
} from './colors';
import { defaultFontFamily, defaultFontFamilyMonospace, defaultHeadings } from './typography';
import { defaultComponents } from './components';

/**
 * Base Theme for SaaS Admin Platform - Clean, Classic, Warm Academic Editorial Style
 */
export const baseTheme = createTheme({
  primaryColor: 'primary',
  primaryShade: { light: 6, dark: 5 },
  colors: {
    primary: defaultPrimaryColor,
    secondary: defaultSecondaryColor,
    slate: slateNeutral,
    gray: warmGrayScale,
    navy: deepNavyColor,
  },
  fontFamily: defaultFontFamily,
  fontFamilyMonospace: defaultFontFamilyMonospace,
  headings: defaultHeadings,
  components: defaultComponents,
  defaultRadius: 'md',
  cursorType: 'pointer',
  spacing: {
    xs: rem(6),
    sm: rem(10),
    md: rem(14),
    lg: rem(20),
    xl: rem(28),
  },
});

/**
 * Creates a customized Mantine theme for a specific Institute.
 * Allows runtime multi-tenant white-labeling without altering UI code.
 */
export function createInstituteTheme(brand?: InstituteBrandConfig): MantineThemeOverride {
  if (!brand || !brand.primaryShades) {
    return baseTheme;
  }

  return createTheme({
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: brand.primaryShades,
    },
  });
}

export * from './tokens';
export * from './colors';
export * from './typography';
export * from './components';
