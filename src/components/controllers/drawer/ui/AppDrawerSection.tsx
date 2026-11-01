'use client';

import { Stack } from '@mantine/core';
import { ReactNode } from 'react';
import { AppSurface } from '../../surface';
import { AppDrawerSectionHeader } from './AppDrawerSectionHeader';

export interface AppDrawerSectionProps {
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  children?: ReactNode;
  withBorder?: boolean;
  className?: string;
}

export function AppDrawerSection({
  title,
  description,
  action,
  children,
  withBorder = true,
  className,
}: AppDrawerSectionProps) {
  return (
    <AppSurface
      level={1}
      tone={withBorder ? 'glass' : 'subtle'}
      radius="lg"
      padding="lg"
      className={className}
    >
      <Stack gap="md">
        {(title || description || action) && (
          <AppDrawerSectionHeader
            title={title}
            description={description}
            action={action}
          />
        )}
        {children}
      </Stack>
    </AppSurface>
  );
}
