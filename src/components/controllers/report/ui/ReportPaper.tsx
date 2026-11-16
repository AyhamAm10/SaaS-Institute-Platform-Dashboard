'use client';

import type { ReactNode } from 'react';
import { Box, rem } from '@mantine/core';
import { useReportMirror, useReportMirrorSelector } from '../store/useReportMirror';
import { formatGeneratedAt, pageCss } from '../init/report.format';
import { REPORT_PAPER } from '../init/report.init';

/**
 * The sheet of paper: A4 (portrait or landscape) with the institute brand
 * stripe. On screen it floats like a page; in print it is the bare page.
 */
export function ReportPaper({ children }: { children?: ReactNode }) {
  const variant = useReportMirror('variant');
  const brand = useReportMirror('brand');
  const orientation = useReportMirrorSelector((s) => s.document.orientation);
  const generatedAt = useReportMirrorSelector((s) => s.document.generatedAt);
  const screen = variant === 'screen';
  const width = orientation === 'landscape' ? 297 : 210;

  return (
    <Box
      className="report-paper"
      dir="rtl"
      style={{
        background: REPORT_PAPER.background,
        color: REPORT_PAPER.text,
        width: screen ? '100%' : `${width}mm`,
        maxWidth: screen ? `${width}mm` : '100%',
        minHeight: screen ? undefined : `${orientation === 'landscape' ? 210 : 297}mm`,
        margin: '0 auto',
        padding: screen ? `${rem(28)} ${rem(32)}` : '0',
        borderRadius: screen ? rem(10) : 0,
        border: screen ? `1px solid ${REPORT_PAPER.border}` : undefined,
        boxShadow: screen ? '0 18px 40px -24px rgba(15, 23, 42, 0.35)' : undefined,
        borderTop: screen ? `${rem(6)} solid ${brand}` : undefined,
        fontSize: rem(12.5),
        lineHeight: 1.55,
      }}
    >
      <style>{pageCss(orientation, formatGeneratedAt(generatedAt))}</style>
      {children}
    </Box>
  );
}
