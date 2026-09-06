'use client';

import { Group } from '@mantine/core';
import { ReactNode } from 'react';

export interface AppModalFooterEndProps {
  children?: ReactNode;
  className?: string;
}

export function AppModalFooterEnd({ children, className }: AppModalFooterEndProps) {
  if (!children) return null;

  return (
    <Group gap="sm" align="center" className={className} wrap="nowrap">
      {children}
    </Group>
  );
}
