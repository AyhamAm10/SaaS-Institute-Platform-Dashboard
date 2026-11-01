import { alpha, createTheme, CSSVariablesResolver, MantineThemeOverride, rem } from '@mantine/core';
import {
  primaryColor,
  secondaryColor,
  grayColor,
  darkColor,
  successColor,
  warningColor,
  dangerColor,
  infoColor,
  InstituteBrandConfig,
} from './colors';
import {
  defaultFontFamily,
  defaultFontFamilyMonospace,
  defaultFontSizes,
  defaultHeadings,
  defaultLineHeights,
} from './typography';
import { defaultComponents } from './components';

/**
 * Base Theme for SaaS Admin Platform - Warm Academic Editorial Style.
 *
 * Scales are intentionally small so the UI stays consistent:
 *   radius:  sm 6 · md 10 · lg 16 · xl pill
 *   spacing: 4-pt grid
 */
export const baseTheme = createTheme({
  primaryColor: 'primary',
  primaryShade: { light: 6, dark: 5 },
  colors: {
    primary: primaryColor,
    secondary: secondaryColor,
    gray: grayColor,
    dark: darkColor,
    success: successColor,
    warning: warningColor,
    danger: dangerColor,
    info: infoColor,

    // Aliases: page UIs still use Mantine's palette names, so they are remapped
    // onto the semantic palettes here. New code should use the semantic names.
    // (`red` also drives Mantine's built-in error color.)
    teal: successColor,
    green: successColor,
    red: dangerColor,
    yellow: warningColor,
    orange: warningColor,
    blue: infoColor,
    cyan: infoColor,
    indigo: primaryColor,
    navy: primaryColor,
    pink: primaryColor,
    violet: secondaryColor,
    grape: secondaryColor,
  },
  fontFamily: defaultFontFamily,
  fontFamilyMonospace: defaultFontFamilyMonospace,
  fontSizes: defaultFontSizes,
  lineHeights: defaultLineHeights,
  headings: defaultHeadings,
  components: defaultComponents,
  defaultRadius: 'md',
  radius: {
    xs: rem(6),
    sm: rem(6),
    md: rem(10),
    lg: rem(16),
    xl: rem(9999),
  },
  spacing: {
    xs: rem(8),
    sm: rem(12),
    md: rem(16),
    lg: rem(24),
    xl: rem(32),
  },
  cursorType: 'pointer',
});

/**
 * Dark-mode "light" variants (light Badges, Buttons, ThemeIcons…).
 * Mantine derives them from `darken(shade 9)`, which turns our deep shades
 * almost black; a translucent mid shade keeps each color recognisable.
 */
export const cssVariablesResolver: CSSVariablesResolver = (theme) => {
  const dark: Record<string, string> = {};

  for (const name of Object.keys(theme.colors)) {
    if (name === 'dark') continue;
    const shades = theme.colors[name];
    dark[`--mantine-color-${name}-light`] = alpha(shades[5], 0.18);
    dark[`--mantine-color-${name}-light-hover`] = alpha(shades[5], 0.26);
    dark[`--mantine-color-${name}-light-color`] = shades[3];
  }

  return { variables: {}, light: {}, dark };
};

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
