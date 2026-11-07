'use client';

import { Alert, Center, Group, Loader, SimpleGrid, Stack, Text } from '@mantine/core';
import { IconAlertCircle, IconArrowRight, IconFileSpreadsheet, IconPlayerPlay, IconPrinter, IconReportAnalytics } from '@tabler/icons-react';
import { AppButton, AppEmptyState, AppPageHeader, AppSurface } from '@/src/components/controllers';
import { useWorkspaceMirror } from '../store/report-workspace.store';
import { CATEGORY_META, reportsLabels as labels } from '../../static-data/reports.data';
import { ReportParamField } from './ReportParamField';
import { ReportPreview } from './ReportPreview';

interface ReportWorkspaceViewProps {
  onPrint: () => void;
  onExcel: () => Promise<void>;
}

/** Report workspace: header, parameters, actions and the paper preview. ZERO useState hooks. */
export function ReportWorkspaceView({ onPrint, onExcel }: ReportWorkspaceViewProps) {
  const definition = useWorkspaceMirror('definition');
  const catalogLoading = useWorkspaceMirror('catalogLoading');
  const document = useWorkspaceMirror('document');
  const isBuilding = useWorkspaceMirror('isBuilding');
  const isExporting = useWorkspaceMirror('isExporting');
  const exportError = useWorkspaceMirror('exportError');
  const submit = useWorkspaceMirror('submit');
  const back = (
    <AppButton variant="outline" href="/reports" leftSection={<IconArrowRight size={16} />}>
      {labels.back}
    </AppButton>
  );

  if (catalogLoading) {
    return (
      <Center py="xl">
        <Loader size="sm" color="primary" />
      </Center>
    );
  }
  if (!definition) {
    return <AppEmptyState icon={<IconReportAnalytics size={26} />} title={labels.notFound} action={back} />;
  }
  const ready = Boolean(document) && !isBuilding;

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="flex-start" wrap="wrap">
        <AppPageHeader
          icon={<IconReportAnalytics size={22} />}
          title={definition.title}
          description={`${CATEGORY_META[definition.category].label} · ${definition.description}`}
        />
        {back}
      </Group>

      <AppSurface level={2} radius="lg" padding="md">
        <Stack gap="md">
          <Text fw={600} size="sm">
            {labels.params}
          </Text>
          {definition.params.length > 0 ? (
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="sm">
              {definition.params.map((p) => (
                <ReportParamField key={p.kind} kind={p.kind} required={p.required} />
              ))}
            </SimpleGrid>
          ) : (
            <Text size="sm" c="var(--app-text-muted)">
              هذا التقرير لا يحتاج معايير: يُبنى على السنة والفرع المختارين.
            </Text>
          )}
          <Group justify="space-between" wrap="wrap" gap="xs">
            <AppButton leftSection={<IconPlayerPlay size={16} />} onClick={submit} loading={isBuilding}>
              {labels.show}
            </AppButton>
            <Group gap="xs">
              <AppButton variant="outline" leftSection={<IconPrinter size={16} />} onClick={onPrint} disabled={!ready}>
                {labels.print}
              </AppButton>
              <AppButton variant="outline" leftSection={<IconFileSpreadsheet size={16} />} onClick={onExcel} loading={isExporting} disabled={!ready}>
                {labels.excel}
              </AppButton>
            </Group>
          </Group>
          {exportError && (
            <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light" radius="md">
              {exportError}
            </Alert>
          )}
        </Stack>
      </AppSurface>

      <ReportPreview />
    </Stack>
  );
}
