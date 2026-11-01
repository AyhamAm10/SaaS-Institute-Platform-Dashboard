'use client';

import { Flex, rem } from '@mantine/core';
import { ReactNode } from 'react';
import { AppSurface } from '../../surface';

export interface DataModuleFilterBarProps {
  children?: ReactNode;
}

/** Light frosted toolbar holding search and filters, sitting above the data card. */
export function DataModuleFilterBar({ children }: DataModuleFilterBarProps) {
  return (
    <AppSurface level={1} radius="lg" padding={rem(12)} style={{ marginBottom: rem(14) }}>
      <Flex gap="sm" align="center" justify="space-between" wrap="wrap" direction={{ base: 'column', sm: 'row' }}>
        {children}
      </Flex>
    </AppSurface>
  );
}
