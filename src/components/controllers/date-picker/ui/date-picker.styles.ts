import { rem } from '@mantine/core';

/**
 * Builds unified styles for DatePickerInput, matching AppInput / AppSelect
 * (42px fields, soft borders, ink border + orange ring on focus).
 * Uses centralized CSS variables (--app-*) for unified light and dark support.
 */
export function getUnifiedDatePickerStyles(
  isFocused: boolean,
  hasError: boolean,
  customStyles?: Record<string, Record<string, unknown>>,
) {
  return {
    root: {
      width: '100%',
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
      direction: 'rtl' as const,
      textAlign: 'right' as const,
      fontSize: rem(13.5),
      fontWeight: 400,
      minHeight: rem(42),
      height: rem(42),
      lineHeight: rem(40),
      borderRadius: 'var(--app-radius-md)',
      backgroundColor: isFocused ? 'var(--app-input-bg-focus)' : 'var(--app-input-bg)',
      borderColor: hasError
        ? 'var(--app-danger-text)'
        : isFocused
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
    calendarHeader: {
      direction: 'rtl' as const,
      ...customStyles?.calendarHeader,
    },
    calendarHeaderControl: {
      borderRadius: 'var(--app-radius-pill)',
      ...customStyles?.calendarHeaderControl,
    },
    calendarHeaderLevel: {
      borderRadius: 'var(--app-radius-pill)',
      fontWeight: 500,
      fontSize: rem(13.5),
      color: 'var(--app-text-primary)',
      ...customStyles?.calendarHeaderLevel,
    },
    day: {
      borderRadius: 'var(--app-radius-pill)',
      fontSize: rem(13),
      ...customStyles?.day,
    },
    levelsGroup: {
      direction: 'rtl' as const,
      ...customStyles?.levelsGroup,
    },
    ...customStyles,
  };
}
