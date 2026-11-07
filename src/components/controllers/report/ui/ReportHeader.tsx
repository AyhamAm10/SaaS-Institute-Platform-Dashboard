'use client';

import { Box, Group, Image, Stack, Text, rem } from '@mantine/core';
import { useReportMirror } from '../store/useReportMirror';
import { REPORT_PAPER, withAlpha } from '../init/report.init';
import { formatGeneratedAt } from '../init/report.format';

/**
 * Letterhead: institute identity on the right, the document title card on
 * the left (number + issue time), then the subtitle.
 */
export function ReportHeader() {
  const institute = useReportMirror('institute');
  const document = useReportMirror('document');
  const brand = useReportMirror('brand');

  return (
    <Stack gap={rem(14)} mb={rem(18)} className="report-avoid-break">
      <Group justify="space-between" align="flex-start" wrap="nowrap" gap="lg">
        <Group gap={rem(12)} wrap="nowrap" align="center">
          {institute?.logoUrl ? (
            <Image src={institute.logoUrl} alt="" h={rem(54)} w="auto" fit="contain" />
          ) : (
            <Box
              style={{
                width: rem(48),
                height: rem(48),
                borderRadius: rem(12),
                background: withAlpha(brand, 0.12),
                color: brand,
                display: 'grid',
                placeItems: 'center',
                fontWeight: 600,
                fontSize: rem(20),
              }}
            >
              {institute?.name?.trim().charAt(0) ?? '٭'}
            </Box>
          )}
          <Stack gap={0}>
            <Text fw={600} fz={rem(17)} style={{ color: brand }}>
              {institute?.name ?? ''}
            </Text>
            {institute?.address && (
              <Text fz={rem(11)} style={{ color: REPORT_PAPER.muted }}>
                {institute.address}
              </Text>
            )}
            {institute?.phone && (
              <Text fz={rem(11)} dir="ltr" ta="right" style={{ color: REPORT_PAPER.muted }}>
                {institute.phone}
              </Text>
            )}
          </Stack>
        </Group>

        <Stack
          gap={rem(2)}
          align="flex-end"
          style={{
            minWidth: rem(180),
            padding: `${rem(8)} ${rem(12)}`,
            borderRadius: rem(10),
            background: withAlpha(brand, 0.06),
            border: `1px solid ${withAlpha(brand, 0.25)}`,
          }}
        >
          <Text fz={rem(10)} style={{ color: REPORT_PAPER.muted }}>
            {document.verification ? 'رقم المستند' : 'تاريخ الإصدار'}
          </Text>
          <Text fw={600} fz={rem(12.5)} dir="ltr" style={{ color: REPORT_PAPER.text }}>
            {document.verification?.number ?? formatGeneratedAt(document.generatedAt)}
          </Text>
          {document.verification && (
            <Text fz={rem(10)} dir="ltr" style={{ color: REPORT_PAPER.muted }}>
              {formatGeneratedAt(document.generatedAt)}
            </Text>
          )}
        </Stack>
      </Group>

      <Box style={{ borderBottom: `1px solid ${REPORT_PAPER.border}`, paddingBottom: rem(12) }}>
        <Text fw={600} fz={rem(22)} lh={1.25} style={{ color: REPORT_PAPER.text }}>
          {document.title}
        </Text>
        {document.subtitle && (
          <Text fz={rem(12)} mt={rem(4)} style={{ color: REPORT_PAPER.muted }}>
            {document.subtitle}
          </Text>
        )}
      </Box>
    </Stack>
  );
}
