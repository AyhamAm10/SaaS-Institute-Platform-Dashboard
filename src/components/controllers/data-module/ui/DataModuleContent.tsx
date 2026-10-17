'use client';

import { Paper, rem } from '@mantine/core';
import { ReactNode } from 'react';

export interface DataModuleContentProps {
  children?: ReactNode;
}

export function DataModuleContent({ children }: DataModuleContentProps) {
  return (
    <Paper
      radius="xl"
      withBorder
      style={{
        overflow: 'hidden',
        position: 'relative',
        borderRadius: rem(22),
        borderColor: 'var(--mantine-color-gray-2)',
        backgroundColor: 'var(--mantine-color-body)',
        boxShadow: '0 4px 24px -2px rgba(0, 0, 0, 0.035), 0 2px 8px -1px rgba(0, 0, 0, 0.02)',
      }}
    >
      {children}
    </Paper>
  );
}
