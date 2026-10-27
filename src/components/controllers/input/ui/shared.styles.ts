import { rem } from '@mantine/core';
import { ResolvedInputConfig } from '../init/input.init';

/**
 * Builds unified input styles adhering to classic, clean, compact UI proportions.
 * Relies on centralized CSS variables (--app-*) for unified light and dark themes.
 */
export function getUnifiedInputStyles(config: ResolvedInputConfig, isFocused: boolean, customStyles?: Record<string, any>) {
  return {
    root: {
      ...customStyles?.root,
    },
    label: {
      fontWeight: 600,
      fontSize: rem(12.5),
      marginBottom: rem(4),
      color: 'var(--app-text-primary)',
      ...customStyles?.label,
    },
    description: {
      fontSize: rem(11.5),
      marginBottom: rem(4),
      color: 'var(--app-text-muted)',
      ...customStyles?.description,
    },
    input: {
      direction: config.direction,
      textAlign: config.textAlign,
      fontSize: rem(13),
      fontWeight: 400,
      minHeight: rem(38),
      height: rem(38),
      borderRadius: rem(10),
      backgroundColor: isFocused ? 'var(--app-input-bg-focus)' : 'var(--app-input-bg)',
      borderColor: isFocused
        ? 'var(--app-input-focus-border)'
        : 'var(--app-input-border)',
      borderWidth: rem(1),
      borderStyle: 'solid',
      color: 'var(--app-text-primary)',
      boxShadow: isFocused
        ? 'var(--app-input-focus-ring)'
        : '0 1px 2px rgba(0, 0, 0, 0.02)',
      transition: 'border-color 140ms ease, box-shadow 140ms ease, background-color 140ms ease',
      '&:hover': {
        backgroundColor: 'var(--app-input-bg-hover)',
        borderColor: isFocused
          ? 'var(--app-input-focus-border)'
          : 'var(--app-input-border-hover)',
      },
      '&::placeholder': {
        color: 'var(--app-input-placeholder)',
      },
      '&::-webkit-inner-spin-button, &::-webkit-outer-spin-button': {
        WebkitAppearance: 'none',
        margin: 0,
      },
      '&[type=number]': {
        MozAppearance: 'textfield',
      },
      ...customStyles?.input,
    },
    error: {
      fontSize: rem(11.5),
      marginTop: rem(3),
      fontWeight: 500,
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
