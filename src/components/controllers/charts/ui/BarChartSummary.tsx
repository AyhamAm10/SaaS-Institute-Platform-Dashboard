'use client';

import { Group, Text } from '@mantine/core';

/** Total / average / peak line under the bar chart. */
export function BarChartSummary({ total, average, peak }: { total: string; average: string; peak: string }) {
  return (
    <Group gap="lg" mt="md" wrap="wrap">
      <SummaryItem label="المجموع" value={total} />
      <SummaryItem label="المتوسط" value={average} />
      <SummaryItem label="الذروة" value={peak} />
    </Group>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <Text size="xs" fw={300} c="var(--app-text-muted)">
      {label}{' '}
      <Text span fw={500} c="var(--app-text-primary)">
        {value}
      </Text>
    </Text>
  );
}
