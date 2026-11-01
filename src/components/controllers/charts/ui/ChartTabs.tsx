'use client';

import { SegmentedControl } from '@mantine/core';
import { useChartsMirror } from '../store/useChartsMirror';

/** Period switcher: recessed track with a raised indicator (theme SegmentedControl). */
export function ChartTabs() {
  const periods = useChartsMirror('periods');
  const activePeriod = useChartsMirror('activePeriod');
  const setActivePeriod = useChartsMirror('setActivePeriod');

  if (!periods || periods.length === 0) return null;

  return (
    <SegmentedControl
      size="xs"
      radius="xl"
      value={activePeriod}
      onChange={setActivePeriod}
      data={periods}
      aria-label="الفترة الزمنية"
    />
  );
}
