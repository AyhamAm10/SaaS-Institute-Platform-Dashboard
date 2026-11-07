'use client';

import { Box, Group, Stack, Text, rem } from '@mantine/core';
import type { ReportBarItem } from '@/src/core/api';
import { useReportMirror } from '../../store/useReportMirror';
import { REPORT_PAPER, resolveTone } from '../../init/report.init';
import { ReportBlockTitle } from './ReportBlockTitle';

/** Horizontal bars (0–100) that print crisply without a chart library. */
export function ReportBarsBlock({ title, items }: { title?: string; items: ReportBarItem[] }) {
  const brand = useReportMirror('brand');
  if (items.length === 0) return null;

  return (
    <Box className="report-avoid-break">
      <ReportBlockTitle title={title} />
      <Stack gap={rem(6)}>
        {items.map((item, i) => {
          const tone = resolveTone(item.tone ?? 'brand', brand);
          const value = Math.max(0, Math.min(100, item.value));
          return (
            <Group key={`${item.label}-${i}`} gap={rem(10)} wrap="nowrap">
              <Text fz={rem(11)} w="26%" truncate style={{ color: REPORT_PAPER.text }}>
                {item.label}
              </Text>
              <Box style={{ flex: 1, height: rem(10), borderRadius: rem(999), background: REPORT_PAPER.headerFill, overflow: 'hidden' }}>
                <Box style={{ width: `${value}%`, height: '100%', borderRadius: rem(999), background: tone.text }} />
              </Box>
              <Text fz={rem(10.5)} w={rem(76)} ta="left" dir="ltr" fw={600} style={{ color: tone.text }}>
                {item.caption ?? `${Math.round(value)}%`}
              </Text>
            </Group>
          );
        })}
      </Stack>
    </Box>
  );
}
