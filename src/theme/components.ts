import { MantineThemeComponents, rem } from '@mantine/core';

/**
 * Component default overrides for the warm academic editorial SaaS Admin Dashboard.
 * Relies on centralized CSS variables (--app-*) to seamlessly support Light & Dark modes.
 */
export const defaultComponents: MantineThemeComponents = {
  AppShell: {
    defaultProps: {
      padding: 0,
    },
  },

  Button: {
    defaultProps: {
      radius: 'md',
      size: 'sm',
    },
    styles: {
      root: {
        borderRadius: rem(10),
        fontWeight: 500,
        fontSize: rem(13),
        height: rem(38),
        transition: 'all 150ms ease',
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
        borderRadius: rem(14),
        borderColor: 'var(--app-border)',
        backgroundColor: 'var(--app-surface)',
        color: 'var(--app-text-primary)',
        boxShadow: 'var(--app-card-shadow)',
        transition: 'background-color 200ms ease, border-color 200ms ease, color 200ms ease',
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
        borderRadius: rem(16),
        borderColor: 'var(--app-border)',
        backgroundColor: 'var(--app-surface)',
        color: 'var(--app-text-primary)',
        boxShadow: 'var(--app-card-shadow)',
        transition: 'background-color 200ms ease, border-color 200ms ease, color 200ms ease',
      },
    },
  },

  NavLink: {
    defaultProps: {
      radius: 'md',
    },
    styles: {
      root: {
        borderRadius: rem(10),
        fontWeight: 500,
        fontSize: rem(13),
        paddingTop: rem(9),
        paddingBottom: rem(9),
        paddingLeft: rem(12),
        paddingRight: rem(12),
        marginBottom: rem(3),
        transition: 'all 140ms ease',
      },
      label: {
        fontWeight: 500,
      },
    },
  },

  Drawer: {
    defaultProps: {
      radius: 'lg',
      shadow: 'xl',
      position: 'right',
    },
    styles: {
      inner: {
        direction: 'ltr',
        justifyContent: 'flex-end',
      },
      content: {
        direction: 'rtl',
        backgroundColor: 'var(--app-surface)',
        borderLeft: '1px solid var(--app-border)',
        color: 'var(--app-text-primary)',
      },
      header: {
        backgroundColor: 'var(--app-surface)',
        borderBottom: '1px solid var(--app-border)',
        color: 'var(--app-text-primary)',
      },
      body: {
        color: 'var(--app-text-primary)',
      },
    },
  },

  Modal: {
    defaultProps: {
      radius: 'lg',
      shadow: 'xl',
      centered: true,
    },
    styles: {
      content: {
        borderRadius: rem(16),
        backgroundColor: 'var(--app-surface)',
        border: '1px solid var(--app-border)',
        color: 'var(--app-text-primary)',
        boxShadow: 'var(--app-dropdown-shadow)',
      },
      header: {
        backgroundColor: 'var(--app-surface)',
        borderBottom: '1px solid var(--app-border)',
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
      radius: 'md',
      size: 'sm',
    },
  },

  Menu: {
    defaultProps: {
      radius: 'md',
      shadow: 'md',
    },
    styles: {
      dropdown: {
        borderRadius: rem(12),
        boxShadow: 'var(--app-dropdown-shadow)',
        border: '1px solid var(--app-border)',
        backgroundColor: 'var(--app-surface)',
      },
      item: {
        borderRadius: rem(8),
        fontSize: rem(12.5),
        fontWeight: 500,
        color: 'var(--app-text-primary)',
        '&:hover': {
          backgroundColor: 'var(--app-hover)',
        },
      },
      label: {
        color: 'var(--app-text-muted)',
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
      radius: 'sm',
      size: 'sm',
      variant: 'light',
    },
    styles: {
      root: {
        fontWeight: 600,
        fontSize: rem(11),
        borderRadius: rem(8),
        paddingLeft: rem(8),
        paddingRight: rem(8),
      },
    },
  },

  TextInput: {
    defaultProps: {
      radius: 'md',
      size: 'sm',
    },
    styles: {
      label: {
        color: 'var(--app-text-primary)',
        fontWeight: 600,
        fontSize: rem(12.5),
        marginBottom: rem(4),
      },
      input: {
        borderRadius: rem(10),
        borderColor: 'var(--app-input-border)',
        backgroundColor: 'var(--app-input-bg)',
        color: 'var(--app-text-primary)',
        fontWeight: 400,
        fontSize: rem(13),
        height: rem(38),
        transition: 'all 140ms ease',
        '&:focus': {
          backgroundColor: 'var(--app-input-bg-focus)',
          borderColor: 'var(--app-input-focus-border)',
          boxShadow: 'var(--app-input-focus-ring)',
        },
        '&::placeholder': {
          color: 'var(--app-input-placeholder)',
        },
      },
    },
  },

  PasswordInput: {
    defaultProps: {
      radius: 'md',
      size: 'sm',
    },
    styles: {
      label: {
        color: 'var(--app-text-primary)',
        fontWeight: 600,
        fontSize: rem(12.5),
        marginBottom: rem(4),
      },
      input: {
        borderRadius: rem(10),
        borderColor: 'var(--app-input-border)',
        backgroundColor: 'var(--app-input-bg)',
        color: 'var(--app-text-primary)',
        fontWeight: 400,
        fontSize: rem(13),
        height: rem(38),
        transition: 'all 140ms ease',
        '&:focus': {
          backgroundColor: 'var(--app-input-bg-focus)',
          borderColor: 'var(--app-input-focus-border)',
          boxShadow: 'var(--app-input-focus-ring)',
        },
        '&::placeholder': {
          color: 'var(--app-input-placeholder)',
        },
      },
    },
  },

  NumberInput: {
    defaultProps: {
      radius: 'md',
      size: 'sm',
      hideControls: true,
    },
    styles: {
      label: {
        color: 'var(--app-text-primary)',
        fontWeight: 600,
        fontSize: rem(12.5),
        marginBottom: rem(4),
      },
      input: {
        borderRadius: rem(10),
        borderColor: 'var(--app-input-border)',
        backgroundColor: 'var(--app-input-bg)',
        color: 'var(--app-text-primary)',
        fontWeight: 400,
        fontSize: rem(13),
        height: rem(38),
        transition: 'all 140ms ease',
        '&:focus': {
          backgroundColor: 'var(--app-input-bg-focus)',
          borderColor: 'var(--app-input-focus-border)',
          boxShadow: 'var(--app-input-focus-ring)',
        },
        '&::placeholder': {
          color: 'var(--app-input-placeholder)',
        },
      },
    },
  },

  Select: {
    defaultProps: {
      radius: 'md',
      size: 'sm',
      checkIconPosition: 'right',
    },
    styles: {
      label: {
        color: 'var(--app-text-primary)',
        fontWeight: 600,
        fontSize: rem(12.5),
        marginBottom: rem(4),
      },
      input: {
        borderRadius: rem(10),
        borderColor: 'var(--app-input-border)',
        backgroundColor: 'var(--app-input-bg)',
        color: 'var(--app-text-primary)',
        height: rem(38),
        fontSize: rem(13),
        transition: 'all 140ms ease',
        '&:focus': {
          backgroundColor: 'var(--app-input-bg-focus)',
          borderColor: 'var(--app-input-focus-border)',
          boxShadow: 'var(--app-input-focus-ring)',
        },
        '&::placeholder': {
          color: 'var(--app-input-placeholder)',
        },
      },
      dropdown: {
        borderRadius: rem(12),
        boxShadow: 'var(--app-dropdown-shadow)',
        border: '1px solid var(--app-border)',
        backgroundColor: 'var(--app-surface)',
      },
      option: {
        borderRadius: rem(8),
        fontSize: rem(13),
        fontWeight: 500,
        color: 'var(--app-text-primary)',
        padding: `${rem(8)} ${rem(12)}`,
        '&:hover': {
          backgroundColor: 'var(--app-hover)',
        },
      },
    },
  },

  ThemeIcon: {
    defaultProps: {
      radius: 'md',
    },
    styles: {
      root: {
        borderRadius: rem(10),
      },
    },
  },

  ActionIcon: {
    defaultProps: {
      radius: 'md',
      size: 'sm',
    },
    styles: {
      root: {
        borderRadius: rem(8),
        transition: 'all 120ms ease',
      },
    },
  },
};
