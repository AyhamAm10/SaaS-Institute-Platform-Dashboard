'use client';

import { Paper } from '@mantine/core';
import { ReactNode } from 'react';

export interface DataModuleContentProps {
  children?: ReactNode;
}

export function DataModuleContent({ children }: DataModuleContentProps) {
  return (
    <Paper
      radius="lg"
      withBorder
      style={{
        overflow: 'hidden',
        position: 'relative',
        borderColor: 'var(--mantine-color-gray-2)',
        backgroundColor: 'var(--mantine-color-body)',
      }}
    >
      {children}
    </Paper>
  );
}
