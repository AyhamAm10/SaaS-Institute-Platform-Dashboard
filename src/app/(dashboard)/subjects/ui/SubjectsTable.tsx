'use client';

import {
  ActionIcon,
  Avatar,
  Badge,
  Group,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import {
  IconBook,
  IconEdit,
  IconLayoutGrid,
  IconTrash,
} from '@tabler/icons-react';
import { Subject } from '@/src/core/api';
import { DataModuleColumn } from '@/src/components/controllers/data-module';
import { subjectsLabels } from '../static-data/subjects.data';

/**
 * getSubjectsColumns
 *
 * Column definitions for Subjects table.
 * Strictly adheres to DataModuleController compound pattern.
 */
export function getSubjectsColumns(
  openEditDrawer: (subject: Subject) => void,
  openDeleteModal: (subject: Subject) => void,
): DataModuleColumn<Subject>[] {
  return [
    {
      key: 'name',
      title: subjectsLabels.tableName,
      sortable: true,
      render: (subject) => (
        <Group gap="sm" wrap="nowrap">
          <Avatar color="primary" radius="md" size="sm" variant="light">
            <IconBook size={16} />
          </Avatar>
          <Stack gap={1}>
            <Text size="xs" fw={600} style={{ fontSize: '13px' }}>
              {subject.name}
            </Text>
            <Text size="xs" c="dimmed" style={{ fontSize: '11px' }}>
              معرف: #{subject.id}
            </Text>
          </Stack>
        </Group>
      ),
    },
    {
      key: 'code',
      title: subjectsLabels.tableCode,
      sortable: true,
      render: (subject) => (
        <Badge
          variant="light"
          color="indigo"
          size="sm"
          radius="sm"
          dir="ltr"
          fw={600}
        >
          {subject.code}
        </Badge>
      ),
    },
    {
      key: 'sections',
      title: subjectsLabels.tableSectionsCount,
      render: (subject) => {
        const sectionsCount = subject._count?.sectionSubjects ?? 0;
        return (
          <Group gap={6} wrap="nowrap">
            <IconLayoutGrid size={14} color="var(--mantine-color-dimmed)" />
            <Text size="xs" fw={500}>
              {sectionsCount} شُعبة
            </Text>
          </Group>
        );
      },
    },
    {
      key: 'createdAt',
      title: subjectsLabels.tableCreatedAt,
      sortable: true,
      render: (subject) => {
        const formattedDate = subject.createdAt
          ? new Date(subject.createdAt).toLocaleDateString('ar-SA')
          : '—';
        return (
          <Text size="xs" c="dimmed">
            {formattedDate}
          </Text>
        );
      },
    },
    {
      key: 'actions',
      title: subjectsLabels.tableActions,
      align: 'center',
      render: (subject) => (
        <Group gap="xs" justify="center" wrap="nowrap">
          <Tooltip label={subjectsLabels.editButton} withArrow>
            <ActionIcon
              variant="subtle"
              color="blue"
              size="sm"
              radius="md"
              onClick={() => openEditDrawer(subject)}
              aria-label={subjectsLabels.editButton}
            >
              <IconEdit size={15} />
            </ActionIcon>
          </Tooltip>

          <Tooltip label={subjectsLabels.deleteButton} withArrow>
            <ActionIcon
              variant="subtle"
              color="red"
              size="sm"
              radius="md"
              onClick={() => openDeleteModal(subject)}
              aria-label={subjectsLabels.deleteButton}
            >
              <IconTrash size={15} />
            </ActionIcon>
          </Tooltip>
        </Group>
      ),
    },
  ];
}
