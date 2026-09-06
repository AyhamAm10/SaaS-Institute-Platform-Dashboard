'use client';

import { Paper, Stack } from '@mantine/core';
import { ReactNode } from 'react';
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
    <Paper
      radius="md"
      withBorder={withBorder}
      p="md"
      className={className}
      style={{
        backgroundColor: '#ffffff',
        borderColor: 'var(--mantine-color-gray-2)',
      }}
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
    </Paper>
  );
}
