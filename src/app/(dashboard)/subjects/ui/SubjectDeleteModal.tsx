'use client';

import { Alert, Group, Stack, Text } from '@mantine/core';
import { IconAlertCircle, IconAlertTriangle, IconTrash } from '@tabler/icons-react';
import { AppButton, AppModal } from '@/src/components/controllers';
import { useSubjectsMirror } from '../store/useSubjectsMirror';
import { subjectsLabels } from '../static-data/subjects.data';
import { Subject } from '@/src/core/api';
import { StatusBadge } from '@/src/components/controllers/badge';

export interface SubjectDeleteModalProps {
  onConfirmDelete: (subject: Subject) => Promise<void>;
}

/**
 * SubjectDeleteModal
 *
 * Confirmation modal for deleting a subject.
 * Checks for linked section count and displays a blocking warning if active sections exist.
 * ZERO useState hooks — reads from useSubjectsMirror.
 */
export function SubjectDeleteModal({ onConfirmDelete }: SubjectDeleteModalProps) {
  const opened = useSubjectsMirror('deleteModalOpened');
  const subjectToDelete = useSubjectsMirror('subjectToDelete');
  const deleteError = useSubjectsMirror('deleteError');
  const isDeleting = useSubjectsMirror('isDeleting');
  const closeDeleteModal = useSubjectsMirror('closeDeleteModal');
  const setDeleteError = useSubjectsMirror('setDeleteError');

  if (!subjectToDelete) return null;

  const linkedSectionsCount = subjectToDelete._count?.sectionSubjects ?? 0;
  const hasLinkedSections = linkedSectionsCount > 0;

  const handleConfirm = async () => {
    if (hasLinkedSections) return;
    await onConfirmDelete(subjectToDelete);
  };

  return (
    <AppModal opened={opened} onClose={closeDeleteModal} variant="danger" size="sm">
      <AppModal.Header>
        <AppModal.Icon icon={<IconTrash size={22} />} color="red" />
        <AppModal.Title>{subjectsLabels.deleteModalTitle}</AppModal.Title>
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
            {subjectsLabels.deleteConfirmPrompt}{' '}
            <Text fw={500} span>
              &quot;{subjectToDelete.name}&quot;
            </Text>
            ؟
          </Text>

          {hasLinkedSections ? (
            <Alert icon={<IconAlertTriangle size={18} />} color="orange" variant="light" radius="md">
              <Stack gap={4}>
                <Text size="xs" fw={500}>
                  {subjectsLabels.deleteWarningLinkedSections}
                </Text>
                <Group gap="xs">
                  <StatusBadge tone="warning" variant="solid" size="xs">
                    {linkedSectionsCount} شعبة دراسية مرتبطة
                  </StatusBadge>
                </Group>
              </Stack>
            </Alert>
          ) : (
            <Text size="xs" fw={300} c="var(--app-text-muted)">
              هذا الإجراء سيقوم بحذف المادة نهائيا من قائمة مواد المعهد.
            </Text>
          )}
        </Stack>
      </AppModal.Content>

      <AppModal.Footer>
        <AppModal.FooterEnd>
          <AppModal.Cancel>{subjectsLabels.cancel}</AppModal.Cancel>
          {!hasLinkedSections && (
            <AppButton
              variant="dangerSolid"
              onClick={handleConfirm}
              loading={isDeleting}
              leftSection={<IconTrash size={16} />}
            >
              {subjectsLabels.confirmDelete}
            </AppButton>
          )}
        </AppModal.FooterEnd>
      </AppModal.Footer>
    </AppModal>
  );
}
