'use client';

import { Stack } from '@mantine/core';
import { ReactNode } from 'react';

export interface AppDrawerDetailsProps {
  children?: ReactNode;
  gap?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

export function AppDrawerDetails({
  children,
  gap = 'xs',
  className,
}: AppDrawerDetailsProps) {
  return (
    <Stack gap={gap} className={className}>
      {children}
    </Stack>
  );
}
