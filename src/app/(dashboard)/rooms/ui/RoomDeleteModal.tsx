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
import { Room } from '@/src/core/api';
import { useRoomsMirror } from '../store/useRoomsMirror';

export interface RoomDeleteModalProps {
  onConfirmDelete: (room: Room) => Promise<void>;
}

export function RoomDeleteModal({ onConfirmDelete }: RoomDeleteModalProps) {
  const opened = useRoomsMirror('deleteModalOpened');
  const roomToDelete = useRoomsMirror('roomToDelete');
  const deleteError = useRoomsMirror('deleteError');
  const isDeleting = useRoomsMirror('isDeleting');
  const closeDeleteModal = useRoomsMirror('closeDeleteModal');
  const setDeleteError = useRoomsMirror('setDeleteError');

  if (!roomToDelete) return null;

  const linkedEntriesCount = roomToDelete._count?.timetableEntries ?? 0;
  const hasLinkedEntries = linkedEntriesCount > 0;

  const handleConfirm = async () => {
    if (hasLinkedEntries) return;
    await onConfirmDelete(roomToDelete);
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
        <AppModal.Title>حذف القاعة</AppModal.Title>
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
            هل أنت متأكد من رغبتك في حذف القاعة{' '}
            <Text fw={700} span>
              "{roomToDelete.name}"
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
                  لا يمكن حذف القاعة لوجود حصص دراسية مجدولة فيها
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
              سيتم إزالة القاعة وفترات إتاحتها من النظام بشكل نهائي.
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
