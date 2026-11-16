'use client';

import { Box, Stack, Text, rem } from '@mantine/core';
import { useReportMirror, useReportMirrorSelector } from '../store/useReportMirror';
import { REPORT_PAPER, withAlpha } from '../init/report.init';
import { REPORT_FOOTER_NOTE } from '../init/report.format';
import { PrintLogo } from './PrintLogo';
import { ReportCoverDetails } from './ReportCoverDetails';

const RING = { position: 'absolute', borderRadius: '50%', insetInlineStart: '-30mm', bottom: '-40mm' } as const;

/**
 * Cover page (print only): ink panel with the logo, institute name and the
 * report title over soft brand glows, a brand band, then the report details.
 * Full-bleed named page, so it has no running header / footer.
 */
export function ReportCover() {
  const institute = useReportMirror('institute');
  const brand = useReportMirror('brand');
  const title = useReportMirrorSelector((s) => s.document.title);
  const subtitle = useReportMirrorSelector((s) => s.document.subtitle);
  const landscape = useReportMirrorSelector((s) => s.document.orientation === 'landscape');
  const contact = [institute?.address, institute?.phone].filter(Boolean).join('  ·  ');
  const ring = `1px solid ${withAlpha(REPORT_PAPER.onInk, 0.12)}`;

  return (
    <Box
      className="report-cover"
      dir="rtl"
      style={{
        width: landscape ? '297mm' : '210mm',
        height: landscape ? '209mm' : '296mm',
        display: 'flex',
        flexDirection: 'column',
        margin: '0 auto',
        overflow: 'hidden',
        background: REPORT_PAPER.background,
      }}
    >
      <Box
        style={{
          flex: landscape ? '0 0 58%' : '0 0 56%',
          position: 'relative',
          overflow: 'hidden',
          padding: landscape ? '14mm 20mm' : '20mm 20mm 16mm',
          background: `radial-gradient(circle at 12% 8%, ${withAlpha(brand, 0.38)}, transparent 46%), radial-gradient(circle at 95% 100%, ${withAlpha(brand, 0.22)}, transparent 50%), ${REPORT_PAPER.ink}`,
          color: REPORT_PAPER.onInk,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Box style={{ ...RING, width: '110mm', height: '110mm', border: ring }} />
        <Box
          style={{ ...RING, insetInlineStart: '-10mm', bottom: '-20mm', width: '70mm', height: '70mm', border: ring }}
        />
        <Stack gap={rem(10)} align="flex-start" style={{ position: 'relative' }}>
          <Box style={{ background: REPORT_PAPER.onInk, borderRadius: rem(20), padding: rem(10), display: 'flex' }}>
            <PrintLogo institute={institute} brand={brand} size={landscape ? 64 : 84} />
          </Box>
          <Text fw={700} fz={rem(26)} lh={1.2} style={{ color: REPORT_PAPER.onInk }}>
            {institute?.name ?? ''}
          </Text>
          {contact && (
            <Text fz={rem(12)} style={{ color: REPORT_PAPER.onInkMuted }}>
              {contact}
            </Text>
          )}
        </Stack>
        <Stack gap={rem(8)} style={{ position: 'relative' }}>
          <Box style={{ width: rem(56), height: rem(5), borderRadius: rem(3), background: brand }} />
          <Text fw={700} fz={rem(landscape ? 32 : 38)} lh={1.25} style={{ color: REPORT_PAPER.onInk }}>
            {title}
          </Text>
          {subtitle && (
            <Text fz={rem(14)} style={{ color: REPORT_PAPER.onInkMuted }}>
              {subtitle}
            </Text>
          )}
        </Stack>
      </Box>
      <Box style={{ height: '4mm', background: brand, flexShrink: 0 }} />
      <Box
        style={{
          flex: 1,
          padding: landscape ? '8mm 20mm' : '14mm 20mm',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <ReportCoverDetails />
        <Text fz={rem(10)} ta="center" style={{ color: REPORT_PAPER.faint }}>
          {REPORT_FOOTER_NOTE}
        </Text>
      </Box>
    </Box>
  );
}
