/**
 * Centralized Typography Configuration
 * Premium, sleek, and compact Arabic UI typography using Readex Pro & Tajawal.
 */
export const defaultFontFamily =
  'var(--font-readex-pro), "Readex Pro", "Tajawal", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

export const defaultFontFamilyMonospace =
  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

export const defaultHeadings = {
  fontFamily: defaultFontFamily,
  fontWeight: '700',
  sizes: {
    h1: { fontSize: '1.75rem', lineHeight: '1.3' },
    h2: { fontSize: '1.35rem', lineHeight: '1.35' },
    h3: { fontSize: '1.15rem', lineHeight: '1.4' },
    h4: { fontSize: '1rem', lineHeight: '1.45' },
    h5: { fontSize: '0.875rem', lineHeight: '1.5' },
    h6: { fontSize: '0.775rem', lineHeight: '1.5' },
  },
};
