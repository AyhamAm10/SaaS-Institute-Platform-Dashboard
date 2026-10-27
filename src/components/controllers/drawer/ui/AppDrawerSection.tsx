'use client';

import { Paper, Stack, rem } from '@mantine/core';
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
      radius="xl"
      withBorder={withBorder}
      p="lg"
      className={className}
      style={{
        backgroundColor: 'var(--app-surface)',
        borderColor: 'var(--app-border)',
        borderRadius: rem(16),
        boxShadow: 'var(--app-card-shadow)',
        transition: 'background-color 200ms ease, border-color 200ms ease',
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
