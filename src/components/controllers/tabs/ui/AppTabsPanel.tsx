'use client';

import type { ReactNode } from 'react';
import { Box, Transition } from '@mantine/core';
import { useTabsMirror } from '../store/useTabsMirror';

export interface AppTabsPanelProps {
  value: string;
  children: ReactNode;
  keepMounted?: boolean;
}

/** Renders its children while active, or keeps mounted if keepMounted is true. */
export function AppTabsPanel({ value, children, keepMounted = false }: AppTabsPanelProps) {
  const active = useTabsMirror('active');
  const visited = useTabsMirror('visited');
  const isCurrent = active === value;
  const wasVisited = visited ? visited.includes(value) : isCurrent;

  if (keepMounted && !wasVisited && !isCurrent) {
    return null;
  }

  return (
    <Transition mounted={isCurrent} transition="fade-up" duration={220} keepMounted={keepMounted}>
      {(styles) => <Box style={styles}>{children}</Box>}
    </Transition>
  );
}
