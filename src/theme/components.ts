import { MantineThemeComponents, rem } from '@mantine/core';

/**
 * Component default overrides for the compact, clean, classic Arabic SaaS Admin Dashboard.
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
        borderRadius: rem(8),
        fontWeight: 600,
        fontSize: rem(13),
        height: rem(38),
        transition: 'background-color 150ms ease, border-color 150ms ease',
      },
    },
  },

  Paper: {
    defaultProps: {
      radius: 'md',
      withBorder: true,
    },
    styles: {
      root: {
        borderRadius: rem(10),
        borderColor: 'var(--mantine-color-gray-2)',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
      },
    },
  },

  Card: {
    defaultProps: {
      radius: 'md',
      withBorder: true,
      padding: 'md',
    },
    styles: {
      root: {
        borderRadius: rem(10),
        borderColor: 'var(--mantine-color-gray-2)',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
      },
    },
  },

  NavLink: {
    defaultProps: {
      radius: 'md',
    },
    styles: {
      root: {
        borderRadius: rem(8),
        fontWeight: 500,
        fontSize: rem(13),
        paddingTop: rem(8),
        paddingBottom: rem(8),
        paddingLeft: rem(12),
        paddingRight: rem(12),
        marginBottom: rem(2),
        transition: 'all 120ms ease',
      },
      label: {
        fontWeight: 500,
      },
    },
  },

  Drawer: {
    defaultProps: {
      radius: 'md',
      shadow: 'lg',
      position: 'right',
    },
    styles: {
      inner: {
        direction: 'ltr',
        justifyContent: 'flex-end',
      },
      content: {
        direction: 'rtl',
      },
    },
  },

  Modal: {
    defaultProps: {
      radius: 'md',
      shadow: 'lg',
      centered: true,
    },
    styles: {
      content: {
        borderRadius: rem(12),
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.1)',
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
      shadow: 'sm',
    },
    styles: {
      dropdown: {
        borderRadius: rem(8),
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
        border: '1px solid var(--mantine-color-gray-2)',
      },
      item: {
        borderRadius: rem(6),
        fontSize: rem(12.5),
        fontWeight: 500,
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
      input: {
        borderRadius: rem(8),
        borderColor: 'var(--mantine-color-gray-3)',
        backgroundColor: '#ffffff',
        fontWeight: 400,
        fontSize: rem(13),
        height: rem(38),
        transition: 'all 120ms ease',
        '&:focus': {
          borderColor: 'var(--mantine-color-primary-6)',
          boxShadow: '0 0 0 2px rgba(32, 183, 223, 0.15)',
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
      input: {
        borderRadius: rem(8),
        borderColor: 'var(--mantine-color-gray-3)',
        backgroundColor: '#ffffff',
        fontWeight: 400,
        fontSize: rem(13),
        height: rem(38),
        transition: 'all 120ms ease',
        '&:focus': {
          borderColor: 'var(--mantine-color-primary-6)',
          boxShadow: '0 0 0 2px rgba(32, 183, 223, 0.15)',
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
      input: {
        borderRadius: rem(8),
        borderColor: 'var(--mantine-color-gray-3)',
        backgroundColor: '#ffffff',
        fontWeight: 400,
        fontSize: rem(13),
        height: rem(38),
        transition: 'all 120ms ease',
        '&:focus': {
          borderColor: 'var(--mantine-color-primary-6)',
          boxShadow: '0 0 0 2px rgba(32, 183, 223, 0.15)',
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
      input: {
        borderRadius: rem(8),
        borderColor: 'var(--mantine-color-gray-3)',
        backgroundColor: '#ffffff',
        height: rem(38),
        fontSize: rem(13),
      },
      dropdown: {
        borderRadius: rem(8),
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
        border: '1px solid var(--mantine-color-gray-2)',
      },
      option: {
        borderRadius: rem(6),
        fontSize: rem(13),
        fontWeight: 500,
        padding: `${rem(8)} ${rem(12)}`,
      },
    },
  },

  ThemeIcon: {
    defaultProps: {
      radius: 'md',
    },
    styles: {
      root: {
        borderRadius: rem(8),
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
        borderRadius: rem(6),
        transition: 'all 120ms ease',
      },
    },
  },
};
