'use client';

import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Group,
  Pagination,
  Paper,
  Stack,
  Table,
  Text,
  rem,
} from '@mantine/core';
import { IconDotsVertical, IconEye, IconTrash } from '@tabler/icons-react';
import { recentEnrollmentsData } from '../static-data/dashboard.data';

export function RecentEnrollmentsTable() {
  return (
    <Card padding="lg" radius="lg" h="100%">
      <Group justify="space-between" mb="md">
        <Stack gap={2}>
          <Text fw={700} size="md">
            سجلات الطلاب المسجلين
          </Text>
          <Text size="xs" c="dimmed">
            أحدث طلبات التسجيل والقيد في جميع المراحل والشُعب
          </Text>
        </Stack>
        <Button variant="subtle" size="xs" radius="xl">
          عرض كافة السجلات
        </Button>
      </Group>

      <Table.ScrollContainer minWidth={500}>
        <Table
          highlightOnHover
          verticalSpacing="md"
          horizontalSpacing="md"
          styles={{
            thead: {
              backgroundColor: 'var(--mantine-color-gray-0)',
              borderRadius: rem(10),
            },
            th: {
              fontWeight: 700,
              fontSize: rem(12),
              color: 'var(--mantine-color-gray-7)',
            },
          }}
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th>#</Table.Th>
              <Table.Th>اسم الطالب</Table.Th>
              <Table.Th>المرحلة / الشُعبة</Table.Th>
              <Table.Th>تاريخ القيد</Table.Th>
              <Table.Th>حالة الملف</Table.Th>
              <Table.Th ta="left">الإجراءات</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {recentEnrollmentsData.map((item, idx) => (
              <Table.Tr key={item.id}>
                <Table.Td>
                  <Text size="xs" fw={700} c="dimmed">
                    {idx + 1}
                  </Text>
                </Table.Td>
                <Table.Td fw={700}>{item.name}</Table.Td>
                <Table.Td>{item.grade}</Table.Td>
                <Table.Td>
                  <Text c="dimmed" size="xs" fw={500}>
                    {item.date}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Badge
                    color={item.status === 'مسجل' ? 'teal' : 'yellow'}
                    variant="light"
                    size="sm"
                    radius="xl"
                  >
                    {item.status}
                  </Badge>
                </Table.Td>
                <Table.Td ta="left">
                  <Group gap={4} justify="flex-end">
                    <ActionIcon variant="subtle" color="gray" size="sm" radius="md">
                      <IconEye size={16} />
                    </ActionIcon>
                    <ActionIcon variant="subtle" color="red" size="sm" radius="md">
                      <IconTrash size={16} />
                    </ActionIcon>
                    <ActionIcon variant="subtle" color="gray" size="sm" radius="md">
                      <IconDotsVertical size={16} />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      {/* Pill-shaped Bottom Pagination Container */}
      <Group justify="center" mt="lg">
        <Paper
          p="xs"
          px="md"
          radius="xl"
          withBorder
          style={{
            borderColor: 'var(--mantine-color-gray-2)',
            backgroundColor: 'var(--mantine-color-gray-0)',
          }}
        >
          <Pagination
            total={3}
            defaultValue={1}
            size="sm"
            radius="xl"
            styles={{
              control: {
                border: 'none',
                fontWeight: 700,
                '&[data-active]': {
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                },
              },
            }}
          />
        </Paper>
      </Group>
    </Card>
  );
}
