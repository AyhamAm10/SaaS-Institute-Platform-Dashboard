import { rem } from '@mantine/core';
import { ResolvedInputConfig } from '../init/input.init';

/**
 * Builds unified input styles adhering to the Modern Curved Organic UI Spirit (role.md Section 11).
 */
export function getUnifiedInputStyles(config: ResolvedInputConfig, isFocused: boolean, customStyles?: Record<string, any>) {
  return {
    root: {
      ...customStyles?.root,
    },
    label: {
      fontWeight: 600,
      fontSize: rem(13),
      marginBottom: rem(4),
      color: 'var(--mantine-color-text)',
      ...customStyles?.label,
    },
    description: {
      fontSize: rem(12),
      marginBottom: rem(4),
      color: 'var(--mantine-color-dimmed)',
      ...customStyles?.description,
    },
    input: {
      direction: config.direction,
      textAlign: config.textAlign,
      fontSize: rem(14),
      fontWeight: 500,
      minHeight: rem(48),
      height: rem(48),
      borderRadius: rem(14),
      backgroundColor: isFocused ? '#ffffff' : 'var(--mantine-color-gray-0)',
      borderColor: isFocused
        ? 'var(--mantine-color-primary-4)'
        : 'var(--mantine-color-gray-2)',
      borderWidth: rem(1.5),
      borderStyle: 'solid',
      boxShadow: isFocused
        ? '0 0 0 3.5px rgba(32, 183, 223, 0.16)'
        : 'none',
      transition: 'border-color 150ms ease, box-shadow 150ms ease, background-color 150ms ease',
      '&:hover': {
        backgroundColor: isFocused ? '#ffffff' : 'var(--mantine-color-gray-1)',
        borderColor: isFocused
          ? 'var(--mantine-color-primary-4)'
          : 'var(--mantine-color-gray-3)',
      },
      ...customStyles?.input,
    },
    error: {
      fontSize: rem(12),
      marginTop: rem(4),
      fontWeight: 500,
      ...customStyles?.error,
    },
    section: {
      color: isFocused
        ? 'var(--mantine-color-primary-5)'
        : 'var(--mantine-color-dimmed)',
      transition: 'color 150ms ease',
      ...customStyles?.section,
    },
    ...customStyles,
  };
}
