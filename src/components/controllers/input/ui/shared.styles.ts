import { rem } from '@mantine/core';
import { ResolvedInputConfig } from '../init/input.init';

/**
 * Builds unified input styles adhering to classic, clean, compact UI proportions.
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
      color: 'var(--mantine-color-text)',
      ...customStyles?.label,
    },
    description: {
      fontSize: rem(11.5),
      marginBottom: rem(4),
      color: 'var(--mantine-color-dimmed)',
      ...customStyles?.description,
    },
    input: {
      direction: config.direction,
      textAlign: config.textAlign,
      fontSize: rem(13),
      fontWeight: 400,
      minHeight: rem(38),
      height: rem(38),
      borderRadius: rem(8),
      backgroundColor: isFocused ? '#ffffff' : 'var(--mantine-color-gray-0)',
      borderColor: isFocused
        ? 'var(--mantine-color-primary-6)'
        : 'var(--mantine-color-gray-3)',
      borderWidth: rem(1),
      borderStyle: 'solid',
      boxShadow: isFocused
        ? '0 0 0 2px rgba(32, 183, 223, 0.15)'
        : '0 1px 2px rgba(0, 0, 0, 0.02)',
      transition: 'border-color 120ms ease, box-shadow 120ms ease, background-color 120ms ease',
      '&:hover': {
        backgroundColor: isFocused ? '#ffffff' : '#ffffff',
        borderColor: isFocused
          ? 'var(--mantine-color-primary-6)'
          : 'var(--mantine-color-gray-4)',
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
        ? 'var(--mantine-color-primary-6)'
        : 'var(--mantine-color-dimmed)',
      transition: 'color 120ms ease',
      ...customStyles?.section,
    },
    ...customStyles,
  };
}
