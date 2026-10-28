'use client';

import { Box, Group, Progress, Text, rem } from '@mantine/core';
import { ReactNode } from 'react';

export interface StatCardProgressProps {
  value: number;
  label?: ReactNode;
  color?: string;
}

export function StatCardProgress({
  value,
  label = 'Progress',
  color = 'var(--app-brand-primary)',
}: StatCardProgressProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <Box mt="auto" pt={rem(4)}>
      <Group justify="space-between" align="center" mb={rem(6)}>
        <Text size="xs" fw={700} style={{ fontSize: rem(12), color: 'var(--app-text-primary)' }}>
          {label}
        </Text>
        <Text size="xs" fw={700} style={{ fontSize: rem(12), color: 'var(--app-text-primary)' }}>
          {clamped}%
        </Text>
      </Group>
      <Progress
        value={clamped}
        size={rem(8)}
        radius="xl"
        color={color}
        style={{
          backgroundColor: 'var(--app-subtle)',
        }}
      />
    </Box>
  );
}
