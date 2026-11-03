'use client';

import { Alert, Group, Loader, Stack, Text } from '@mantine/core';
import { IconAlertCircle, IconInfoCircle, IconTrash } from '@tabler/icons-react';
import { AppButton, AppModal, StatusBadge } from '@/src/components/controllers';
import { Student } from '@/src/core/api';
import { useStudentsMirror } from '../store/useStudentsMirror';
import { studentsLabels } from '../static-data/students.data';

export interface StudentDeleteModalProps {
  onConfirmDelete: (student: Student) => Promise<void>;
}

/**
 * StudentDeleteModal
 *
 * Confirmation modal for (soft) deleting a student. Shows the deletion report
 * so the user sees what history is attached (it is kept, not removed).
 * ZERO useState hooks — reads from useStudentsMirror.
 */
export function StudentDeleteModal({ onConfirmDelete }: StudentDeleteModalProps) {
  const opened = useStudentsMirror('deleteModalOpened');
  const studentToDelete = useStudentsMirror('studentToDelete');
  const report = useStudentsMirror('deletionReport');
  const isLoadingReport = useStudentsMirror('isLoadingDeletionReport');
  const deleteError = useStudentsMirror('deleteError');
  const isDeleting = useStudentsMirror('isDeleting');
  const closeDeleteModal = useStudentsMirror('closeDeleteModal');
  const setDeleteError = useStudentsMirror('setDeleteError');

  if (!studentToDelete) return null;

  const reportItems = report
    ? [
        { label: 'تسجيل بالشعب', value: report.enrollments },
        { label: 'علامات', value: report.examResults },
        { label: 'سجلات حضور', value: report.lessonAttendance },
        { label: 'عقود', value: report.subscriptions },
        { label: 'دفعات', value: report.payments },
      ].filter((item) => item.value > 0)
    : [];

  return (
    <AppModal opened={opened} onClose={closeDeleteModal} variant="danger" size="sm">
      <AppModal.Header>
        <AppModal.Icon icon={<IconTrash size={22} />} color="red" />
        <AppModal.Title>{studentsLabels.deleteModalTitle}</AppModal.Title>
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
            {studentsLabels.deleteConfirmPrompt}{' '}
            <Text fw={500} span>
              &quot;{studentToDelete.fullName}&quot;
            </Text>
            ؟
          </Text>

          {isLoadingReport ? (
            <Group gap="xs">
              <Loader size="xs" />
              <Text size="xs" c="dimmed">
                {studentsLabels.deleteReportLoading}
              </Text>
            </Group>
          ) : reportItems.length > 0 ? (
            <Alert icon={<IconInfoCircle size={18} />} color="orange" variant="light" radius="md">
              <Stack gap={6}>
                <Text size="xs" fw={500}>
                  {studentsLabels.deleteReportTitle}
                </Text>
                <Group gap="xs">
                  {reportItems.map((item) => (
                    <StatusBadge key={item.label} tone="warning" size="xs">
                      {item.value} {item.label}
                    </StatusBadge>
                  ))}
                </Group>
              </Stack>
            </Alert>
          ) : null}

          <Text size="xs" fw={300} c="var(--app-text-muted)">
            {studentsLabels.deleteSoftNote}
          </Text>
        </Stack>
      </AppModal.Content>

      <AppModal.Footer>
        <AppModal.FooterEnd>
          <AppModal.Cancel>{studentsLabels.cancel}</AppModal.Cancel>
          <AppButton
            variant="dangerSolid"
            onClick={() => onConfirmDelete(studentToDelete)}
            loading={isDeleting}
            disabled={isLoadingReport}
            leftSection={<IconTrash size={16} />}
          >
            {studentsLabels.confirmDelete}
          </AppButton>
        </AppModal.FooterEnd>
      </AppModal.Footer>
    </AppModal>
  );
}
