'use client';

import { Box, rem } from '@mantine/core';
import { ReactNode } from 'react';

export interface AppModuleTableProps {
  children?: ReactNode;
}

export function AppModuleTable({ children }: AppModuleTableProps) {
  if (!children) return null;

  return (
    <Box style={{ width: '100%', marginBottom: rem(18) }}>
      {children}
    </Box>
  );
}
