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
        <Text fw={500} size="sm" c="var(--app-text-primary)">
          {title}
        </Text>
        {description && (
          <Text size="xs" fw={300} c="var(--app-text-muted)">
            {description}
          </Text>
        )}
      </Stack>
      {action && <Group gap="xs">{action}</Group>}
    </Group>
  );
}
