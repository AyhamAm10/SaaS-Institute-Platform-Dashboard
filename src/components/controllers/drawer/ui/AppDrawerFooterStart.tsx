'use client';

import { Group } from '@mantine/core';
import { ReactNode } from 'react';

export interface AppDrawerFooterStartProps {
  children?: ReactNode;
  className?: string;
}

export function AppDrawerFooterStart({ children, className }: AppDrawerFooterStartProps) {
  if (!children) return <div />;

  return (
    <Group gap="sm" align="center" className={className} wrap="nowrap">
      {children}
    </Group>
  );
}
