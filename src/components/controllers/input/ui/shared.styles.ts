import { ResolvedInputConfig } from '../init/input.init';

/**
 * Builds unified input styles.
 * Colors, borders, height and hover/focus states come from the theme and
 * `src/app/globals.css`; only per-input layout lives here.
 */
export function getUnifiedInputStyles(config: ResolvedInputConfig, isFocused: boolean, customStyles?: Record<string, any>) {
  return {
    root: {
      ...customStyles?.root,
    },
    label: {
      ...customStyles?.label,
    },
    description: {
      ...customStyles?.description,
    },
    input: {
      direction: config.direction,
      textAlign: config.textAlign,
      ...customStyles?.input,
    },
    error: {
      ...customStyles?.error,
    },
    section: {
      color: isFocused
        ? 'var(--app-brand-primary)'
        : 'var(--app-text-muted)',
      transition: 'color 140ms ease',
      ...customStyles?.section,
    },
    ...customStyles,
  };
}
