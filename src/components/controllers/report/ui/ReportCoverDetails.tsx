'use client';

import { Box, SimpleGrid, Text, rem } from '@mantine/core';
import { useReportMirror, useReportMirrorSelector } from '../store/useReportMirror';
import { coverDetails, REPORT_PAPER } from '../init/report.init';
import { formatGeneratedAt } from '../init/report.format';

/** Cover lower half: scope + criteria + issue data as a clean label/value card. */
export function ReportCoverDetails() {
  const brand = useReportMirror('brand');
  const scope = useReportMirror('scope');
  const document = useReportMirror('document');
  const meta = useReportMirrorSelector((s) => s.document.meta);
  const items = [
    ...coverDetails(meta, scope),
    { label: 'تاريخ الإصدار', value: formatGeneratedAt(document.generatedAt) },
    ...(document.generatedBy ? [{ label: 'أُعدّ بواسطة', value: document.generatedBy }] : []),
    ...(document.verification ? [{ label: 'رقم المستند', value: document.verification.number }] : []),
  ];

  return (
    <Box
      style={{
        borderRadius: rem(14),
        border: `1px solid ${REPORT_PAPER.border}`,
        borderInlineStart: `${rem(5)} solid ${brand}`,
        padding: `${rem(16)} ${rem(22)}`,
        background: REPORT_PAPER.stripe,
      }}
    >
      <Text fw={700} fz={rem(12)} mb={rem(10)} style={{ color: brand }}>
        تفاصيل التقرير
      </Text>
      <SimpleGrid cols={2} spacing={rem(24)} verticalSpacing={rem(12)}>
        {items.map((item) => (
          <Box key={item.label} style={{ borderBottom: `1px solid ${REPORT_PAPER.border}`, paddingBottom: rem(6) }}>
            <Text fz={rem(10.5)} style={{ color: REPORT_PAPER.muted }}>
              {item.label}
            </Text>
            <Text fw={600} fz={rem(13.5)} style={{ color: REPORT_PAPER.ink, unicodeBidi: 'plaintext' }}>
              {item.value}
            </Text>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}
