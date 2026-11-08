'use client';

import { Group, Paper, SimpleGrid, Stack, Text, ThemeIcon } from '@mantine/core';
import { IconClock } from '@tabler/icons-react';
import { AppInput } from '@/src/components/controllers';
import { inputText } from '@/src/core/format';
import { useScheduleSettingsMirror } from '../store/useScheduleSettingsMirror';

/** School-day start / end and the lesson length. */
export function DailyHoursSection() {
  const form = useScheduleSettingsMirror('form');
  const formErrors = useScheduleSettingsMirror('formErrors');
  const setDayStartTime = useScheduleSettingsMirror('setDayStartTime');
  const setDayEndTime = useScheduleSettingsMirror('setDayEndTime');
  const setPeriodDurationMinutes = useScheduleSettingsMirror('setPeriodDurationMinutes');

  return (
    <Paper p="lg" radius="xl" withBorder>
      <Stack gap="md">
        <Group gap="xs">
          <ThemeIcon size="md" radius="xl" variant="light" color="secondary">
            <IconClock size={18} />
          </ThemeIcon>
          <Text fw={500} size="md">
            ساعات الدوام ومدة الحصة
          </Text>
        </Group>

        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
          <AppInput
            label="بداية الدوام"
            description="مثال: 08:00"
            placeholder="08:00"
            value={form.dayStartTime}
            onChange={(val) => setDayStartTime(inputText(val))}
            error={formErrors.dayStartTime}
          />
          <AppInput
            label="نهاية الدوام"
            description="مثال: 14:00"
            placeholder="14:00"
            value={form.dayEndTime}
            onChange={(val) => setDayEndTime(inputText(val))}
            error={formErrors.dayEndTime}
          />
          <AppInput
            label="مدة الحصة (دقيقة)"
            description="عادة 45 دقيقة"
            placeholder="45"
            type="number"
            value={String(form.periodDurationMinutes)}
            onChange={(val) => setPeriodDurationMinutes(Number(val) || 45)}
            error={formErrors.periodDurationMinutes}
          />
        </SimpleGrid>
      </Stack>
    </Paper>
  );
}
