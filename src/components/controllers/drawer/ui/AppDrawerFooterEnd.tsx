'use client';

import { Group } from '@mantine/core';
import { ReactNode } from 'react';

export interface AppDrawerFooterEndProps {
  children?: ReactNode;
  className?: string;
}

export function AppDrawerFooterEnd({ children, className }: AppDrawerFooterEndProps) {
  if (!children) return null;

  return (
    <Group gap="sm" align="center" className={className} wrap="nowrap">
      {children}
    </Group>
  );
}
