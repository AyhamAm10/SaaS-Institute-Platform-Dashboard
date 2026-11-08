'use client';

import { Group } from '@mantine/core';
import { IconEdit, IconEye, IconKey, IconTrash } from '@tabler/icons-react';
import { Teacher } from '@/src/core/api';
import { AppIconButton } from '@/src/components/controllers/button';

export interface TeacherActionsCellProps {
  teacher: Teacher;
  canManage: boolean;
  openDetailsDrawer: (teacher: Teacher) => void;
  openEditDrawer: (teacher: Teacher) => void;
  openDeleteModal: (teacher: Teacher) => void;
  openPasswordModal?: (teacher: Teacher) => void;
}

export function TeacherActionsCell({
  teacher,
  canManage,
  openDetailsDrawer,
  openEditDrawer,
  openDeleteModal,
  openPasswordModal,
}: TeacherActionsCellProps) {
  return (
    <Group gap="xs" justify="center" wrap="nowrap">
      <AppIconButton
        variant="ghost"
        label="التفاصيل والمؤهلات والدوام"
        size="sm"
        onClick={() => openDetailsDrawer(teacher)}
      >
        <IconEye size={15} />
      </AppIconButton>

      {canManage && openPasswordModal && (
        <AppIconButton variant="ghost" label="تغيير كلمة المرور" size="sm" onClick={() => openPasswordModal(teacher)}>
          <IconKey size={15} />
        </AppIconButton>
      )}
      {canManage && (
        <AppIconButton variant="ghost" label="تعديل البيانات" size="sm" onClick={() => openEditDrawer(teacher)}>
          <IconEdit size={15} />
        </AppIconButton>
      )}
      {canManage && (
        <AppIconButton variant="danger" label="حذف المعلم" size="sm" onClick={() => openDeleteModal(teacher)}>
          <IconTrash size={15} />
        </AppIconButton>
      )}
    </Group>
  );
}
