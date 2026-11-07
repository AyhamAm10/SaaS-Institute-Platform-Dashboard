'use client';

import { Box, SimpleGrid, Text, rem } from '@mantine/core';
import { REPORT_PAPER } from '../../init/report.init';

/** Signature lines at the end of an official paper. */
export function ReportSignaturesBlock({ items }: { items: string[] }) {
  return (
    <SimpleGrid cols={items.length || 1} spacing={rem(24)} mt={rem(12)} className="report-avoid-break">
      {items.map((label) => (
        <Box key={label} ta="center">
          <Box style={{ height: rem(38), borderBottom: `1px solid ${REPORT_PAPER.faint}` }} />
          <Text fz={rem(11)} mt={rem(4)} style={{ color: REPORT_PAPER.muted }}>
            {label}
          </Text>
        </Box>
      ))}
    </SimpleGrid>
  );
}
