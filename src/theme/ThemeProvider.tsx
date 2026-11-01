'use client';

import { MantineProvider } from '@mantine/core';
import { ReactNode } from 'react';
import { baseTheme, cssVariablesResolver } from './index';

/**
 * Client-side Mantine provider.
 * `cssVariablesResolver` is a function, so it cannot be passed from the
 * server-rendered root layout and is wired up here instead.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <MantineProvider
      theme={baseTheme}
      cssVariablesResolver={cssVariablesResolver}
      defaultColorScheme="light"
    >
      {children}
    </MantineProvider>
  );
}
