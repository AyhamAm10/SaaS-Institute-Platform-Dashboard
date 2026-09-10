'use client';

import { Badge, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { IconCalendarEvent } from '@tabler/icons-react';
import { useTimetableMirror } from '../store/useTimetableMirror';

export function TimetableHeader() {
  const timetable = useTimetableMirror('timetable');
  const entriesCount = timetable?.entries?.length ?? 0;

  return (
    <Paper p="lg" radius="xl" withBorder>
      <Group justify="space-between" align="center" wrap="wrap">
        <Group gap="sm">
          <Paper
            p="xs"
            radius="xl"
            bg="var(--mantine-color-indigo-0)"
            c="indigo.7"
          >
            <IconCalendarEvent size={28} />
          </Paper>
          <Stack gap={2}>
            <Title order={2} fw={800}>
              الجدول الدراسي الأسبوعي
            </Title>
            <Text c="dimmed" size="xs">
              عرض وجدولة الحصص المدرسية، الكشف عن التعارضات، والتوليد الآلي عبر الذكاء الاصطناعي
            </Text>
          </Stack>
        </Group>

        <Group gap="xs">
          <Badge size="lg" radius="xl" variant="light" color="indigo">
            {entriesCount} حصص مجدولة
          </Badge>
        </Group>
      </Group>
    </Paper>
  );
}
