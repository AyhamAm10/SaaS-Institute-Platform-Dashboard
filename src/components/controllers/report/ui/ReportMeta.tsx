'use client';

import { Group, Text, rem } from '@mantine/core';
import { useReportMirror, useReportMirrorSelector } from '../store/useReportMirror';
import { REPORT_PAPER, withAlpha } from '../init/report.init';

/** Report criteria (period, section, ...) as soft brand chips. */
export function ReportMeta() {
  const meta = useReportMirrorSelector((s) => s.document.meta);
  const brand = useReportMirror('brand');
  if (meta.length === 0) return null;

  return (
    <Group gap={rem(8)} mb={rem(18)} wrap="wrap" className="report-avoid-break">
      {meta.map((m) => (
        <Group
          key={m.label}
          gap={rem(6)}
          wrap="nowrap"
          style={{
            padding: `${rem(4)} ${rem(10)}`,
            borderRadius: rem(999),
            background: withAlpha(brand, 0.07),
            border: `1px solid ${withAlpha(brand, 0.18)}`,
          }}
        >
          <Text fz={rem(11)} style={{ color: REPORT_PAPER.muted }}>
            {m.label}
          </Text>
          <Text fz={rem(11.5)} fw={600} style={{ color: REPORT_PAPER.text }}>
            {m.value}
          </Text>
        </Group>
      ))}
    </Group>
  );
}
