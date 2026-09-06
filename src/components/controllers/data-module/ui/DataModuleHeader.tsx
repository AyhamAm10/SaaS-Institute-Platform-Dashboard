'use client';

import { Group } from '@mantine/core';
import { ReactNode } from 'react';

export interface DataModuleHeaderProps {
  children?: ReactNode;
}

export function DataModuleHeader({ children }: DataModuleHeaderProps) {
  return (
    <Group justify="space-between" align="center" mb="lg" wrap="wrap" gap="md">
      {children}
    </Group>
  );
}
