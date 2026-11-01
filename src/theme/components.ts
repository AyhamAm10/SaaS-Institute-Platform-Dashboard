import { MantineThemeComponents, rem } from '@mantine/core';

/**
 * Component default overrides.
 * Base looks only — interactive states (hover / focus / active) live in globals.css,
 * because Mantine `styles` objects are inline styles and cannot target pseudo-classes.
 * All values reference the `--app-*` variables emitted by the CSS variables resolver.
 */

const inputStyles = {
  label: {
    color: 'var(--app-text-primary)',
    fontWeight: 500,
    fontSize: rem(13),
    marginBottom: rem(6),
  },
  description: {
    color: 'var(--app-text-muted)',
    fontWeight: 300,
  },
  input: {
    borderRadius: 'var(--app-radius-md)',
    borderColor: 'var(--app-input-border)',
    backgroundColor: 'var(--app-input-bg)',
    color: 'var(--app-text-primary)',
    fontWeight: 400,
    fontSize: rem(13.5),
    minHeight: rem(42),
  },
};

const floatingDropdown = {
  borderRadius: 'var(--app-radius-md)',
  boxShadow: 'var(--app-dropdown-shadow)',
  border: '1px solid var(--app-glass-border)',
  backgroundColor: 'var(--app-glass-bg-strong)',
  backdropFilter: 'var(--app-glass-blur)',
  WebkitBackdropFilter: 'var(--app-glass-blur)',
  padding: rem(6),
};

