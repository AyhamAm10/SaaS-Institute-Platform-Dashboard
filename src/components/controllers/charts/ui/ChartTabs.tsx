'use client';

import { Group, UnstyledButton, rem } from '@mantine/core';
import { useChartsMirror } from '../store/useChartsMirror';

export function ChartTabs() {
  const periods = useChartsMirror('periods');
  const activePeriod = useChartsMirror('activePeriod');
  const setActivePeriod = useChartsMirror('setActivePeriod');

  if (!periods || periods.length === 0) return null;

  return (
    <Group
      gap={4}
      style={{
        padding: rem(3),
        borderRadius: rem(10),
        backgroundColor: 'var(--app-subtle)',
        border: '1px solid var(--app-border)',
      }}
    >
      {periods.map((p) => {
        const isActive = p === activePeriod;
        return (
          <UnstyledButton
            key={p}
            onClick={() => setActivePeriod(p)}
            style={{
              padding: `${rem(4)} ${rem(10)}`,
              borderRadius: rem(8),
              fontSize: rem(12),
              fontWeight: isActive ? 600 : 500,
              backgroundColor: isActive ? 'var(--app-surface)' : 'transparent',
              color: isActive ? 'var(--app-text-primary)' : 'var(--app-text-secondary)',
              boxShadow: isActive ? 'var(--app-card-shadow)' : 'none',
              transition: 'all 140ms ease',
            }}
          >
            {p}
          </UnstyledButton>
        );
      })}
    </Group>
  );
}
