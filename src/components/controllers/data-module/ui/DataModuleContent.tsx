'use client';

import { Box, rem } from '@mantine/core';
import { ReactNode } from 'react';

export interface DataModuleContentProps {
  children?: ReactNode;
}

export function DataModuleContent({ children }: DataModuleContentProps) {
  return (
    <Box
      style={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        transition: 'background-color 200ms ease',
      }}
    >
      {children}
    </Box>
  );
}
