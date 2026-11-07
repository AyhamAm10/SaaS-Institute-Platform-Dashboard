'use client';

import { Alert, Stack, Text } from '@mantine/core';
import { IconAlertCircle, IconTrash } from '@tabler/icons-react';
import { AppButton, AppModal } from '@/src/components/controllers';
import { useExamsMirror } from '../store/exams.store';
import { examsLabels as labels } from '../static-data/exams.data';

/** Delete confirmation, warning when the exam already has marks. ZERO useState hooks. */
export function DeleteExamModal({ onConfirm }: { onConfirm: () => Promise<void> }) {
  const target = useExamsMirror('deleteTarget');
  const error = useExamsMirror('deleteError');
  const isDeleting = useExamsMirror('isDeleting');
  const close = useExamsMirror('closeDelete');
  if (!target) return null;
  return (
    <AppModal opened onClose={close} size="sm" variant="danger">
      <AppModal.Header>
        <AppModal.Icon icon={<IconTrash size={22} />} color="red" />
        <AppModal.Title>{labels.deleteTitle}</AppModal.Title>
        <AppModal.Close />
      </AppModal.Header>
      <AppModal.Content>
        <Stack gap="sm">
          {error && (
            <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light" radius="md">
              {error}
            </Alert>
          )}
          <Text size="sm">{labels.deleteConfirm(target.title)}</Text>
          {target._count.results > 0 && (
            <Text size="sm" c="red">
              {labels.deleteWithMarks(target._count.results)}
            </Text>
          )}
        </Stack>
      </AppModal.Content>
      <AppModal.Footer>
        <AppModal.FooterEnd>
          <AppModal.Cancel>{labels.cancel}</AppModal.Cancel>
          <AppButton variant="dangerSolid" onClick={onConfirm} loading={isDeleting}>
            {labels.confirmDelete}
          </AppButton>
        </AppModal.FooterEnd>
      </AppModal.Footer>
    </AppModal>
  );
}
