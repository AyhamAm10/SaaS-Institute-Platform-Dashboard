import { rem } from '@mantine/core';

/**
 * Builds unified styles for DatePickerInput adhering strictly to the
 * 38px height and curved classic design tokens used by AppInput and AppSelect.
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
      direction: 'rtl' as const,
      textAlign: 'right' as const,
      fontSize: rem(13),
      fontWeight: 400,
      minHeight: rem(38),
      height: rem(38),
      lineHeight: rem(36),
      borderRadius: rem(8),
      backgroundColor: isFocused ? '#ffffff' : 'var(--mantine-color-gray-0)',
      borderColor: hasError
        ? 'var(--mantine-color-error)'
        : isFocused
          ? 'var(--mantine-color-primary-6)'
          : 'var(--mantine-color-gray-3)',
      borderWidth: rem(1),
      borderStyle: 'solid',
      boxShadow: isFocused
        ? '0 0 0 2px rgba(32, 183, 223, 0.15)'
        : '0 1px 2px rgba(0, 0, 0, 0.02)',
      transition: 'border-color 120ms ease, box-shadow 120ms ease, background-color 120ms ease',
      '&:hover': {
        backgroundColor: '#ffffff',
        borderColor: hasError
          ? 'var(--mantine-color-error)'
          : isFocused
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
