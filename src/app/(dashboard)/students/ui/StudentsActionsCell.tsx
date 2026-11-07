'use client';

import { Group } from '@mantine/core';
import { IconCash, IconEdit, IconTrash } from '@tabler/icons-react';
import { Student } from '@/src/core/api';
import { AppIconButton } from '@/src/components/controllers/button';
import { studentsLabels } from '../static-data/students.data';
import type { StudentsAccess } from './StudentsTable';

interface StudentsActionsCellProps {
  student: Student;
  access: StudentsAccess;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
  onFinance: (student: Student) => void;
}

export function StudentsActionsCell({
  student,
  access,
  onEdit,
  onDelete,
  onFinance,
}: StudentsActionsCellProps) {
  return (
    <Group gap="xs" justify="center" wrap="nowrap">
      {access.canSeeFees && (
        <AppIconButton
          variant="brand"
          size="sm"
          label={studentsLabels.financeButton}
          onClick={() => onFinance(student)}
        >
          <IconCash size={15} />
        </AppIconButton>
      )}
      {access.canManage && (
        <>
          <AppIconButton
            variant="ghost"
            size="sm"
            label={studentsLabels.editButton}
            onClick={() => onEdit(student)}
          >
            <IconEdit size={15} />
          </AppIconButton>
          <AppIconButton
            variant="danger"
            size="sm"
            label={studentsLabels.deleteButton}
            onClick={() => onDelete(student)}
          >
            <IconTrash size={15} />
          </AppIconButton>
        </>
      )}
    </Group>
  );
}

