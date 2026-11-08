'use client';

import { Card, Divider, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { StatusBadge } from '@/src/components/controllers/badge';
import { useScheduleSettingsMirror } from '../store/useScheduleSettingsMirror';

/** Live preview of the computed daily lesson / break slots. */
export function SlotsPreview() {
  const slots = useScheduleSettingsMirror('slots');

  return (
    <Paper p="lg" radius="xl" withBorder h="100%">
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <Title order={4} fw={500}>
            معاينة الحصص المحسوبة
          </Title>
          <StatusBadge tone="brand">{slots.filter((s) => s.type === 'LESSON').length} حصص يوميا</StatusBadge>
        </Group>
        <Text size="xs" c="dimmed">
          هذه الفترات الزمنية تنشأ تلقائيا وتستخدم كخانات ثابتة في الجداول الأسبوعية
        </Text>
        <Divider />

        {slots.length === 0 ? (
          <Text size="sm" c="dimmed" ta="center" py="xl">
            اضغط على &quot;حفظ التغييرات&quot; لاحتساب الفترات
          </Text>
        ) : (
          <Stack gap="xs">
            {slots.map((s, idx) => {
              const isBreak = s.type === 'BREAK';
              return (
                <Card key={idx} p="xs" radius="lg" withBorder bg={isBreak ? 'var(--app-subtle)' : undefined}>
                  <Group justify="space-between" align="center">
                    <Group gap="xs">
                      <StatusBadge tone={isBreak ? 'brand' : 'ink'} variant={isBreak ? 'solid' : 'soft'} size="sm">
                        {isBreak ? 'استراحة' : `الحصة ${s.periodNumber}`}
                      </StatusBadge>
                      {isBreak && (
                        <Text size="xs" fw={500} c="secondary">
                          {s.name}
                        </Text>
                      )}
                    </Group>
                    <Text size="xs" fw={500} dir="ltr">
                      {s.startTime} - {s.endTime}
                    </Text>
                  </Group>
                </Card>
              );
            })}
          </Stack>
        )}
      </Stack>
    </Paper>
  );
}
