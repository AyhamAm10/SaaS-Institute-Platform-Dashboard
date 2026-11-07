'use client';

import { Box, Group, Image, Stack, Text, rem } from '@mantine/core';
import { useReportMirror } from '../store/useReportMirror';
import { REPORT_PAPER } from '../init/report.init';
import { formatGeneratedAt } from '../init/report.format';

/**
 * Closing strip: who issued the document and when, plus the verification
 * QR code (scan → public page that confirms the document is authentic).
 */
export function ReportFooter() {
  const document = useReportMirror('document');
  const qr = useReportMirror('qrDataUri');

  return (
    <Group
      justify="space-between"
      align="flex-end"
      mt={rem(22)}
      pt={rem(12)}
      wrap="nowrap"
      className="report-avoid-break"
      style={{ borderTop: `1px dashed ${REPORT_PAPER.border}` }}
    >
      <Stack gap={rem(2)}>
        <Text fz={rem(10.5)} style={{ color: REPORT_PAPER.muted }}>
          صدر بتاريخ <Box component="bdi">{formatGeneratedAt(document.generatedAt)}</Box>
          {document.generatedBy ? ` · بواسطة ${document.generatedBy}` : ''}
        </Text>
        <Text fz={rem(9.5)} style={{ color: REPORT_PAPER.faint }}>
          {document.verification
            ? 'امسح الرمز للتحقق من صحة هذا المستند لدى المعهد.'
            : 'مستند مُولَّد آلياً من منصة إدارة المعهد.'}
        </Text>
      </Stack>
      {document.verification && qr && (
        <Stack gap={rem(2)} align="center">
          <Image src={qr} alt="رمز التحقق" w={rem(78)} h={rem(78)} />
          <Text fz={rem(9)} dir="ltr" style={{ color: REPORT_PAPER.muted }}>
            {document.verification.number}
          </Text>
        </Stack>
      )}
    </Group>
  );
}
