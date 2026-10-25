'use client';

import { ActionIcon, Badge, Group, Text, Tooltip, rem } from '@mantine/core';
import { IconBuildingCommunity, IconEdit, IconMapPin, IconPhone } from '@tabler/icons-react';
import { Branch } from '@/src/core/api';
import { DataModuleColumn } from '@/src/components/controllers/data-module';

export function getBranchesColumns(onEdit: (branch: Branch) => void): DataModuleColumn<Branch>[] {
  return [
    {
      key: 'name',
      title: 'اسم الفرع',
      sortable: true,
      render: (branch) => (
        <Group gap="sm" wrap="nowrap">
          <ActionIcon size="md" radius="xl" variant="light" color="teal">
            <IconBuildingCommunity size={18} />
          </ActionIcon>
          <Text fw={700} size="sm">
            {branch.name}
          </Text>
        </Group>
      ),
    },
    {
      key: 'phone',
      title: 'هاتف التواصل',
      render: (branch) =>
        branch.phone ? (
          <Group gap={6} wrap="nowrap" dir="ltr" justify="flex-end">
            <Text size="xs" fw={500} c="dimmed">
              {branch.phone}
            </Text>
            <IconPhone size={14} color="var(--mantine-color-dimmed)" />
          </Group>
        ) : (
          <Text size="xs" c="dimmed">
            —
          </Text>
        ),
    },
    {
      key: 'address',
      title: 'العنوان الجغرافي',
      render: (branch) =>
        branch.address ? (
          <Group gap={6} wrap="nowrap">
            <IconMapPin size={14} color="var(--mantine-color-dimmed)" />
            <Text size="xs" c="dimmed" lineClamp={1}>
              {branch.address}
            </Text>
          </Group>
        ) : (
          <Text size="xs" c="dimmed">
            —
          </Text>
        ),
    },
    {
      key: 'actions',
      title: 'الإجراءات',
      align: 'center',
      render: (branch) => (
        <Tooltip label="تعديل بيانات الفرع" withArrow position="top">
          <ActionIcon
            variant="subtle"
            color="primary"
            radius="xl"
            size="sm"
            onClick={() => onEdit(branch)}
          >
            <IconEdit size={16} />
          </ActionIcon>
        </Tooltip>
      ),
    },
  ];
}
