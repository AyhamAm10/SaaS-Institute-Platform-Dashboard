'use client';

import { ActionIcon, Group, Tooltip } from '@mantine/core';
import { IconEdit, IconEye, IconKey, IconTrash } from '@tabler/icons-react';
import { Teacher } from '@/src/core/api';

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
      <Tooltip label="التفاصيل والمؤهلات والدوام" withArrow>
        <ActionIcon
          variant="subtle"
          color="blue"
          radius="md"
          size="sm"
          onClick={() => openDetailsDrawer(teacher)}
        >
          <IconEye size={15} />
        </ActionIcon>
      </Tooltip>
      {canManage && openPasswordModal && (
        <Tooltip label="تغيير كلمة المرور" withArrow>
          <ActionIcon
            variant="subtle"
            color="indigo"
            radius="md"
            size="sm"
            onClick={() => openPasswordModal(teacher)}
          >
            <IconKey size={15} />
          </ActionIcon>
        </Tooltip>
      )}
      {canManage && (
        <Tooltip label="تعديل البيانات" withArrow>
          <ActionIcon
            variant="subtle"
            color="yellow"
            radius="md"
            size="sm"
            onClick={() => openEditDrawer(teacher)}
          >
            <IconEdit size={15} />
          </ActionIcon>
        </Tooltip>
      )}
      {canManage && (
        <Tooltip label="حذف المعلم" withArrow>
          <ActionIcon
            variant="subtle"
            color="red"
            radius="md"
            size="sm"
            onClick={() => openDeleteModal(teacher)}
          >
            <IconTrash size={15} />
          </ActionIcon>
        </Tooltip>
      )}
    </Group>
  );
}

