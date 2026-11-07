'use client';

import { Avatar, ColorSwatch, Group, Stack, Text } from '@mantine/core';
import { IconPhone, IconUser } from '@tabler/icons-react';
import { formatDate } from '@/src/core/format';
import { Institute } from '@/src/core/api';
import { DataModuleColumn } from '@/src/components/controllers/data-module';
import { StatusBadge } from '@/src/components/controllers/badge';
import { institutesLabels } from '../static-data/institutes.data';
import { InstituteActionsCell } from './InstituteActionsCell';

export function getInstitutesColumns(
  openDetailsDrawer: (institute: Institute) => void,
  openEditDrawer: (institute: Institute) => void,
): DataModuleColumn<Institute>[] {
  return [
    {
      key: 'name',
      title: institutesLabels.tableName,
      sortable: true,
      exportValue: (inst) => `${inst.name} (${inst.code})`,
      exportKind: 'text',
      render: (institute) => (
        <Group gap="sm" wrap="nowrap">
          <Avatar
            src={institute.logoUrl || null}
            alt={institute.name}
            color="primary"
            radius="md"
            size="sm"
          >
            {institute.name ? institute.name.slice(0, 2) : 'مع'}
          </Avatar>
          <Stack gap={1}>
            <Text size="xs" fw={500} style={{ fontSize: '13px' }}>
              {institute.name}
            </Text>
            <Text size="xs" c="dimmed" style={{ fontSize: '11px' }}>
              معرف: #{institute.id} · كود: {institute.code}
            </Text>
          </Stack>
        </Group>
      ),
    },
    {
      key: 'admin',
      title: institutesLabels.tableAdmin,
      exportValue: (inst) => inst.instituteAdmins?.[0]?.user?.fullName ?? institutesLabels.noAdminAssigned,
      exportKind: 'text',
      render: (institute) => {
        const adminUser = institute.instituteAdmins?.[0]?.user;
        return adminUser ? (
          <Group gap="xs" wrap="nowrap">
            <Avatar size="xs" radius="xl" color="teal" variant="light">
              <IconUser size={12} />
            </Avatar>
            <Stack gap={0}>
              <Text size="xs" fw={500}>
                {adminUser.fullName}
              </Text>
              <Text size="xs" c="dimmed" dir="ltr" ta="right">
                {adminUser.phone}
              </Text>
            </Stack>
          </Group>
        ) : (
          <StatusBadge tone="neutral" size="xs">
            {institutesLabels.noAdminAssigned}
          </StatusBadge>
        );
      },
    },
    {
      key: 'phone',
      title: institutesLabels.tablePhone,
      exportValue: (inst) => inst.phone || '—',
      exportKind: 'text',
      render: (institute) => (
        <Group gap={6} wrap="nowrap">
          <IconPhone size={14} color="var(--mantine-color-dimmed)" />
          <Text size="xs" dir="ltr" fw={500}>
            {institute.phone || '—'}
          </Text>
        </Group>
      ),
    },
    {
      key: 'address',
      title: institutesLabels.tableAddress,
      exportValue: (inst) => inst.address || '—',
      exportKind: 'text',
      render: (institute) => (
        <Text size="xs" c="dimmed" lineClamp={1}>
          {institute.address || '—'}
        </Text>
      ),
    },
    {
      key: 'colors',
      title: institutesLabels.tableColors,
      render: (institute) => (
        <Group gap={6} wrap="nowrap">
          <ColorSwatch color={institute.primaryColor || '#1E4E8C'} size={16} />
          <ColorSwatch color={institute.secondaryColor || '#0FA4AF'} size={16} />
        </Group>
      ),
    },
    {
      key: 'createdAt',
      title: institutesLabels.tableCreatedAt,
      sortable: true,
      exportValue: (inst) => formatDate(inst.createdAt),
      exportKind: 'date',
      render: (institute) => (
        <Text size="xs" c="dimmed">
          {formatDate(institute.createdAt)}
        </Text>
      ),
    },
    {
      key: 'actions',
      title: institutesLabels.tableActions,
      align: 'center',
      render: (institute) => (
        <InstituteActionsCell
          institute={institute}
          onDetails={openDetailsDrawer}
          onEdit={openEditDrawer}
        />
      ),
    },
  ];
}