export const defaultComponents: MantineThemeComponents = {
  AppShell: {
    defaultProps: {
      padding: 0,
    },
  },

  Button: {
    defaultProps: {
      radius: 'xl',
      size: 'sm',
    },
    styles: {
      root: {
        borderRadius: 'var(--app-radius-pill)',
        fontWeight: 500,
        fontSize: rem(13.5),
        height: rem(40),
        paddingInline: rem(20),
      },
    },
  },

  Paper: {
    defaultProps: {
      radius: 'lg',
      withBorder: true,
    },
    styles: {
      root: {
        borderRadius: 'var(--app-radius-lg)',
        borderColor: 'var(--app-glass-border)',
        backgroundColor: 'var(--app-glass-bg)',
        backdropFilter: 'var(--app-glass-blur)',
        WebkitBackdropFilter: 'var(--app-glass-blur)',
        color: 'var(--app-text-primary)',
        boxShadow: 'var(--app-card-shadow)',
      },
    },
  },

  Card: {
    defaultProps: {
      radius: 'lg',
      withBorder: true,
      padding: 'lg',
    },
    styles: {
      root: {
        borderRadius: 'var(--app-radius-lg)',
        borderColor: 'var(--app-glass-border)',
        backgroundColor: 'var(--app-glass-bg)',
        backdropFilter: 'var(--app-glass-blur)',
        WebkitBackdropFilter: 'var(--app-glass-blur)',
        color: 'var(--app-text-primary)',
        boxShadow: 'var(--app-card-shadow)',
      },
    },
  },

  NavLink: {
    defaultProps: {
      radius: 'md',
    },
    styles: {
      root: {
        borderRadius: 'var(--app-radius-md)',
        fontWeight: 400,
        fontSize: rem(13.5),
        paddingBlock: rem(10),
        paddingInline: rem(12),
        marginBottom: rem(2),
      },
      label: {
        fontWeight: 400,
      },
    },
  },

  Drawer: {
    defaultProps: {
      radius: 'xl',
      shadow: 'xl',
      position: 'right',
      offset: 12,
      overlayProps: { backgroundOpacity: 0.18, blur: 3 },
    },
    styles: {
      inner: {
        direction: 'ltr',
        justifyContent: 'flex-end',
      },
      content: {
        direction: 'rtl',
        backgroundColor: 'var(--app-glass-bg-strong)',
        backdropFilter: 'var(--app-glass-blur)',
        WebkitBackdropFilter: 'var(--app-glass-blur)',
        border: '1px solid var(--app-glass-border)',
        boxShadow: 'var(--app-glass-highlight), var(--app-elev-3)',
        color: 'var(--app-text-primary)',
      },
      header: {
        backgroundColor: 'transparent',
        color: 'var(--app-text-primary)',
      },
      body: {
        color: 'var(--app-text-primary)',
      },
    },
  },

  Modal: {
    defaultProps: {
      radius: 'xl',
      shadow: 'xl',
      centered: true,
      overlayProps: { backgroundOpacity: 0.18, blur: 3 },
    },
    styles: {
      content: {
        borderRadius: 'var(--app-radius-xl)',
        backgroundColor: 'var(--app-glass-bg-strong)',
        backdropFilter: 'var(--app-glass-blur)',
        WebkitBackdropFilter: 'var(--app-glass-blur)',
        border: '1px solid var(--app-glass-border)',
        color: 'var(--app-text-primary)',
        boxShadow: 'var(--app-glass-highlight), var(--app-elev-3)',
      },
      header: {
        backgroundColor: 'transparent',
        color: 'var(--app-text-primary)',
      },
      body: {
        color: 'var(--app-text-primary)',
      },
    },
  },

  Table: {
    defaultProps: {
      highlightOnHover: true,
      verticalSpacing: 'sm',
      horizontalSpacing: 'md',
    },
  },

  Pagination: {
    defaultProps: {
      radius: 'xl',
      size: 'sm',
    },
  },

  Menu: {
    defaultProps: {
      radius: 'md',
      shadow: 'md',
    },
    styles: {
      dropdown: floatingDropdown,
      item: {
        borderRadius: 'var(--app-radius-sm)',
        fontSize: rem(13),
        fontWeight: 400,
        color: 'var(--app-text-primary)',
      },
      label: {
        color: 'var(--app-text-muted)',
        fontWeight: 400,
      },
    },
  },

  Popover: {
    styles: {
      dropdown: floatingDropdown,
    },
  },

  Tooltip: {
    defaultProps: {
      radius: 'xl',
      withArrow: false,
      color: 'primary',
    },
    styles: {
      tooltip: {
        fontSize: rem(12),
        fontWeight: 400,
        paddingInline: rem(12),
        paddingBlock: rem(6),
        boxShadow: 'var(--app-elev-1)',
      },
    },
  },

  ScrollArea: {
    defaultProps: {
      scrollbarSize: 6,
      type: 'hover',
    },
  },

  Badge: {
    defaultProps: {
      radius: 'xl',
      size: 'sm',
      variant: 'light',
    },
    styles: {
      root: {
        fontWeight: 500,
        fontSize: rem(11.5),
        textTransform: 'none',
        letterSpacing: 0,
        paddingInline: rem(10),
        height: rem(24),
      },
    },
  },

  // Recessed track with a raised, glossy indicator that slides between options (3D switch).
  SegmentedControl: {
    defaultProps: {
      radius: 'xl',
      transitionDuration: 320,
      transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
    },
    styles: {
      root: {
        backgroundColor: 'var(--app-tabs-track)',
        boxShadow: 'var(--app-tabs-track-shadow)',
        border: '1px solid var(--app-border-subtle)',
        padding: rem(4),
      },
      indicator: {
        backgroundColor: 'var(--app-tabs-indicator)',
        boxShadow: 'var(--app-tabs-indicator-shadow)',
      },
      label: {
        fontWeight: 400,
        fontSize: rem(13),
        paddingBlock: rem(7),
        paddingInline: rem(14),
      },
    },
  },

  Tabs: {
    defaultProps: {
      variant: 'pills',
      radius: 'xl',
    },
    styles: {
      tab: {
        fontWeight: 400,
        fontSize: rem(13),
      },
    },
  },

  TextInput: { defaultProps: { radius: 'md', size: 'sm' }, styles: inputStyles },
  PasswordInput: { defaultProps: { radius: 'md', size: 'sm' }, styles: inputStyles },
  Textarea: { defaultProps: { radius: 'md', size: 'sm' }, styles: inputStyles },
  NumberInput: { defaultProps: { radius: 'md', size: 'sm', hideControls: true }, styles: inputStyles },
  MultiSelect: { defaultProps: { radius: 'md', size: 'sm' }, styles: { ...inputStyles, dropdown: floatingDropdown } },

  Select: {
    defaultProps: {
      radius: 'md',
      size: 'sm',
      checkIconPosition: 'right',
    },
    styles: {
      ...inputStyles,
      dropdown: floatingDropdown,
      option: {
        borderRadius: 'var(--app-radius-sm)',
        fontSize: rem(13),
        fontWeight: 400,
        color: 'var(--app-text-primary)',
        padding: `${rem(8)} ${rem(12)}`,
      },
    },
  },

  ThemeIcon: {
    defaultProps: {
      radius: 'md',
    },
  },

  ActionIcon: {
    defaultProps: {
      radius: 'xl',
      size: 'md',
    },
  },

  Checkbox: {
    defaultProps: {
      radius: 'sm',
      color: 'primary',
    },
  },

  Switch: {
    defaultProps: {
      color: 'brand',
    },
  },

  Progress: {
    defaultProps: {
      radius: 'xl',
      color: 'brand',
    },
  },
};
