'use client';

import { Paper, rem } from '@mantine/core';
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
        borderRadius: rem(14),
        borderColor: 'var(--app-border)',
        backgroundColor: 'var(--app-surface)',
        boxShadow: 'var(--app-card-shadow)',
        transition: 'background-color 200ms ease, border-color 200ms ease',
      }}
    >
      {children}
    </Paper>
  );
}
