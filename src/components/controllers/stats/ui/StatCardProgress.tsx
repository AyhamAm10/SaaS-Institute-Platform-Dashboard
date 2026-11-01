'use client';

import { Box, Group, Text, rem } from '@mantine/core';
import { ReactNode } from 'react';

export interface StatCardProgressProps {
  value: number;
  label?: ReactNode;
  /** brand = orange gradient bar, ink = black gradient bar. */
  tone?: 'brand' | 'ink';
}

const FILL: Record<NonNullable<StatCardProgressProps['tone']>, string> = {
  brand: 'linear-gradient(90deg, var(--mantine-color-brand-4), var(--mantine-color-brand-6))',
  ink: 'linear-gradient(90deg, var(--app-text-secondary), var(--app-text-primary))',
};

export function StatCardProgress({ value, label, tone = 'brand' }: StatCardProgressProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <Box mt="auto" pt={rem(6)}>
      <Box
        style={{
          height: rem(6),
          borderRadius: 'var(--app-radius-pill)',
          backgroundColor: 'var(--app-sidebar-subtle)',
          overflow: 'hidden',
        }}
      >
        <Box
          style={{
            width: `${clamped}%`,
            height: '100%',
            borderRadius: 'var(--app-radius-pill)',
            background: FILL[tone],
            transition: 'width 900ms var(--app-ease-soft)',
          }}
        />
      </Box>
      <Group justify="space-between" align="center" mt={rem(8)}>
        <Text size="xs" fw={400} c="var(--app-text-muted)">
          {label}
        </Text>
        <Text size="xs" fw={500} c="var(--app-text-secondary)">
          {clamped}%
        </Text>
      </Group>
    </Box>
  );
}
