'use client';

import { Box, Text, rem } from '@mantine/core';
import type { ReportTone } from '@/src/core/api';
import { useReportMirror } from '../../store/useReportMirror';
import { resolveTone } from '../../init/report.init';

/** A highlighted remark (method notes, warnings). */
export function ReportNoteBlock({ tone, text }: { tone: ReportTone; text: string }) {
  const brand = useReportMirror('brand');
  const colors = resolveTone(tone, brand);
  return (
    <Box
      className="report-avoid-break"
      style={{
        padding: `${rem(8)} ${rem(12)}`,
        borderRadius: rem(8),
        background: colors.soft,
        borderInlineStart: `${rem(3)} solid ${colors.text}`,
      }}
    >
      <Text fz={rem(11.5)} style={{ color: colors.text }}>
        {text}
      </Text>
    </Box>
  );
}
