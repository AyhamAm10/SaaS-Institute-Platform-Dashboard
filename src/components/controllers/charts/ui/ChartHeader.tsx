'use client';

import { Group, Stack, Text, Title, rem } from '@mantine/core';
import { ReactNode } from 'react';

export interface ChartHeaderProps {
  title?: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
}

export function ChartHeader({ title, subtitle, actions }: ChartHeaderProps) {
  if (!title && !actions) return null;

  return (
    <Group justify="space-between" align="flex-start" mb={rem(18)} wrap="wrap" gap="sm">
      <Stack gap={4}>
        {title && (
          <Title order={2} fw={500} style={{ fontSize: rem(17), color: 'var(--app-text-primary)' }}>
            {title}
          </Title>
        )}
        {subtitle && (
          <Text fw={300} style={{ fontSize: rem(12.5), color: 'var(--app-text-muted)' }}>
            {subtitle}
          </Text>
        )}
      </Stack>
      {actions && <Group gap="xs">{actions}</Group>}
    </Group>
  );
}
