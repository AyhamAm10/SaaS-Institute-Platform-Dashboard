'use client';

import { Group } from '@mantine/core';
import { ReactNode } from 'react';

export interface DataModuleFilterSlotProps {
  children?: ReactNode;
}

export function DataModuleFilterSlot({ children }: DataModuleFilterSlotProps) {
  return (
    <Group gap="xs" align="center" wrap="wrap">
      {children}
    </Group>
  );
}
