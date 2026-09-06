'use client';

import { Group } from '@mantine/core';
import { ReactNode } from 'react';

export interface AppDrawerActionsProps {
  children?: ReactNode;
  className?: string;
}

export function AppDrawerActions({ children, className }: AppDrawerActionsProps) {
  if (!children) return null;

  return (
    <Group gap="xs" align="center" className={className} wrap="nowrap">
      {children}
    </Group>
  );
}
