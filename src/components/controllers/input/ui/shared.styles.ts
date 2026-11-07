import type { CSSProperties } from 'react';
import { rem } from '@mantine/core';
import { ResolvedInputConfig } from '../init/input.init';

/**
 * Builds unified input styles: airy 42px fields, soft borders, ink border + orange ring on focus.
 * Relies on centralized CSS variables (--app-*) for unified light and dark themes.
 * Hover / placeholder states are handled in globals.css (`.mantine-Input-input`).
 */
/** Styles per Mantine input part (root, label, input, ...). */
export type UnifiedInputStyles = Record<string, CSSProperties>;

export function getUnifiedInputStyles(
  config: ResolvedInputConfig,
  isFocused: boolean,
  customStyles?: Record<string, CSSProperties>,
): UnifiedInputStyles {
  return {
    root: {
      ...customStyles?.root,
    },
    label: {
      fontWeight: 500,
      fontSize: rem(13),
      marginBottom: rem(6),
      color: 'var(--app-text-primary)',
      ...customStyles?.label,
    },
    description: {
      fontSize: rem(12),
      fontWeight: 300,
      marginBottom: rem(6),
      color: 'var(--app-text-muted)',
      ...customStyles?.description,
    },
    input: {
      // 'auto' is not a CSS direction: it goes on the dir attribute instead
      direction: config.direction === 'auto' ? undefined : config.direction,
      textAlign: config.textAlign,
      fontSize: rem(13.5),
      fontWeight: 400,
      minHeight: rem(42),
      height: rem(42),
      borderRadius: 'var(--app-radius-md)',
      backgroundColor: isFocused ? 'var(--app-input-bg-focus)' : 'var(--app-input-bg)',
      borderColor: isFocused
        ? 'var(--app-input-focus-border)'
        : 'var(--app-input-border)',
      borderWidth: rem(1),
      borderStyle: 'solid',
      color: 'var(--app-text-primary)',
      boxShadow: isFocused ? 'var(--app-input-focus-ring)' : 'none',
      ...customStyles?.input,
    },
    error: {
      fontSize: rem(12),
      marginTop: rem(4),
      fontWeight: 400,
      ...customStyles?.error,
    },
    section: {
      color: isFocused
        ? 'var(--app-brand-accent)'
        : 'var(--app-text-muted)',
      transition: 'color 140ms ease',
      ...customStyles?.section,
    },
    ...customStyles,
  };
}
