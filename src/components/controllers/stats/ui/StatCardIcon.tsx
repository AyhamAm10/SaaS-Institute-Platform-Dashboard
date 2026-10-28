'use client';

import { Box, rem } from '@mantine/core';
import { ReactNode } from 'react';

export interface StatCardIconProps {
  children?: ReactNode;
  color?: string;
  bg?: string;
}

export function StatCardIcon({
  children,
  color = 'var(--app-brand-primary)',
  bg = 'var(--app-subtle)',
}: StatCardIconProps) {
  if (!children) return null;

  return (
    <Box
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: rem(32),
        height: rem(32),
        borderRadius: rem(8),
        border: '1px solid var(--app-border)',
        backgroundColor: bg,
        color: color,
        flexShrink: 0,
      }}
    >
      {children}
    </Box>
  );
}
