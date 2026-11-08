'use client';

import { Group } from '@mantine/core';
import { IconEdit, IconEye, IconTrash } from '@tabler/icons-react';
import { Room } from '@/src/core/api';
import { AppIconButton } from '@/src/components/controllers/button';

interface RoomActionsCellProps {
  room: Room;
  canManage: boolean;
  onOpenDetails: (room: Room) => void;
  onOpenEdit: (room: Room) => void;
  onOpenDelete: (room: Room) => void;
}

export function RoomActionsCell({ room, canManage, onOpenDetails, onOpenEdit, onOpenDelete }: RoomActionsCellProps) {
  return (
    <Group gap="xs" justify="center" wrap="nowrap">
      <AppIconButton variant="ghost" label="عرض التفاصيل وجدول الإشغال" size="sm" onClick={() => onOpenDetails(room)}>
        <IconEye size={15} />
      </AppIconButton>

      {canManage && (
        <>
          <AppIconButton variant="ghost" label="تعديل القاعة" size="sm" onClick={() => onOpenEdit(room)}>
            <IconEdit size={15} />
          </AppIconButton>

          <AppIconButton variant="danger" label="حذف القاعة" size="sm" onClick={() => onOpenDelete(room)}>
            <IconTrash size={15} />
          </AppIconButton>
        </>
      )}
    </Group>
  );
}
