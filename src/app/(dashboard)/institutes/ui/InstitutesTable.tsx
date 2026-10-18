'use client';

import {
  ActionIcon,
  Avatar,
  Badge,
  ColorSwatch,
  Group,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import {
  IconEye,
  IconPhone,
  IconUser,
} from '@tabler/icons-react';
import { Institute } from '@/src/core/api';
import { DataModuleColumn } from '@/src/components/controllers/data-module';
import { institutesLabels } from '../static-data/institutes.data';

/**
 * getInstitutesColumns
 *
 * Column definitions for Institutes table.
 * Strictly adheres to DataModuleController compound pattern.
 */
export function getInstitutesColumns(
  openDetailsDrawer: (institute: Institute) => void,
): DataModuleColumn<Institute>[] {
  return [
    {
      key: 'name',
      title: institutesLabels.tableName,
      sortable: true,
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
            <Text size="xs" fw={600} style={{ fontSize: '13px' }}>
              {institute.name}
            </Text>
            <Text size="xs" c="dimmed" style={{ fontSize: '11px' }}>
              معرف: #{institute.id}
            </Text>
          </Stack>
        </Group>
      ),
    },
    {
      key: 'admin',
      title: institutesLabels.tableAdmin,
      render: (institute) => {
        const adminUser = institute.instituteAdmins?.[0]?.user;
        return adminUser ? (
          <Group gap="xs" wrap="nowrap">
            <Avatar size="xs" radius="xl" color="teal" variant="light">
              <IconUser size={12} />
            </Avatar>
            <Stack gap={0}>
              <Text size="xs" fw={600}>
                {adminUser.fullName}
              </Text>
              <Text size="xs" c="dimmed" dir="ltr" ta="right">
                {adminUser.phone}
              </Text>
            </Stack>
          </Group>
        ) : (
          <Badge variant="light" color="gray" size="xs" radius="sm">
            {institutesLabels.noAdminAssigned}
          </Badge>
        );
      },
    },
    {
      key: 'phone',
      title: institutesLabels.tablePhone,
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
          <ColorSwatch
            color={institute.primaryColor || '#1E4E8C'}
            size={16}
          />
          <ColorSwatch
            color={institute.secondaryColor || '#0FA4AF'}
            size={16}
          />
        </Group>
      ),
    },
    {
      key: 'createdAt',
      title: institutesLabels.tableCreatedAt,
      sortable: true,
      render: (institute) => {
        const formattedDate = institute.createdAt
          ? new Date(institute.createdAt).toLocaleDateString('ar-SA')
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
      title: institutesLabels.tableActions,
      align: 'center',
      render: (institute) => (
        <Group gap="xs" justify="center" wrap="nowrap">
          <Tooltip label={institutesLabels.detailsButton} withArrow>
            <ActionIcon
              variant="subtle"
              color="primary"
              size="sm"
              radius="md"
              onClick={() => openDetailsDrawer(institute)}
              aria-label={institutesLabels.detailsButton}
            >
              <IconEye size={15} />
            </ActionIcon>
          </Tooltip>
        </Group>
      ),
    },
  ];
}
