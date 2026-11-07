'use client';

import { Box, Text, rem } from '@mantine/core';
import type { ReportCell, ReportColumnKind } from '@/src/core/api';
import { useReportMirror } from '../../store/useReportMirror';
import { formatReportCell, isBadgeCell, isLtrKind } from '../../init/report.format';
import { resolveTone } from '../../init/report.init';

/** One typed value: badges as soft pills, numbers / phones / money left-to-right. */
export function ReportCellValue({ cell, kind, strong }: { cell: ReportCell; kind: ReportColumnKind; strong?: boolean }) {
  const brand = useReportMirror('brand');

  if (isBadgeCell(cell)) {
    const tone = resolveTone(cell.tone, brand);
    return (
      <Box
        component="span"
        style={{
          display: 'inline-block',
          padding: `${rem(1)} ${rem(8)}`,
          borderRadius: rem(999),
          background: tone.soft,
          color: tone.text,
          fontSize: rem(10.5),
          fontWeight: 600,
          whiteSpace: 'nowrap',
        }}
      >
        {cell.text}
      </Box>
    );
  }

  return (
    <Text
      component="span"
      fz="inherit"
      fw={strong ? 700 : undefined}
      dir={isLtrKind(kind) ? 'ltr' : undefined}
      style={{ whiteSpace: kind === 'money' || kind === 'phone' || kind === 'date' ? 'nowrap' : undefined, unicodeBidi: 'isolate' }}
    >
      {formatReportCell(cell, kind)}
    </Text>
  );
}
