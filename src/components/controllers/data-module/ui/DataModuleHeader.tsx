'use client';

import { Group, rem } from '@mantine/core';
import { ReactNode } from 'react';

export interface DataModuleHeaderProps {
  children?: ReactNode;
}

export function DataModuleHeader({ children }: DataModuleHeaderProps) {
  return (
    <Group justify="space-between" align="flex-end" mb={rem(22)} px={rem(4)} wrap="wrap" gap="md">
      {children}
    </Group>
  );
}
