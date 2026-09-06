'use client';

import { Group } from '@mantine/core';
import { ReactNode } from 'react';

export interface AppModalFooterStartProps {
  children?: ReactNode;
  className?: string;
}

export function AppModalFooterStart({ children, className }: AppModalFooterStartProps) {
  if (!children) return <div />;

  return (
    <Group gap="sm" align="center" className={className} wrap="nowrap">
      {children}
    </Group>
  );
}
