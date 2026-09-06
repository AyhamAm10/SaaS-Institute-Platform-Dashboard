'use client';

import { Group } from '@mantine/core';
import { ReactNode } from 'react';

export interface DataModuleActionsProps {
  children?: ReactNode;
}

export function DataModuleActions({ children }: DataModuleActionsProps) {
  return (
    <Group gap="xs" align="center" wrap="wrap">
      {children}
    </Group>
  );
}
