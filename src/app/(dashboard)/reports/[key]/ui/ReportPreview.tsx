'use client';

import { Alert, Box, Center, Loader, Stack, Text } from '@mantine/core';
import { IconAlertCircle, IconFileDescription } from '@tabler/icons-react';
import { AppEmptyState, AppReport } from '@/src/components/controllers';
import { useAuth } from '@/src/core/auth';
import { useWorkspaceMirror } from '../store/report-workspace.store';
import { reportsLabels as labels } from '../../static-data/reports.data';

/** The paper preview: waiting hint, loader, server error, or the document. ZERO useState hooks. */
export function ReportPreview() {
  const document = useWorkspaceMirror('document');
  const isBuilding = useWorkspaceMirror('isBuilding');
  const buildError = useWorkspaceMirror('buildError');
  const submitted = useWorkspaceMirror('submitted');
  const institute = useAuth().user?.institute ?? null;

  if (!submitted) {
    return <AppEmptyState icon={<IconFileDescription size={26} />} title={labels.pickParams} compact />;
  }
  if (isBuilding) {
    return (
      <Center py={80}>
        <Stack align="center" gap="xs">
          <Loader size="sm" color="primary" />
          <Text size="sm" c="var(--app-text-muted)">
            جاري إنشاء التقرير...
          </Text>
        </Stack>
      </Center>
    );
  }
  if (buildError) {
    return (
      <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light" radius="md">
        {buildError}
      </Alert>
    );
  }
  if (!document) return null;
  return (
    <Box py="md" px={{ base: 0, sm: 'md' }} style={{ background: 'var(--app-sidebar-subtle)', borderRadius: 'var(--app-radius-lg)' }}>
      <AppReport document={document} institute={institute} />
    </Box>
  );
}
