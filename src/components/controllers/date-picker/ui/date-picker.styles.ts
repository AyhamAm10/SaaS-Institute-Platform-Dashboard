import { rem } from '@mantine/core';

/**
 * Builds unified styles for DatePickerInput adhering strictly to the
 * 38px height and curved classic design tokens used by AppInput and AppSelect.
 * Uses centralized CSS variables (--app-*) for unified light and dark support.
 */
export function getUnifiedDatePickerStyles(isFocused: boolean, hasError: boolean, customStyles?: Record<string, any>) {
  return {
    root: {
      width: '100%',
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
      direction: 'rtl' as const,
      textAlign: 'right' as const,
      fontSize: rem(13),
      fontWeight: 400,
      minHeight: rem(38),
      height: rem(38),
      lineHeight: rem(36),
      borderRadius: rem(10),
      backgroundColor: isFocused ? 'var(--app-input-bg-focus)' : 'var(--app-input-bg)',
      borderColor: hasError
        ? 'var(--mantine-color-error)'
        : isFocused
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
        borderColor: hasError
          ? 'var(--mantine-color-error)'
          : isFocused
            ? 'var(--app-input-focus-border)'
            : 'var(--app-input-border-hover)',
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
    calendarHeader: {
      direction: 'rtl' as const,
      ...customStyles?.calendarHeader,
    },
    calendarHeaderControl: {
      borderRadius: rem(6),
      ...customStyles?.calendarHeaderControl,
    },
    calendarHeaderLevel: {
      borderRadius: rem(6),
      fontWeight: 600,
      fontSize: rem(13),
      color: 'var(--app-text-primary)',
      ...customStyles?.calendarHeaderLevel,
    },
    day: {
      borderRadius: rem(8),
      fontSize: rem(12.5),
      ...customStyles?.day,
    },
    levelsGroup: {
      direction: 'rtl' as const,
      ...customStyles?.levelsGroup,
    },
    ...customStyles,
  };
}
