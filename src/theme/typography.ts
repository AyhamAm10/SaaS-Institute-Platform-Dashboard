import { rem } from '@mantine/core';

/**
 * Centralized Typography Configuration
 * Readex Pro with Tajawal fallback.
 *
 * Type scale: 12 · 14 · 16 · 20 · 24 · 32
 * Weights:    400 regular · 500 medium · 700 bold
 */
export const defaultFontFamily =
  'var(--font-readex-pro), "Readex Pro", "Tajawal", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif';

export const defaultFontFamilyMonospace =
  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

export const defaultFontSizes = {
  xs: rem(12),
  sm: rem(14),
  md: rem(16),
  lg: rem(20),
  xl: rem(24),
};

export const defaultLineHeights = {
  xs: '1.5',
  sm: '1.55',
  md: '1.6',
  lg: '1.5',
  xl: '1.4',
};

export const defaultHeadings = {
  fontFamily: defaultFontFamily,
  fontWeight: '700',
  sizes: {
    h1: { fontSize: rem(32), lineHeight: '1.25' },
    h2: { fontSize: rem(24), lineHeight: '1.3' },
    h3: { fontSize: rem(20), lineHeight: '1.35' },
    h4: { fontSize: rem(16), lineHeight: '1.45' },
    h5: { fontSize: rem(14), lineHeight: '1.5' },
    h6: { fontSize: rem(12), lineHeight: '1.5' },
  },
};
