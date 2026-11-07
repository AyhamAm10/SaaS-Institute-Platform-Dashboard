'use client';

import { useEffect, useState } from 'react';
import { Center, Group, Stack, Text } from '@mantine/core';
import { IconPrinter } from '@tabler/icons-react';
import { AppButton, AppReport, REPORT_PAPER } from '@/src/components/controllers';
import type { ReportDocument } from '@/src/core/api';
import { useAuth } from '@/src/core/auth';

export function SelectionPrintController({
  docId,
  autoPrint,
}: {
  docId: string;
  autoPrint: boolean;
}) {
  const institute = useAuth().user?.institute ?? null;
  const [document] = useState<ReportDocument | null>(() => {
    if (!docId || typeof window === 'undefined') return null;
    const key = `print-selection:${docId}`;
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      localStorage.removeItem(key);
      return JSON.parse(raw) as ReportDocument;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (!autoPrint || !document) return;
    const timer = window.setTimeout(() => window.print(), 600);
    return () => window.clearTimeout(timer);
  }, [autoPrint, document]);

  if (!document) {
    return (
      <Center h="100vh">
        <Text c="var(--app-text-muted)">
          انتهت صلاحية هذه الطباعة، أعد المحاولة من الصفحة
        </Text>
      </Center>
    );
  }

  return (
    <Stack gap={0} style={{ background: REPORT_PAPER.background, minHeight: '100vh' }}>
      <Group
        className="no-print"
        justify="center"
        gap="xs"
        py="sm"
        style={{ borderBottom: `1px solid ${REPORT_PAPER.border}` }}
      >
        <AppButton leftSection={<IconPrinter size={16} />} onClick={() => window.print()}>
          طباعة / حفظ PDF
        </AppButton>
        <AppButton variant="outline" onClick={() => window.close()}>
          إغلاق
        </AppButton>
      </Group>
      <AppReport document={document} institute={institute} variant="print" />
    </Stack>
  );
}

