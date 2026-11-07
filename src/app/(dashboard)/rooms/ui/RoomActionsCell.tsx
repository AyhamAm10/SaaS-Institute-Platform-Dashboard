'use client';

import { ActionIcon, Group, Tooltip } from '@mantine/core';
import { IconEdit, IconEye, IconTrash } from '@tabler/icons-react';
import { Room } from '@/src/core/api';

interface RoomActionsCellProps {
  room: Room;
  canManage: boolean;
  onOpenDetails: (room: Room) => void;
  onOpenEdit: (room: Room) => void;
  onOpenDelete: (room: Room) => void;
}

export function RoomActionsCell({
  room,
  canManage,
  onOpenDetails,
  onOpenEdit,
  onOpenDelete,
}: RoomActionsCellProps) {
  return (
    <Group gap="xs" justify="center" wrap="nowrap">
      <Tooltip label="عرض التفاصيل وجدول الإشغال">
        <ActionIcon
          variant="subtle"
          color="gray"
          size="sm"
          radius="md"
          onClick={() => onOpenDetails(room)}
          aria-label="عرض التفاصيل"
        >
          <IconEye size={15} />
        </ActionIcon>
      </Tooltip>

      {canManage && (
        <>
          <Tooltip label="تعديل القاعة">
            <ActionIcon
              variant="subtle"
              color="blue"
              size="sm"
              radius="md"
              onClick={() => onOpenEdit(room)}
              aria-label="تعديل القاعة"
            >
              <IconEdit size={15} />
            </ActionIcon>
          </Tooltip>

          <Tooltip label="حذف القاعة">
            <ActionIcon
              variant="subtle"
              color="red"
              size="sm"
              radius="md"
              onClick={() => onOpenDelete(room)}
              aria-label="حذف القاعة"
            >
              <IconTrash size={15} />
            </ActionIcon>
          </Tooltip>
        </>
      )}
    </Group>
  );
}

