'use client';

import { Group, Paper, SimpleGrid, Stack, Text, ThemeIcon } from '@mantine/core';
import { IconCalendarCheck } from '@tabler/icons-react';
import { AppInput } from '@/src/components/controllers';
import { inputText } from '@/src/core/format';
import { useScheduleSettingsMirror } from '../store/useScheduleSettingsMirror';

/**
 * AttendanceRulesSection
 *
 * Daily attendance rules (E8): minutes of tolerance before a check-in is
 * LATE, and the time when students without a check-in are marked ABSENT.
 * ZERO useState hooks.
 */
export function AttendanceRulesSection() {
  const form = useScheduleSettingsMirror('form');
  const formErrors = useScheduleSettingsMirror('formErrors');
  const setLateAfterMinutes = useScheduleSettingsMirror('setLateAfterMinutes');
  const setAttendanceCloseTime = useScheduleSettingsMirror('setAttendanceCloseTime');

  return (
    <Paper p="lg" radius="xl" withBorder>
      <Stack gap="md">
        <Group gap="xs">
          <ThemeIcon size="md" radius="xl" variant="light" color="secondary">
            <IconCalendarCheck size={18} />
          </ThemeIcon>
          <Text fw={500} size="md">
            قواعد الحضور والانصراف
          </Text>
        </Group>
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          <AppInput
            label="التأخير بعد (دقيقة)"
            description={`الدخول بعد ${form.dayStartTime || 'بداية الدوام'} + هذه الدقائق يُحسب تأخيراً`}
            placeholder="15"
            type="number"
            value={String(form.lateAfterMinutes)}
            onChange={(e: unknown) => setLateAfterMinutes(Math.max(0, Number(inputText(e)) || 0))}
            error={formErrors.lateAfterMinutes ?? ''}
          />
          <AppInput
            label="وقت إغلاق الحضور"
            description="بعده يُسجَّل غياب من لم يسجّل دخوله. فارغ = نهاية الدوام"
            placeholder={form.dayEndTime || '14:00'}
            value={form.attendanceCloseTime}
            onChange={(e: unknown) => setAttendanceCloseTime(inputText(e))}
            error={formErrors.attendanceCloseTime ?? ''}
          />
        </SimpleGrid>
      </Stack>
    </Paper>
  );
}
