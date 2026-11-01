'use client';

import { rem } from '@mantine/core';
import { ReactNode } from 'react';
import { AppSurface } from '../../surface';

export interface DataModuleContentProps {
  children?: ReactNode;
}

/** Glass card that holds the table (or empty / loading states). */
export function DataModuleContent({ children }: DataModuleContentProps) {
  return (
    <AppSurface level={2} radius="xl" padding={`${rem(6)} ${rem(14)}`} style={{ width: '100%', overflow: 'hidden' }}>
      {children}
    </AppSurface>
  );
}
