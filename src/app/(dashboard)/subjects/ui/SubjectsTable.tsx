'use client';

import { Avatar, Group, Text } from '@mantine/core';
import { IconBook, IconEdit, IconLayoutGrid, IconTrash } from '@tabler/icons-react';
import { formatDate } from '@/src/core/format';
import { Subject } from '@/src/core/api';
import { DataModuleColumn } from '@/src/components/controllers/data-module';
import { subjectsLabels } from '../static-data/subjects.data';
import { AppIconButton } from '@/src/components/controllers/button';

export function getSubjectsColumns(
  openEditDrawer: (subject: Subject) => void,
  openDeleteModal: (subject: Subject) => void,
  access = { canManage: true },
): DataModuleColumn<Subject>[] {
  const cols: DataModuleColumn<Subject>[] = [
    {
      key: 'name',
      title: subjectsLabels.tableName,
      sortable: true,
      exportValue: (s) => s.name,
      exportKind: 'text',
      render: (subject) => (
        <Group gap="sm" wrap="nowrap">
          <Avatar color="primary" radius="md" size="sm" variant="light">
            <IconBook size={16} />
          </Avatar>
          <Text size="sm" fw={500}>
            {subject.name}
          </Text>
        </Group>
      ),
    },
    {
      key: 'sections',
      title: subjectsLabels.tableSectionsCount,
      exportValue: (s) => s._count?.sectionSubjects ?? 0,
      exportKind: 'number',
      render: (subject) => {
        const sectionsCount = subject._count?.sectionSubjects ?? 0;
        return (
          <Group gap={6} wrap="nowrap">
            <IconLayoutGrid size={14} color="var(--mantine-color-dimmed)" />
            <Text size="xs" fw={500}>
              {sectionsCount} شعبة
            </Text>
          </Group>
        );
      },
    },
    {
      key: 'createdAt',
      title: subjectsLabels.tableCreatedAt,
      sortable: true,
      exportValue: (s) => (s.createdAt ? String(s.createdAt).split('T')[0] : null),
      exportKind: 'date',
      render: (subject) => (
        <Text size="xs" c="dimmed">
          {formatDate(subject.createdAt)}
        </Text>
      ),
    },
  ];

  if (access.canManage) {
    cols.push({
      key: 'actions',
      title: subjectsLabels.tableActions,
      align: 'center',
      render: (subject) => (
        <Group gap="xs" justify="center" wrap="nowrap">
          <AppIconButton
            variant="ghost"
            label={subjectsLabels.editButton}
            size="sm"
            onClick={() => openEditDrawer(subject)}
          >
            <IconEdit size={15} />
          </AppIconButton>

          <AppIconButton
            variant="danger"
            label={subjectsLabels.deleteButton}
            size="sm"
            onClick={() => openDeleteModal(subject)}
          >
            <IconTrash size={15} />
          </AppIconButton>
        </Group>
      ),
    });
  }

  return cols;
}
