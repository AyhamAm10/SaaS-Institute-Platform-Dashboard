import { MantineThemeComponents, rem } from '@mantine/core';

/**
 * Component default overrides for the compact, curved Arabic SaaS Admin Dashboard.
 */
export const defaultComponents: MantineThemeComponents = {
  AppShell: {
    defaultProps: {
      padding: 'md',
    },
  },

  Button: {
    defaultProps: {
      radius: 'md',
      size: 'md',
    },
    styles: {
      root: {
        borderRadius: rem(12),
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
      radius: 'lg',
      withBorder: true,
    },
    styles: {
      root: {
        borderColor: 'var(--mantine-color-gray-2)',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
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
        borderColor: 'var(--mantine-color-gray-2)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
        transition: 'transform 150ms ease, box-shadow 150ms ease',
      },
    },
  },

  NavLink: {
    defaultProps: {
      radius: 'lg',
    },
    styles: {
      root: {
        fontWeight: 600,
        fontSize: rem(13),
        paddingTop: rem(8),
        paddingBottom: rem(8),
        marginBottom: rem(3),
        transition: 'all 150ms ease',
      },
      label: {
        fontWeight: 600,
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
        fontSize: rem(11),
      },
    },
  },

  TextInput: {
    defaultProps: {
      radius: 'md',
      size: 'md',
    },
    styles: {
      input: {
        borderRadius: rem(14),
        borderColor: 'var(--mantine-color-gray-2)',
        backgroundColor: 'var(--mantine-color-gray-0)',
        fontWeight: 500,
        fontSize: rem(14),
        transition: 'all 150ms ease',
        '&:focus': {
          backgroundColor: '#ffffff',
          borderColor: 'var(--mantine-color-primary-4)',
          boxShadow: '0 0 0 3.5px rgba(32, 183, 223, 0.16)',
        },
      },
    },
  },

  PasswordInput: {
    defaultProps: {
      radius: 'md',
      size: 'md',
    },
    styles: {
      input: {
        borderRadius: rem(14),
        borderColor: 'var(--mantine-color-gray-2)',
        backgroundColor: 'var(--mantine-color-gray-0)',
        fontWeight: 500,
        fontSize: rem(14),
        transition: 'all 150ms ease',
        '&:focus': {
          backgroundColor: '#ffffff',
          borderColor: 'var(--mantine-color-primary-4)',
          boxShadow: '0 0 0 3.5px rgba(32, 183, 223, 0.16)',
        },
      },
    },
  },

  Select: {
    defaultProps: {
      radius: 'md',
      size: 'md',
    },
    styles: {
      input: {
        borderRadius: rem(14),
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
      radius: 'md',
    },
  },
};
