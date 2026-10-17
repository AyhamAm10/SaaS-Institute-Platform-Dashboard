import { MantineThemeComponents, rem } from '@mantine/core';

/**
 * Component default overrides for the compact, curved Arabic SaaS Admin Dashboard.
 */
export const defaultComponents: MantineThemeComponents = {
  AppShell: {
    defaultProps: {
      padding: 'lg',
    },
  },

  Button: {
    defaultProps: {
      radius: 'xl',
      size: 'md',
    },
    styles: {
      root: {
        borderRadius: rem(14),
        fontWeight: 600,
        fontSize: rem(13.5),
        transition: 'transform 150ms ease, box-shadow 150ms ease, background-color 150ms ease',
        '&:hover': {
          transform: 'translateY(-1px)',
        },
      },
    },
  },

  Paper: {
    defaultProps: {
      radius: 'xl',
      withBorder: true,
    },
    styles: {
      root: {
        borderRadius: rem(20),
        borderColor: 'var(--mantine-color-gray-2)',
        boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.03), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
      },
    },
  },

  Card: {
    defaultProps: {
      radius: 'xl',
      withBorder: true,
      padding: 'xl',
    },
    styles: {
      root: {
        borderRadius: rem(22),
        borderColor: 'var(--mantine-color-gray-2)',
        boxShadow: '0 4px 24px -2px rgba(0, 0, 0, 0.04), 0 2px 8px -1px rgba(0, 0, 0, 0.02)',
        transition: 'transform 150ms ease, box-shadow 150ms ease',
      },
    },
  },

  NavLink: {
    defaultProps: {
      radius: 'xl',
    },
    styles: {
      root: {
        borderRadius: rem(14),
        fontWeight: 600,
        fontSize: rem(13.5),
        paddingTop: rem(10),
        paddingBottom: rem(10),
        paddingLeft: rem(14),
        paddingRight: rem(14),
        marginBottom: rem(4),
        transition: 'all 150ms ease',
      },
      label: {
        fontWeight: 600,
      },
    },
  },

  Drawer: {
    defaultProps: {
      radius: 'xl',
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
      },
    },
  },

  Modal: {
    defaultProps: {
      radius: 'xl',
      shadow: 'xl',
      centered: true,
    },
    styles: {
      content: {
        borderRadius: rem(24),
        boxShadow: '0 24px 60px -12px rgba(0, 0, 0, 0.14)',
      },
    },
  },

  Table: {
    defaultProps: {
      highlightOnHover: true,
      verticalSpacing: 'md',
      horizontalSpacing: 'lg',
    },
  },

  Pagination: {
    defaultProps: {
      radius: 'xl',
    },
  },

  Menu: {
    defaultProps: {
      radius: 'lg',
      shadow: 'md',
    },
    styles: {
      dropdown: {
        borderRadius: rem(14),
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
        border: '1px solid var(--mantine-color-gray-2)',
      },
      item: {
        borderRadius: rem(10),
        fontSize: rem(13),
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
      radius: 'xl',
      size: 'sm',
      variant: 'light',
    },
    styles: {
      root: {
        fontWeight: 600,
        fontSize: rem(11.5),
        paddingLeft: rem(10),
        paddingRight: rem(10),
      },
    },
  },

  TextInput: {
    defaultProps: {
      radius: 'xl',
      size: 'md',
    },
    styles: {
      input: {
        borderRadius: rem(16),
        borderColor: 'var(--mantine-color-gray-2)',
        backgroundColor: 'var(--mantine-color-gray-0)',
        fontWeight: 500,
        fontSize: rem(14),
        height: rem(48),
        transition: 'all 150ms ease',
        '&:focus': {
          backgroundColor: '#ffffff',
          borderColor: 'var(--mantine-color-primary-4)',
          boxShadow: '0 0 0 4px rgba(32, 183, 223, 0.14)',
        },
      },
    },
  },

  PasswordInput: {
    defaultProps: {
      radius: 'xl',
      size: 'md',
    },
    styles: {
      input: {
        borderRadius: rem(16),
        borderColor: 'var(--mantine-color-gray-2)',
        backgroundColor: 'var(--mantine-color-gray-0)',
        fontWeight: 500,
        fontSize: rem(14),
        height: rem(48),
        transition: 'all 150ms ease',
        '&:focus': {
          backgroundColor: '#ffffff',
          borderColor: 'var(--mantine-color-primary-4)',
          boxShadow: '0 0 0 4px rgba(32, 183, 223, 0.14)',
        },
      },
    },
  },

  Select: {
    defaultProps: {
      radius: 'xl',
      size: 'md',
    },
    styles: {
      input: {
        borderRadius: rem(16),
        height: rem(48),
      },
    },
  },

  ThemeIcon: {
    defaultProps: {
      radius: 'lg',
    },
    styles: {
      root: {
        borderRadius: rem(12),
      },
    },
  },

  ActionIcon: {
    defaultProps: {
      radius: 'xl',
    },
    styles: {
      root: {
        borderRadius: rem(12),
        transition: 'all 150ms ease',
      },
    },
  },
};
