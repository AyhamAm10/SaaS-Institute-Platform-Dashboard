import { createTheme, MantineThemeOverride, rem } from '@mantine/core';
import { defaultPrimaryColor, defaultSecondaryColor, slateNeutral, InstituteBrandConfig } from './colors';
import { defaultFontFamily, defaultFontFamilyMonospace, defaultHeadings } from './typography';
import { defaultComponents } from './components';

/**
 * Base Theme for SaaS Admin Platform - Curved Organic Modern Arabic Style
 */
export const baseTheme = createTheme({
  primaryColor: 'primary',
  primaryShade: { light: 6, dark: 5 },
  colors: {
    primary: defaultPrimaryColor,
    secondary: defaultSecondaryColor,
    slate: slateNeutral,
  },
  fontFamily: defaultFontFamily,
  fontFamilyMonospace: defaultFontFamilyMonospace,
  headings: defaultHeadings,
  components: defaultComponents,
  defaultRadius: 'lg',
  cursorType: 'pointer',
  spacing: {
    xs: rem(8),
    sm: rem(12),
    md: rem(16),
    lg: rem(24),
    xl: rem(32),
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

export * from './colors';
export * from './typography';
export * from './components';
