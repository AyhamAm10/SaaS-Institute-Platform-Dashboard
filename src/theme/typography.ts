/**
 * Centralized Typography Configuration
 * Classic, clean, and unadorned Arabic UI typography using IBM Plex Sans Arabic.
 */
export const defaultFontFamily =
  'var(--font-ibm-plex-arabic), "IBM Plex Sans Arabic", "Tajawal", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif';

export const defaultFontFamilyMonospace =
  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

export const defaultHeadings = {
  fontFamily: defaultFontFamily,
  fontWeight: '700',
  sizes: {
    h1: { fontSize: '1.45rem', lineHeight: '1.3' },
    h2: { fontSize: '1.2rem', lineHeight: '1.35' },
    h3: { fontSize: '1.05rem', lineHeight: '1.4' },
    h4: { fontSize: '0.925rem', lineHeight: '1.45' },
    h5: { fontSize: '0.825rem', lineHeight: '1.5' },
    h6: { fontSize: '0.75rem', lineHeight: '1.5' },
  },
};
