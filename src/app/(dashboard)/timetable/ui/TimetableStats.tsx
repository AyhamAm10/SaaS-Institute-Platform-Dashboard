'use client';

import {
  Badge,
  Card,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
} from '@mantine/core';
import { IconCheck, IconClock, IconExclamationMark } from '@tabler/icons-react';
import { useSectionSubjectsQuery } from '@/src/core/api';
import { useTimetableMirror } from '../store/useTimetableMirror';

export function TimetableStats() {
  const sectionId = useTimetableMirror('sectionId');
  const timetable = useTimetableMirror('timetable');

  const { data: sectionSubjects } = useSectionSubjectsQuery(sectionId ?? 0);

  if (!sectionId || !sectionSubjects || sectionSubjects.length === 0) {
    return null;
  }

  const entries = timetable?.entries || [];

  return (
    <Card radius="xl" withBorder p="md">
      <Stack gap="sm">
        <Group justify="space-between">
          <Text fw={700} size="sm">
            حالة إنجاز الحصص الأسبوعية المطلوبة للشُعبة
          </Text>
          <Text size="xs" c="dimmed">
            مقارنة النصاب المطلوب مع عدد الحصص المجدولة فعلياً في الجدول
          </Text>
        </Group>

        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="xs">
          {sectionSubjects.map((ss) => {
            const scheduledCount = entries.filter(
              (e) => e.subjectId === ss.subjectId,
            ).length;
            const required = ss.weeklyPeriods || 1;
            const isComplete = scheduledCount === required;
            const isOver = scheduledCount > required;

            let color = 'teal';
            let label = 'مكتمل';
            if (!isComplete && !isOver) {
              color = 'orange';
              label = `متبقي ${required - scheduledCount}`;
            } else if (isOver) {
              color = 'red';
              label = `زيادة ${scheduledCount - required}`;
            }

            return (
              <Paper
                key={ss.id}
                p="xs"
                radius="lg"
                withBorder
                bg="var(--mantine-color-gray-0)"
              >
                <Group justify="space-between" align="center">
                  <Stack gap={2}>
                    <Text size="xs" fw={700}>
                      {ss.subject.name}
                    </Text>
                    <Text size="11px" c="dimmed">
                      {scheduledCount} من {required} حصة
                    </Text>
                  </Stack>
                  <Badge size="xs" color={color} variant="light" radius="xl">
                    {label}
                  </Badge>
                </Group>
              </Paper>
            );
          })}
        </SimpleGrid>
      </Stack>
    </Card>
  );
}
