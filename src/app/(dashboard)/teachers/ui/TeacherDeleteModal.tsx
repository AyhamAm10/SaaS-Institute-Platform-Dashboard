'use client';

import {
  Alert,
  Badge,
  Button,
  Group,
  Stack,
  Text,
} from '@mantine/core';
import {
  IconAlertCircle,
  IconAlertTriangle,
  IconTrash,
} from '@tabler/icons-react';
import { AppModal } from '@/src/components/controllers';
import { Teacher } from '@/src/core/api';
import { useTeachersMirror } from '../store/useTeachersMirror';

export interface TeacherDeleteModalProps {
  onConfirmDelete: (teacher: Teacher) => Promise<void>;
}

export function TeacherDeleteModal({ onConfirmDelete }: TeacherDeleteModalProps) {
  const opened = useTeachersMirror('deleteModalOpened');
  const teacherToDelete = useTeachersMirror('teacherToDelete');
  const deleteError = useTeachersMirror('deleteError');
  const isDeleting = useTeachersMirror('isDeleting');
  const closeDeleteModal = useTeachersMirror('closeDeleteModal');
  const setDeleteError = useTeachersMirror('setDeleteError');

  if (!teacherToDelete) return null;

  const linkedEntriesCount = teacherToDelete._count?.timetableEntries ?? 0;
  const hasLinkedEntries = linkedEntriesCount > 0;

  const handleConfirm = async () => {
    if (hasLinkedEntries) return;
    await onConfirmDelete(teacherToDelete);
  };

  return (
    <AppModal
      opened={opened}
      onClose={closeDeleteModal}
      variant="danger"
      size="sm"
    >
      <AppModal.Header>
        <AppModal.Icon icon={<IconTrash size={22} />} color="red" />
        <AppModal.Title>حذف المعلم</AppModal.Title>
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
            هل أنت متأكد من رغبتك في حذف حساب المعلم{' '}
            <Text fw={700} span>
              "{teacherToDelete.user.fullName}"
            </Text>
            ؟
          </Text>

          {hasLinkedEntries ? (
            <Alert
              icon={<IconAlertTriangle size={18} />}
              color="orange"
              variant="light"
              radius="md"
            >
              <Stack gap={4}>
                <Text size="xs" fw={700}>
                  لا يمكن حذف المعلم لوجود حصص مجدولة مرتبطة به في الجداول الأسبوعية
                </Text>
                <Group gap="xs">
                  <Badge color="orange" variant="filled" size="xs">
                    {linkedEntriesCount} حصة دراسية مرتبطة
                  </Badge>
                </Group>
              </Stack>
            </Alert>
          ) : (
            <Text size="xs" c="dimmed">
              سيتم حذف سجل المعلم ومؤهلاته وتفرغه، وتعطيل حسابه في النظام نهائياً.
            </Text>
          )}
        </Stack>
      </AppModal.Content>

      <AppModal.Footer>
        <AppModal.FooterEnd>
          <AppModal.Cancel>إلغاء</AppModal.Cancel>
          {!hasLinkedEntries && (
            <Button
              color="red"
              variant="filled"
              radius="xl"
              onClick={handleConfirm}
              loading={isDeleting}
              leftSection={<IconTrash size={16} />}
            >
              تأكيد الحذف
            </Button>
          )}
        </AppModal.FooterEnd>
      </AppModal.Footer>
    </AppModal>
  );
}
