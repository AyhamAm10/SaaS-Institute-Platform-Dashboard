'use client';

import { Box, rem } from '@mantine/core';
import { ReactNode } from 'react';

export interface AppModuleContentProps {
  children?: ReactNode;
}

export function AppModuleContent({ children }: AppModuleContentProps) {
  if (!children) return null;

  return (
    <Box style={{ width: '100%', marginBottom: rem(18) }}>
      {children}
    </Box>
  );
}
