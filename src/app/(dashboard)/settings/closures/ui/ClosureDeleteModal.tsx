'use client';

import { Alert, Stack, Text } from '@mantine/core';
import { IconAlertCircle, IconTrash } from '@tabler/icons-react';
import { AppButton, AppModal } from '@/src/components/controllers';
import { useClosuresMirror } from '../store/closures.store';
import { closureLabels as labels } from '../static-data/closures.data';

/** Delete confirmation of one closure. ZERO useState hooks. */
export function ClosureDeleteModal({ onDelete }: { onDelete: () => Promise<void> }) {
  const target = useClosuresMirror('deleteTarget');
  const error = useClosuresMirror('deleteError');
  const isDeleting = useClosuresMirror('isDeleting');
  const close = useClosuresMirror('closeDelete');
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
          <Text size="sm">{labels.deleteConfirm(target.reason)}</Text>
        </Stack>
      </AppModal.Content>
      <AppModal.Footer>
        <AppModal.FooterEnd>
          <AppModal.Cancel>{labels.cancel}</AppModal.Cancel>
          <AppButton variant="dangerSolid" onClick={onDelete} loading={isDeleting}>
            {labels.confirmDelete}
          </AppButton>
        </AppModal.FooterEnd>
      </AppModal.Footer>
    </AppModal>
  );
}
