'use client';

import { Avatar, Group, Stack, Text } from '@mantine/core';
import { IconEdit, IconHome, IconPhone, IconTrash, IconUsers } from '@tabler/icons-react';
import { Family } from '@/src/core/api';
import { DataModuleColumn } from '@/src/components/controllers/data-module';
import { AppIconButton } from '@/src/components/controllers/button';
import { StatusBadge } from '@/src/components/controllers/badge';
import { familiesLabels } from '../static-data/families.data';

export function getFamiliesColumns(
  openEditDrawer: (family: Family) => void,
  openDeleteModal: (family: Family) => void,
  access = { canManage: true },
): DataModuleColumn<Family>[] {
  const cols: DataModuleColumn<Family>[] = [
    {
      key: 'familyName',
      title: familiesLabels.tableFamilyName,
      sortable: true,
      exportValue: (f) => f.familyName,
      exportKind: 'text',
      render: (family) => (
        <Group gap="sm" wrap="nowrap">
          <Avatar color="primary" radius="md" size="sm" variant="light">
            <IconHome size={16} />
          </Avatar>
          <Text size="sm" fw={500}>
            عائلة {family.familyName}
          </Text>
        </Group>
      ),
    },
    {
      key: 'parents',
      title: familiesLabels.tableParents,
      exportValue: (f) => `الأب: ${f.fatherName || '—'} / الأم: ${f.motherName || '—'}`,
      exportKind: 'text',
      render: (family) => (
        <Stack gap={0}>
          <Text size="xs">الأب: {family.fatherName || '—'}</Text>
          <Text size="xs" c="dimmed">
            الأم: {family.motherName || '—'}
          </Text>
        </Stack>
      ),
    },
    {
      key: 'phone',
      title: familiesLabels.tablePhone,
      exportValue: (f) => f.phone || null,
      exportKind: 'phone',
      render: (family) => (
        <Group gap={6} wrap="nowrap">
          <IconPhone size={14} color="var(--mantine-color-dimmed)" />
          <Text size="xs" dir="ltr">
            {family.phone || '—'}
          </Text>
        </Group>
      ),
    },
    {
      key: 'students',
      title: familiesLabels.tableStudents,
      exportValue: (f) => f._count?.students ?? 0,
      exportKind: 'number',
      render: (family) => {
        const count = family._count?.students ?? 0;
        return (
          <StatusBadge tone={count > 0 ? 'success' : 'neutral'} size="xs" icon={<IconUsers size={12} />}>
            {count} طالب
          </StatusBadge>
        );
      },
    },
  ];

  if (access.canManage) {
    cols.push({
      key: 'actions',
      title: familiesLabels.tableActions,
      align: 'center',
      render: (family) => (
        <Group gap="xs" justify="center" wrap="nowrap">
          <AppIconButton
            variant="ghost"
            size="sm"
            label={familiesLabels.editButton}
            onClick={() => openEditDrawer(family)}
          >
            <IconEdit size={15} />
          </AppIconButton>
          <AppIconButton
            variant="danger"
            size="sm"
            label={familiesLabels.deleteButton}
            onClick={() => openDeleteModal(family)}
          >
            <IconTrash size={15} />
          </AppIconButton>
        </Group>
      ),
    });
  }

  return cols;
}
