'use client';

import {
  Card,
  Group,
  RingProgress,
  Stack,
  Text,
  ThemeIcon,
} from '@mantine/core';
import { IconCalendarStats, IconCheck } from '@tabler/icons-react';

export function TermProgressCard() {
  return (
    <Card padding="lg" radius="lg" h="100%">
      <Text fw={700} size="md" mb="xs">
        نسبة الإنجاز الأكاديمي والجاهزية
      </Text>
      <Text size="xs" c="dimmed" mb="lg">
        متابعة تدريس الخطط المنهجية ونسب حضور الطلاب
      </Text>

      <Stack align="center" my="md">
        <RingProgress
          size={160}
          thickness={14}
          roundCaps
          sections={[
            { value: 68, color: 'primary' },
            { value: 20, color: 'teal' },
          ]}
          label={
            <Stack gap={0} align="center">
              <Text fw={800} size="xl">
                88%
              </Text>
              <Text size="xs" c="dimmed" fw={600}>
                المعدل العام
              </Text>
            </Stack>
          }
        />
      </Stack>

      <Stack gap="sm" mt="md">
        <Group justify="space-between">
          <Group gap="xs">
            <ThemeIcon color="primary" size="md" radius="xl" variant="light">
              <IconCheck size={14} stroke={2} />
            </ThemeIcon>
            <Text size="sm" fw={600}>الخطة التدريسية المنجزة</Text>
          </Group>
          <Text fw={800} size="sm" c="primary.6">
            68%
          </Text>
        </Group>

        <Group justify="space-between">
          <Group gap="xs">
            <ThemeIcon color="teal" size="md" radius="xl" variant="light">
              <IconCalendarStats size={14} stroke={2} />
            </ThemeIcon>
            <Text size="sm" fw={600}>نسبة الحضور والالتزام</Text>
          </Group>
          <Text fw={800} size="sm" c="teal.6">
            94.2%
          </Text>
        </Group>
      </Stack>
    </Card>
  );
}
