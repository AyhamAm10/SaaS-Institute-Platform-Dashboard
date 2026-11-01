'use client';

import { SegmentedControl } from '@mantine/core';
import { useChartsMirror } from '../store/useChartsMirror';

/** Period switcher: glass pill with a sliding ink indicator. */
export function ChartTabs() {
  const periods = useChartsMirror('periods');
  const activePeriod = useChartsMirror('activePeriod');
  const setActivePeriod = useChartsMirror('setActivePeriod');

  if (!periods || periods.length === 0) return null;

  return (
    <SegmentedControl
      size="xs"
      radius="xl"
      color="primary"
      value={activePeriod}
      onChange={setActivePeriod}
      data={periods}
      transitionDuration={320}
      transitionTimingFunction="cubic-bezier(0.16, 1, 0.3, 1)"
      aria-label="الفترة الزمنية"
    />
  );
}
