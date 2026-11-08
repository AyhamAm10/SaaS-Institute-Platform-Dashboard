'use client';

import { Box, Group, Paper, SimpleGrid, Stack, Text } from '@mantine/core';
import { IconUsers } from '@tabler/icons-react';
import { StatusBadge } from '@/src/components/controllers/badge';
import { useRoomsMirror } from '../store/useRoomsMirror';

/** Room summary: name, type, capacity, branch and scheduled lessons. */
export function RoomOverviewTab() {
  const selectedRoomDetails = useRoomsMirror('selectedRoomDetails');
  if (!selectedRoomDetails) return null;

  return (
    <Stack gap="md">
      <Paper p="md" radius="xl" withBorder>
        <SimpleGrid cols={2} spacing="md">
          <Box>
            <Text size="xs" c="dimmed">
              اسم القاعة
            </Text>
            <Text size="sm" fw={500}>
              {selectedRoomDetails.name}
            </Text>
          </Box>
          <Box>
            <Text size="xs" c="dimmed">
              نوع القاعة
            </Text>
            <StatusBadge tone="info">{selectedRoomDetails.type}</StatusBadge>
          </Box>
          <Box>
            <Text size="xs" c="dimmed">
              السعة الاستيعابية
            </Text>
            <Group gap={4}>
              <IconUsers size={16} color="var(--app-text-secondary)" />
              <Text size="sm" fw={500}>
                {selectedRoomDetails.capacity} مقعد
              </Text>
            </Group>
          </Box>
          <Box>
            <Text size="xs" c="dimmed">
              الفرع
            </Text>
            <Text size="sm" fw={500}>
              {selectedRoomDetails.branch?.name || 'كافة الفروع'}
            </Text>
          </Box>
        </SimpleGrid>
      </Paper>

      <Paper p="md" radius="xl" withBorder>
        <Group justify="space-between" align="center">
          <Text size="xs" c="dimmed">
            إجمالي الحصص المجدولة في هذه القاعة
          </Text>
          <StatusBadge tone="info" variant="solid">
            {selectedRoomDetails._count?.timetableEntries ?? 0} حصة
          </StatusBadge>
        </Group>
      </Paper>
    </Stack>
  );
}
