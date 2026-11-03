'use client';

import { Alert, Stack, Text } from '@mantine/core';
import { IconAlertCircle, IconAlertTriangle, IconTrash } from '@tabler/icons-react';
import { AppButton, AppModal } from '@/src/components/controllers';
import { Family } from '@/src/core/api';
import { useFamiliesMirror } from '../store/useFamiliesMirror';
import { familiesLabels } from '../static-data/families.data';

export interface FamilyDeleteModalProps {
  onConfirmDelete: (family: Family) => Promise<void>;
}

/**
 * FamilyDeleteModal
 *
 * Confirmation modal for (soft) deleting a family. Deletion is blocked while
 * the family still has students. ZERO useState hooks — reads from useFamiliesMirror.
 */
export function FamilyDeleteModal({ onConfirmDelete }: FamilyDeleteModalProps) {
  const opened = useFamiliesMirror('deleteModalOpened');
  const familyToDelete = useFamiliesMirror('familyToDelete');
  const deleteError = useFamiliesMirror('deleteError');
  const isDeleting = useFamiliesMirror('isDeleting');
  const closeDeleteModal = useFamiliesMirror('closeDeleteModal');
  const setDeleteError = useFamiliesMirror('setDeleteError');

  if (!familyToDelete) return null;

  const hasStudents = (familyToDelete._count?.students ?? 0) > 0;

  return (
    <AppModal opened={opened} onClose={closeDeleteModal} variant="danger" size="sm">
      <AppModal.Header>
        <AppModal.Icon icon={<IconTrash size={22} />} color="red" />
        <AppModal.Title>{familiesLabels.deleteModalTitle}</AppModal.Title>
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
            {familiesLabels.deleteConfirmPrompt}{' '}
            <Text fw={500} span>
              &quot;{familyToDelete.familyName}&quot;
            </Text>
            ؟
          </Text>

          {hasStudents ? (
            <Alert icon={<IconAlertTriangle size={18} />} color="orange" variant="light" radius="md">
              <Text size="xs" fw={500}>
                {familiesLabels.deleteBlockedWarning}
              </Text>
            </Alert>
          ) : (
            <Text size="xs" fw={300} c="var(--app-text-muted)">
              {familiesLabels.deleteSoftNote}
            </Text>
          )}
        </Stack>
      </AppModal.Content>

      <AppModal.Footer>
        <AppModal.FooterEnd>
          <AppModal.Cancel>{familiesLabels.cancel}</AppModal.Cancel>
          {!hasStudents && (
            <AppButton
              variant="dangerSolid"
              onClick={() => onConfirmDelete(familyToDelete)}
              loading={isDeleting}
              leftSection={<IconTrash size={16} />}
            >
              {familiesLabels.confirmDelete}
            </AppButton>
          )}
        </AppModal.FooterEnd>
      </AppModal.Footer>
    </AppModal>
  );
}
