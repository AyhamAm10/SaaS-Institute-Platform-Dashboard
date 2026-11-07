'use client';

import { Box, SimpleGrid, Text, rem } from '@mantine/core';
import type { ReportCell } from '@/src/core/api';
import { REPORT_PAPER } from '../../init/report.init';
import { inferKind } from '../../init/report.format';
import { ReportBlockTitle } from './ReportBlockTitle';
import { ReportCellValue } from './ReportCellValue';

/** Label / value pairs (identity cards, student data). */
export function ReportFieldsBlock({
  title,
  columns,
  items,
}: {
  title?: string;
  columns?: number;
  items: { label: string; value: ReportCell }[];
}) {
  return (
    <Box className="report-avoid-break">
      <ReportBlockTitle title={title} />
      <SimpleGrid
        cols={columns ?? 3}
        spacing={0}
        verticalSpacing={0}
        style={{ border: `1px solid ${REPORT_PAPER.border}`, borderRadius: rem(10), overflow: 'hidden' }}
      >
        {items.map((item) => (
          <Box
            key={item.label}
            style={{
              padding: `${rem(7)} ${rem(12)}`,
              borderBottom: `1px solid ${REPORT_PAPER.border}`,
              borderInlineStart: `1px solid ${REPORT_PAPER.border}`,
              marginInlineStart: -1,
              marginBottom: -1,
            }}
          >
            <Text fz={rem(10)} style={{ color: REPORT_PAPER.muted }}>
              {item.label}
            </Text>
            <Text fz={rem(12.5)} fw={600} style={{ color: REPORT_PAPER.text }}>
              <ReportCellValue cell={item.value} kind={inferKind(item.value)} />
            </Text>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}
