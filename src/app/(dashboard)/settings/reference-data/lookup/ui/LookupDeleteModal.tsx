'use client';

import { Alert, Stack, Text } from '@mantine/core';
import { IconAlertCircle, IconTrash } from '@tabler/icons-react';
import { AppButton, AppModal } from '@/src/components/controllers';
import { LookupItem } from '@/src/core/api';
import { useLookupMirror } from '../store/useLookupMirror';

export interface LookupDeleteModalProps {
  onConfirmDelete: (item: LookupItem) => Promise<void>;
}

/**
 * LookupDeleteModal
 *
 * Delete confirmation. The server refuses entries still in use and the
 * returned message (with the usage count) is shown as-is. ZERO useState hooks.
 */
export function LookupDeleteModal({ onConfirmDelete }: LookupDeleteModalProps) {
  const config = useLookupMirror('config');
  const target = useLookupMirror('deleteTarget');
  const deleteError = useLookupMirror('deleteError');
  const isDeleting = useLookupMirror('isDeleting');
  const closeDelete = useLookupMirror('closeDelete');
  const setDeleteError = useLookupMirror('setDeleteError');

  if (!target) return null;

  return (
    <AppModal opened onClose={closeDelete} variant="danger" size="sm">
      <AppModal.Header>
        <AppModal.Icon icon={<IconTrash size={22} />} color="red" />
        <AppModal.Title>حذف {config.singular}</AppModal.Title>
        <AppModal.Close />
      </AppModal.Header>

      <AppModal.Content>
        <Stack gap="md">
          {deleteError && (
            <Alert
              icon={<IconAlertCircle size={16} />}
              color="red"
              variant="light"
              radius="md"
              withCloseButton
              onClose={() => setDeleteError(null)}
            >
              {deleteError}
            </Alert>
          )}
          <Text size="sm">
            هل أنت متأكد من حذف{' '}
            <Text fw={500} span>
              &quot;{target.name}&quot;
            </Text>
            ؟
          </Text>
          <Text size="xs" fw={300} c="var(--app-text-muted)">
            لا يمكن حذف عنصر مرتبط بسجلات أخرى؛ عدّل تلك السجلات أولاً.
          </Text>
        </Stack>
      </AppModal.Content>

      <AppModal.Footer>
        <AppModal.FooterEnd>
          <AppModal.Cancel>إلغاء</AppModal.Cancel>
          <AppButton
            variant="dangerSolid"
            onClick={() => onConfirmDelete(target)}
            loading={isDeleting}
            leftSection={<IconTrash size={16} />}
          >
            تأكيد الحذف
          </AppButton>
        </AppModal.FooterEnd>
      </AppModal.Footer>
    </AppModal>
  );
}
