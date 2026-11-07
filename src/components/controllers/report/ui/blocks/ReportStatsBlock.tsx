'use client';

import { Box, SimpleGrid, Text, rem } from '@mantine/core';
import type { ReportStatItem } from '@/src/core/api';
import { useReportMirror } from '../../store/useReportMirror';
import { REPORT_PAPER, resolveTone } from '../../init/report.init';
import { inferKind } from '../../init/report.format';
import { ReportBlockTitle } from './ReportBlockTitle';
import { ReportCellValue } from './ReportCellValue';

/** Key figures as cards with a tone accent on top. */
export function ReportStatsBlock({ title, items }: { title?: string; items: ReportStatItem[] }) {
  const brand = useReportMirror('brand');
  const cols = Math.min(items.length, 4) || 1;

  return (
    <Box className="report-avoid-break">
      <ReportBlockTitle title={title} />
      <SimpleGrid cols={cols} spacing={rem(10)}>
        {items.map((item) => {
          const tone = resolveTone(item.tone ?? 'neutral', brand);
          const kind = item.kind ?? inferKind(item.value);
          return (
            <Box
              key={item.label}
              style={{
                padding: `${rem(10)} ${rem(12)}`,
                borderRadius: rem(10),
                background: tone.soft,
                border: `1px solid ${REPORT_PAPER.border}`,
                borderTop: `${rem(3)} solid ${tone.text}`,
              }}
            >
              <Text fz={rem(10.5)} style={{ color: REPORT_PAPER.muted }} lineClamp={2}>
                {item.label}
              </Text>
              <Text fz={rem(17)} fw={600} mt={rem(2)} style={{ color: tone.text }}>
                <ReportCellValue cell={item.value} kind={kind} />
              </Text>
              {item.hint && (
                <Text fz={rem(10)} style={{ color: REPORT_PAPER.faint }}>
                  {item.hint}
                </Text>
              )}
            </Box>
          );
        })}
      </SimpleGrid>
    </Box>
  );
}
