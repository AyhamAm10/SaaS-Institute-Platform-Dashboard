/**
 * Centralized Typography Configuration
 * Modern, clean, and elegant Arabic UI typography using Readex Pro with Tajawal fallback.
 */
export const defaultFontFamily =
  'var(--font-readex-pro), "Readex Pro", "Tajawal", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif';

export const defaultFontFamilyMonospace =
  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

export const defaultHeadings = {
  fontFamily: defaultFontFamily,
  fontWeight: '600',
  sizes: {
    h1: { fontSize: '1.5rem', lineHeight: '1.3' },
    h2: { fontSize: '1.25rem', lineHeight: '1.35' },
    h3: { fontSize: '1.1rem', lineHeight: '1.4' },
    h4: { fontSize: '0.95rem', lineHeight: '1.45' },
    h5: { fontSize: '0.85rem', lineHeight: '1.5' },
    h6: { fontSize: '0.75rem', lineHeight: '1.5' },
  },
};

