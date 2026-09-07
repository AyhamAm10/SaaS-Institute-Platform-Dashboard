'use client';

import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Center,
  ColorSwatch,
  Group,
  Loader,
  Pagination,
  Paper,
  Stack,
  Table,
  Text,
  Tooltip,
  rem,
} from '@mantine/core';
import {
  IconBuildingCommunity,
  IconChevronLeft,
  IconEye,
  IconPhone,
  IconUser,
} from '@tabler/icons-react';
import { useInstitutesMirror } from '../store/useInstitutesMirror';
import { institutesLabels } from '../static-data/institutes.data';
import { Institute } from '@/src/core/api';

/**
 * InstitutesTable
 *
 * Displays the list of educational institutes in a responsive, beautiful Mantine table.
 * Strictly adheres to role.md (ZERO useState).
 */
export function InstitutesTable() {
  const data = useInstitutesMirror('data');
  const isLoading = useInstitutesMirror('isLoading');
  const page = useInstitutesMirror('page');
  const totalPages = useInstitutesMirror('totalPages');
  const total = useInstitutesMirror('total');
  const setPage = useInstitutesMirror('setPage');
  const openDetailsDrawer = useInstitutesMirror('openDetailsDrawer');

  if (isLoading) {
    return (
      <Card radius="xl" withBorder p="xl">
        <Center py="xl">
          <Stack align="center" gap="md">
            <Loader size="md" color="primary.6" />
            <Text size="sm" c="dimmed" fw={600}>
              جاري تحميل قائمة المعاهد التعليمية...
            </Text>
          </Stack>
        </Center>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card radius="xl" withBorder p="xl">
        <Center py="xl">
          <Stack align="center" gap="sm">
            <Avatar color="primary" size="lg" radius="xl">
              <IconBuildingCommunity size={28} />
            </Avatar>
            <Text fw={700} size="md">
              {institutesLabels.emptyState}
            </Text>
            <Text size="sm" c="dimmed">
              يمكنك إضافة أول معهد في النظام بالضغط على زر "إضافة معهد جديد".
            </Text>
          </Stack>
        </Center>
      </Card>
    );
  }

  return (
    <Card radius="xl" withBorder p={0} shadow="none">
      <Table.ScrollContainer minWidth={800}>
        <Table verticalSpacing="md" horizontalSpacing="lg" highlightOnHover>
          <Table.Thead
            style={{
              backgroundColor: 'var(--mantine-color-gray-0)',
              borderBottom: '1px solid var(--mantine-color-gray-2)',
            }}
          >
            <Table.Tr>
              <Table.Th>{institutesLabels.tableName}</Table.Th>
              <Table.Th>{institutesLabels.tableAdmin}</Table.Th>
              <Table.Th>{institutesLabels.tablePhone}</Table.Th>
              <Table.Th>{institutesLabels.tableAddress}</Table.Th>
              <Table.Th>{institutesLabels.tableColors}</Table.Th>
              <Table.Th>{institutesLabels.tableCreatedAt}</Table.Th>
              <Table.Th style={{ textAlign: 'center' }}>
                {institutesLabels.tableActions}
              </Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {data.map((institute: Institute) => {
              const adminUser = institute.instituteAdmins?.[0]?.user;
              const formattedDate = institute.createdAt
                ? new Date(institute.createdAt).toLocaleDateString('ar-SA')
                : '—';

              return (
                <Table.Tr key={institute.id}>
                  {/* Institute Name & Logo */}
                  <Table.Td>
                    <Group gap="sm" wrap="nowrap">
                      <Avatar
                        src={institute.logoUrl || null}
                        alt={institute.name}
                        color="primary"
                        radius="md"
                        size="md"
                      >
                        {institute.name ? institute.name.slice(0, 2) : 'مع'}
                      </Avatar>
                      <Stack gap={2}>
                        <Text size="sm" fw={700}>
                          {institute.name}
                        </Text>
                        <Text size="xs" c="dimmed">
                          معرف: #{institute.id}
                        </Text>
                      </Stack>
                    </Group>
                  </Table.Td>

                  {/* Responsible Administrator */}
                  <Table.Td>
                    {adminUser ? (
                      <Group gap="xs" wrap="nowrap">
                        <Avatar size="sm" radius="xl" color="teal" variant="light">
                          <IconUser size={14} />
                        </Avatar>
                        <Stack gap={0}>
                          <Text size="sm" fw={600}>
                            {adminUser.fullName}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {adminUser.phone}
                          </Text>
                        </Stack>
                      </Group>
                    ) : (
                      <Badge variant="light" color="gray" size="xs" radius="xl">
                        {institutesLabels.noAdminAssigned}
                      </Badge>
                    )}
                  </Table.Td>

                  {/* Phone */}
                  <Table.Td>
                    <Group gap={6}>
                      <IconPhone size={14} color="var(--mantine-color-dimmed)" />
                      <Text size="sm" dir="ltr" fw={500}>
                        {institute.phone || '—'}
                      </Text>
                    </Group>
                  </Table.Td>

                  {/* Address */}
                  <Table.Td>
                    <Text size="sm" c="dimmed" lineClamp={1}>
                      {institute.address || '—'}
                    </Text>
                  </Table.Td>

                  {/* Brand Theme Swatches */}
                  <Table.Td>
                    <Group gap={6}>
                      <Tooltip label="اللون الأساسي" withArrow>
                        <ColorSwatch
                          color={institute.primaryColor || '#1a73e8'}
                          size={18}
                          radius="xl"
                        />
                      </Tooltip>
                      <Tooltip label="اللون الثانوي" withArrow>
                        <ColorSwatch
                          color={institute.secondaryColor || '#34a853'}
                          size={18}
                          radius="xl"
                        />
                      </Tooltip>
                    </Group>
                  </Table.Td>

                  {/* Created Date */}
                  <Table.Td>
                    <Text size="sm" c="dimmed">
                      {formattedDate}
                    </Text>
                  </Table.Td>

                  {/* Actions */}
                  <Table.Td style={{ textAlign: 'center' }}>
                    <Button
                      variant="light"
                      color="primary"
                      size="xs"
                      radius="xl"
                      leftSection={<IconEye size={14} />}
                      onClick={() => openDetailsDrawer(institute)}
                    >
                      {institutesLabels.detailsButton}
                    </Button>
                  </Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <Group justify="space-between" p="md" style={{ borderTop: '1px solid var(--mantine-color-gray-2)' }}>
          <Text size="xs" c="dimmed">
            إجمالي المعاهد: {total}
          </Text>
          <Pagination
            value={page}
            onChange={setPage}
            total={totalPages}
            radius="xl"
            size="sm"
            color="primary"
          />
        </Group>
      )}
    </Card>
  );
}
