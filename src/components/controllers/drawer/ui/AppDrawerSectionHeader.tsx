'use client';

import { Group, Stack, Text } from '@mantine/core';
import { ReactNode } from 'react';

export interface AppDrawerSectionHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function AppDrawerSectionHeader({
  title,
  description,
  action,
  className,
}: AppDrawerSectionHeaderProps) {
  return (
    <Group justify="space-between" align="flex-start" className={className} wrap="nowrap">
      <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
        <Text fw={700} size="sm" c="var(--mantine-color-text)">
          {title}
        </Text>
        {description && (
          <Text size="xs" c="dimmed">
            {description}
          </Text>
        )}
      </Stack>
      {action && <Group gap="xs">{action}</Group>}
    </Group>
  );
}
