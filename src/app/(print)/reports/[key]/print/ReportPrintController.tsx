'use client';

import { useEffect } from 'react';
import { Center, Group, Loader, Stack, Text } from '@mantine/core';
import { IconPrinter } from '@tabler/icons-react';
import { AppButton, AppReport, REPORT_PAPER } from '@/src/components/controllers';
import { getApiErrorMessage, type ReportParams, useReportQuery } from '@/src/core/api';
import { useAuth } from '@/src/core/auth';

/**
 * ReportPrintController
 *
 * Print page of a report (D3): bare A4 pages with the institute letterhead,
 * page numbers and verification QR. Opened from the workspace with
 * `autoprint`, it opens the browser print dialog (print / save as PDF) once
 * the document is ready.
 */
export function ReportPrintController({ reportKey, params, autoPrint }: { reportKey: string; params: ReportParams; autoPrint: boolean }) {
  const institute = useAuth().user?.institute ?? null;
  const { data, isLoading, error } = useReportQuery(reportKey, params, true);

  // Give the QR / fonts a moment to render before the dialog freezes the page
  useEffect(() => {
    if (!autoPrint || !data) return;
    const timer = window.setTimeout(() => window.print(), 600);
    return () => window.clearTimeout(timer);
  }, [autoPrint, data]);

  if (isLoading) {
    return (
      <Center h="100vh">
        <Loader size="sm" />
      </Center>
    );
  }
  if (error || !data) {
    return (
      <Center h="100vh">
        <Text>{getApiErrorMessage(error, 'تعذّر إنشاء التقرير')}</Text>
      </Center>
    );
  }
  return (
    <Stack gap={0} style={{ background: REPORT_PAPER.background, minHeight: '100vh' }}>
      <Group className="no-print" justify="center" gap="xs" py="sm" style={{ borderBottom: `1px solid ${REPORT_PAPER.border}` }}>
        <AppButton leftSection={<IconPrinter size={16} />} onClick={() => window.print()}>
          طباعة / حفظ PDF
        </AppButton>
        <AppButton variant="outline" onClick={() => window.close()}>
          إغلاق
        </AppButton>
      </Group>
      <AppReport document={data} institute={institute} variant="print" />
    </Stack>
  );
}
