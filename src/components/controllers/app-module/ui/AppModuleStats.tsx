'use client';

import { SimpleGrid, rem } from '@mantine/core';
import { ReactNode } from 'react';

export interface AppModuleStatsProps {
  children?: ReactNode;
  cols?: { base?: number; sm?: number; md?: number; lg?: number };
}

export function AppModuleStats({
  children,
  cols = { base: 1, sm: 2, lg: 4 },
}: AppModuleStatsProps) {
  if (!children) return null;

  return (
    <SimpleGrid cols={cols} spacing="md" mb={rem(18)}>
      {children}
    </SimpleGrid>
  );
}
