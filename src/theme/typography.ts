/**
 * Centralized Typography Configuration
 * Alexandria: geometric, modern Arabic UI font that stays airy at light weights.
 * Allowed weights: 300 (captions), 400 (body), 500 (labels, numbers), 600 (page titles).
 */
export const defaultFontFamily =
  'var(--font-alexandria), "Alexandria", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif';

export const defaultFontFamilyMonospace =
  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

export const defaultHeadings = {
  fontFamily: defaultFontFamily,
  fontWeight: '500',
  sizes: {
    h1: { fontSize: '1.625rem', lineHeight: '1.3', fontWeight: '600' },
    h2: { fontSize: '1.125rem', lineHeight: '1.4' },
    h3: { fontSize: '1rem', lineHeight: '1.45' },
    h4: { fontSize: '0.9375rem', lineHeight: '1.5' },
    h5: { fontSize: '0.875rem', lineHeight: '1.5' },
    h6: { fontSize: '0.75rem', lineHeight: '1.5' },
  },
};

/** Latin digits with Arabic locale rules, used everywhere numbers or dates are displayed. */
export const NUMBER_LOCALE = 'ar-SY-u-nu-latn';
