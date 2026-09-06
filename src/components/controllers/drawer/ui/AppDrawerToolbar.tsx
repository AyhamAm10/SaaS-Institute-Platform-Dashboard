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
        borderBottom: '1px solid var(--mantine-color-gray-2)',
        backgroundColor: 'var(--mantine-color-gray-0)',
        flexShrink: 0,
      }}
    >
      {children}
    </Box>
  );
}
