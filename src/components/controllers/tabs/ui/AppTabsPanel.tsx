'use client';

import type { ReactNode } from 'react';
import { Box, Transition } from '@mantine/core';
import { useTabsMirror } from '../store/useTabsMirror';

export interface AppTabsPanelProps {
  value: string;
  children: ReactNode;
}

/** Renders its children only while its tab is active, with a soft fade. */
export function AppTabsPanel({ value, children }: AppTabsPanelProps) {
  const active = useTabsMirror('active');

  return (
    <Transition mounted={active === value} transition="fade-up" duration={220} keepMounted={false}>
      {(styles) => <Box style={styles}>{children}</Box>}
    </Transition>
  );
}
