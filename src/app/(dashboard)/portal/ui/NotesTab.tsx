'use client';

import { Center, Loader, Stack, Text } from '@mantine/core';
import { AppEmptyState, AppSurface } from '@/src/components/controllers';
import { formatLongDate } from '@/src/core/format';
import { usePortalMirror } from '../store/portal.store';
import { notesLabels as labels } from '../static-data/portal.data';

/** Guardian only: the notes the institute marked visible to the family, newest first. ZERO useState hooks. */
export function NotesTab() {
  const slot = usePortalMirror('slots').notes;
  if (!slot.data) {
    return slot.isLoading ? (
      <Center py="xl">
        <Loader size="sm" color="primary" />
      </Center>
    ) : null;
  }
  if (slot.data.length === 0) return <AppEmptyState compact title={labels.empty} />;

  return (
    <Stack gap="md">
      {slot.data.map((n) => (
        <AppSurface key={n.id} level={2} radius="lg" padding="md">
          <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
            {n.body}
          </Text>
          <Text size="xs" c="var(--app-text-muted)" mt="xs">
            {formatLongDate(n.createdAt)}
            {n.author ? ` · ${labels.by(n.author)}` : ''}
          </Text>
        </AppSurface>
      ))}
    </Stack>
  );
}
