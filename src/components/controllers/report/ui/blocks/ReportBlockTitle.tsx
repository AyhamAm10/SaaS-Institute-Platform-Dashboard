'use client';

import { Group, Box, Text, rem } from '@mantine/core';
import { useReportMirror } from '../../store/useReportMirror';
import { REPORT_PAPER } from '../../init/report.init';

/** Section heading inside a report, with a short brand accent. */
export function ReportBlockTitle({ title }: { title?: string }) {
  const brand = useReportMirror('brand');
  if (!title) return null;
  return (
    <Group gap={rem(8)} mb={rem(8)} wrap="nowrap">
      <Box style={{ width: rem(4), height: rem(16), borderRadius: rem(4), background: brand }} />
      <Text fw={600} fz={rem(13.5)} style={{ color: REPORT_PAPER.text }}>
        {title}
      </Text>
    </Group>
  );
}
