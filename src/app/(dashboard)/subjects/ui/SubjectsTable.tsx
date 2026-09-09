'use client';

import {
  ActionIcon,
  Avatar,
  Badge,
  Card,
  Center,
  Group,
  Loader,
  Pagination,
  Stack,
  Table,
  Text,
  Tooltip,
} from '@mantine/core';
import {
  IconBook,
  IconEdit,
  IconLayoutGrid,
  IconTrash,
} from '@tabler/icons-react';
import { useSubjectsMirror } from '../store/useSubjectsMirror';
import { subjectsLabels } from '../static-data/subjects.data';
import { Subject } from '@/src/core/api';

/**
 * SubjectsTable
 *
 * Displays institute subjects with badges, section counts, and action buttons.
 * Pure presentation layer — reads state from useSubjectsMirror.
 * ZERO useState hooks.
 */
export function SubjectsTable() {
  const data = useSubjectsMirror('data');
  const isLoading = useSubjectsMirror('isLoading');
  const page = useSubjectsMirror('page');
  const totalPages = useSubjectsMirror('totalPages');
  const total = useSubjectsMirror('total');
  const setPage = useSubjectsMirror('setPage');
  const openEditDrawer = useSubjectsMirror('openEditDrawer');
  const openDeleteModal = useSubjectsMirror('openDeleteModal');

  if (isLoading) {
    return (
      <Card radius="xl" withBorder p="xl">
        <Center py="xl">
          <Stack align="center" gap="md">
            <Loader size="md" color="primary.6" />
            <Text size="sm" c="dimmed" fw={600}>
              جاري تحميل المواد الدراسية...
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
              <IconBook size={28} />
            </Avatar>
            <Text fw={700} size="md">
              {subjectsLabels.emptyState}
            </Text>
            <Text size="sm" c="dimmed">
              {subjectsLabels.emptyStateDesc}
            </Text>
          </Stack>
        </Center>
      </Card>
    );
  }

  return (
    <Card radius="xl" withBorder p={0} shadow="none">
      <Table.ScrollContainer minWidth={700}>
        <Table verticalSpacing="md" horizontalSpacing="lg" highlightOnHover>
          <Table.Thead
            style={{
              backgroundColor: 'var(--mantine-color-gray-0)',
              borderBottom: '1px solid var(--mantine-color-gray-2)',
            }}
          >
            <Table.Tr>
              <Table.Th>{subjectsLabels.tableName}</Table.Th>
              <Table.Th>{subjectsLabels.tableCode}</Table.Th>
              <Table.Th>{subjectsLabels.tableSectionsCount}</Table.Th>
              <Table.Th>{subjectsLabels.tableCreatedAt}</Table.Th>
              <Table.Th style={{ textAlign: 'center' }}>
                {subjectsLabels.tableActions}
              </Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {data.map((subject: Subject) => {
              const formattedDate = subject.createdAt
                ? new Date(subject.createdAt).toLocaleDateString('ar-SA')
                : '—';
              const sectionsCount = subject._count?.sectionSubjects ?? 0;

              return (
                <Table.Tr key={subject.id}>
                  {/* Subject Name */}
                  <Table.Td>
                    <Group gap="sm" wrap="nowrap">
                      <Avatar
                        color="primary"
                        radius="md"
                        size="md"
                        variant="light"
                      >
                        <IconBook size={20} />
                      </Avatar>
                      <Stack gap={2}>
                        <Text size="sm" fw={700}>
                          {subject.name}
                        </Text>
                        <Text size="xs" c="dimmed">
                          معرف: #{subject.id}
                        </Text>
                      </Stack>
                    </Group>
                  </Table.Td>

                  {/* Subject Code */}
                  <Table.Td>
                    <Badge
                      variant="light"
                      color="indigo"
                      size="sm"
                      radius="xl"
                      dir="ltr"
                      fw={600}
                    >
                      {subject.code}
                    </Badge>
                  </Table.Td>

                  {/* Linked Sections Count */}
                  <Table.Td>
                    <Group gap={6}>
                      <IconLayoutGrid
                        size={15}
                        color="var(--mantine-color-dimmed)"
                      />
                      <Text size="sm" fw={500}>
                        {sectionsCount} شُعبة
                      </Text>
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
                    <Group gap="xs" justify="center">
                      <Tooltip label={subjectsLabels.editButton} withArrow>
                        <ActionIcon
                          variant="subtle"
                          color="blue"
                          size="md"
                          radius="xl"
                          onClick={() => openEditDrawer(subject)}
                          aria-label={subjectsLabels.editButton}
                        >
                          <IconEdit size={16} />
                        </ActionIcon>
                      </Tooltip>

                      <Tooltip label={subjectsLabels.deleteButton} withArrow>
                        <ActionIcon
                          variant="subtle"
                          color="red"
                          size="md"
                          radius="xl"
                          onClick={() => openDeleteModal(subject)}
                          aria-label={subjectsLabels.deleteButton}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <Group
          justify="space-between"
          p="md"
          style={{ borderTop: '1px solid var(--mantine-color-gray-2)' }}
        >
          <Text size="xs" c="dimmed">
            إجمالي المواد: {total}
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
