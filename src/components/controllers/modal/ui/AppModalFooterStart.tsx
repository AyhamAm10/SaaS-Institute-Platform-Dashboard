'use client';

import { Group } from '@mantine/core';
import { ReactNode } from 'react';

export interface AppModalFooterStartProps {
  children?: ReactNode;
  className?: string;
}

export function AppModalFooterStart({ children, className }: AppModalFooterStartProps) {
  if (!children) return null;

  return (
    // marginInlineEnd: auto pushes the end-side actions away, keeping this group on the start side.
    <Group gap="sm" align="center" className={className} wrap="nowrap" style={{ marginInlineEnd: 'auto' }}>
      {children}
    </Group>
  );
}
