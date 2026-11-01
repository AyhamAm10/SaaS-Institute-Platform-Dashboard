'use client';

import { ReactNode } from 'react';
import { MantineProvider } from '@mantine/core';
import { baseTheme } from './index';
import { appCssVariablesResolver } from './css-variables';

/**
 * Client boundary for Mantine: the CSS variables resolver is a function,
 * which cannot be passed from the (server) root layout directly.
 */
export function AppThemeProvider({ children }: { children: ReactNode }) {
  return (
    <MantineProvider theme={baseTheme} defaultColorScheme="light" cssVariablesResolver={appCssVariablesResolver}>
      {children}
    </MantineProvider>
  );
}
