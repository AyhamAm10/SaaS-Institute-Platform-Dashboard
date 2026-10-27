'use client';

import { Box } from '@mantine/core';
import { ReactNode } from 'react';

export interface AppDrawerToolbarProps {
  children?: ReactNode;
  className?: string;
}

export function AppDrawerToolbar({ children, className }: AppDrawerToolbarProps) {
  if (!children) return null;

  return (
    <Box
      px="lg"
      py="xs"
      className={className}
      style={{
        borderBottom: '1px solid var(--app-border)',
        backgroundColor: 'var(--app-subtle)',
        flexShrink: 0,
      }}
    >
      {children}
    </Box>
  );
}
