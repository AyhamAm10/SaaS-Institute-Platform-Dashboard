import { MantineThemeComponents, rem } from '@mantine/core';

/**
 * Component default overrides for the warm academic editorial SaaS Admin Dashboard.
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
        borderColor: '#e5d9cf',
        backgroundColor: '#fffaf5',
        boxShadow: '0 2px 8px rgba(73, 29, 43, 0.04)',
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
        borderColor: '#e5d9cf',
        backgroundColor: '#fffaf5',
        boxShadow: '0 4px 16px rgba(73, 29, 43, 0.05)',
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
        backgroundColor: '#fffaf5',
        borderLeft: '1px solid #e5d9cf',
      },
      header: {
        backgroundColor: '#fffaf5',
        borderBottom: '1px solid #e5d9cf',
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
        backgroundColor: '#fffaf5',
        border: '1px solid #e5d9cf',
        boxShadow: '0 16px 40px rgba(73, 29, 43, 0.12)',
      },
      header: {
        backgroundColor: '#fffaf5',
        borderBottom: '1px solid #e5d9cf',
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
        boxShadow: '0 8px 24px rgba(73, 29, 43, 0.08)',
        border: '1px solid #e5d9cf',
        backgroundColor: '#fffaf5',
      },
      item: {
        borderRadius: rem(8),
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
      input: {
        borderRadius: rem(10),
        borderColor: '#e5d9cf',
        backgroundColor: '#ffffff',
        fontWeight: 400,
        fontSize: rem(13),
        height: rem(38),
        transition: 'all 120ms ease',
        '&:focus': {
          borderColor: '#c4a66b',
          boxShadow: '0 0 0 3px rgba(196, 166, 107, 0.18)',
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
        borderRadius: rem(10),
        borderColor: '#e5d9cf',
        backgroundColor: '#ffffff',
        fontWeight: 400,
        fontSize: rem(13),
        height: rem(38),
        transition: 'all 120ms ease',
        '&:focus': {
          borderColor: '#c4a66b',
          boxShadow: '0 0 0 3px rgba(196, 166, 107, 0.18)',
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
        borderRadius: rem(10),
        borderColor: '#e5d9cf',
        backgroundColor: '#ffffff',
        fontWeight: 400,
        fontSize: rem(13),
        height: rem(38),
        transition: 'all 120ms ease',
        '&:focus': {
          borderColor: '#c4a66b',
          boxShadow: '0 0 0 3px rgba(196, 166, 107, 0.18)',
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
        borderRadius: rem(10),
        borderColor: '#e5d9cf',
        backgroundColor: '#ffffff',
        height: rem(38),
        fontSize: rem(13),
        '&:focus': {
          borderColor: '#c4a66b',
          boxShadow: '0 0 0 3px rgba(196, 166, 107, 0.18)',
        },
      },
      dropdown: {
        borderRadius: rem(12),
        boxShadow: '0 8px 24px rgba(73, 29, 43, 0.08)',
        border: '1px solid #e5d9cf',
        backgroundColor: '#fffaf5',
      },
      option: {
        borderRadius: rem(8),
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

