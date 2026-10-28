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
    <Group justify="space-between" align="center" mb={rem(14)} wrap="wrap" gap="xs">
      <Stack gap={2}>
        {title && (
          <Title order={4} fw={700} style={{ fontSize: rem(15), color: 'var(--app-text-primary)' }}>
            {title}
          </Title>
        )}
        {subtitle && (
          <Text size="xs" c="dimmed" style={{ fontSize: rem(12) }}>
            {subtitle}
          </Text>
        )}
      </Stack>
      {actions && <Group gap="xs">{actions}</Group>}
    </Group>
  );
}
