/**
 * Builds unified styles for DatePickerInput.
 * Colors, borders, height and hover/focus states come from the theme and
 * `src/app/globals.css`, shared with AppInput and AppSelect.
 */
export function getUnifiedDatePickerStyles(isFocused: boolean, hasError: boolean, customStyles?: Record<string, any>) {
  return {
    root: {
      width: '100%',
      ...customStyles?.root,
    },
    label: {
      ...customStyles?.label,
    },
    description: {
      ...customStyles?.description,
    },
    input: {
      direction: 'rtl' as const,
      textAlign: 'right' as const,
      ...customStyles?.input,
    },
    error: {
      ...customStyles?.error,
    },
    section: {
      color: hasError
        ? 'var(--mantine-color-error)'
        : isFocused
          ? 'var(--app-brand-primary)'
          : 'var(--app-text-muted)',
      transition: 'color 140ms ease',
      ...customStyles?.section,
    },
    calendarHeader: {
      direction: 'rtl' as const,
      ...customStyles?.calendarHeader,
    },
    calendarHeaderLevel: {
      fontWeight: 500,
      color: 'var(--app-text-primary)',
      ...customStyles?.calendarHeaderLevel,
    },
    levelsGroup: {
      direction: 'rtl' as const,
      ...customStyles?.levelsGroup,
    },
    ...customStyles,
  };
}
