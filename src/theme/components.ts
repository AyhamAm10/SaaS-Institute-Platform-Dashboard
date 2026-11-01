import { MantineThemeComponents } from '@mantine/core';

/**
 * Component default overrides for the Admin Dashboard.
 *
 * Only default props live here. Colors, borders and interaction states
 * (hover, focus, placeholder) are styled in `src/app/globals.css` via
 * Mantine's CSS variables, because `styles` objects are inline styles and
 * cannot express pseudo-classes.
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
  },

  Paper: {
    defaultProps: {
      radius: 'lg',
      withBorder: true,
    },
  },

  Card: {
    defaultProps: {
      radius: 'lg',
      withBorder: true,
      padding: 'lg',
    },
  },

  NavLink: {
    defaultProps: {
      radius: 'md',
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

  Modal: {
    defaultProps: {
      radius: 'lg',
      shadow: 'xl',
      centered: true,
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
  },

  Input: {
    defaultProps: {
      radius: 'md',
      size: 'sm',
    },
  },

  NumberInput: {
    defaultProps: {
      hideControls: true,
    },
  },

  Select: {
    defaultProps: {
      checkIconPosition: 'right',
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
      size: 'sm',
    },
  },
};
