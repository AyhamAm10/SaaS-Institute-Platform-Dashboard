'use client';

import { Group, SimpleGrid, Stack, Text } from '@mantine/core';
import { DetailListProps } from './init/info-tile.init';

/** Label/value pairs for detail drawers and review steps (replaces ad-hoc div grids). */
export function DetailList({ items, columns = 2 }: DetailListProps) {
  return (
    <SimpleGrid cols={{ base: 1, sm: columns }} spacing="md" verticalSpacing="md">
      {items.map((item, index) => (
        <Stack key={index} gap={4}>
          <Group gap={6} wrap="nowrap" c="var(--app-text-muted)">
            {item.icon}
            <Text size="xs" fw={400} c="var(--app-text-muted)">
              {item.label}
            </Text>
          </Group>
          <Text size="sm" fw={500} c="var(--app-text-primary)">
            {item.value ?? '—'}
          </Text>
        </Stack>
      ))}
    </SimpleGrid>
  );
}
