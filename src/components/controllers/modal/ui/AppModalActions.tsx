'use client';

import { Group } from '@mantine/core';
import { ReactNode } from 'react';

export interface AppModalActionsProps {
  children?: ReactNode;
  className?: string;
}

export function AppModalActions({ children, className }: AppModalActionsProps) {
  if (!children) return null;

  return (
    <Group gap="xs" align="center" className={className} wrap="nowrap">
      {children}
    </Group>
  );
}
