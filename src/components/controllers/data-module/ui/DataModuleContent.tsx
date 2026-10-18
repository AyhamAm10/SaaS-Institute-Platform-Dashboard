'use client';

import { Paper, rem } from '@mantine/core';
import { ReactNode } from 'react';

export interface DataModuleContentProps {
  children?: ReactNode;
}

export function DataModuleContent({ children }: DataModuleContentProps) {
  return (
    <Paper
      radius="md"
      withBorder
      style={{
        overflow: 'hidden',
        position: 'relative',
        borderRadius: rem(8),
        borderColor: 'var(--mantine-color-gray-2)',
        backgroundColor: 'var(--mantine-color-body)',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
      }}
    >
      {children}
    </Paper>
  );
}
