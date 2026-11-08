'use client';

import { Group, Paper, Stack, Text, ThemeIcon } from '@mantine/core';
import { IconCalendar } from '@tabler/icons-react';
import { AppButton } from '@/src/components/controllers/button';
import { sortWeekDays } from '@/src/core/format';
import { useScheduleSettingsMirror } from '../store/useScheduleSettingsMirror';
import { DAYS_OF_WEEK } from '../static-data/schedule-settings.data';

/** Weekly working days picker. */
export function WorkingDaysSection() {
  const form = useScheduleSettingsMirror('form');
  const formErrors = useScheduleSettingsMirror('formErrors');
  const setWorkingDays = useScheduleSettingsMirror('setWorkingDays');

  const toggleDay = (dayVal: number) => {
    if (form.workingDays.includes(dayVal)) {
      setWorkingDays(form.workingDays.filter((d) => d !== dayVal));
    } else {
      setWorkingDays(sortWeekDays([...form.workingDays, dayVal]));
    }
  };

  return (
    <Paper p="lg" radius="xl" withBorder>
      <Stack gap="md">
        <Group gap="xs">
          <ThemeIcon size="md" radius="xl" variant="light" color="navy">
            <IconCalendar size={18} />
          </ThemeIcon>
          <Text fw={500} size="md">
            أيام الدوام الأسبوعي
          </Text>
        </Group>

        <Text size="xs" c="dimmed">
          حدد الأيام التي تقام فيها الدروس الأكاديمية
        </Text>

        <Group gap="xs">
          {DAYS_OF_WEEK.map((day) => {
            const isSelected = form.workingDays.includes(day.value);
            return (
              <AppButton
                key={day.value}
                variant={isSelected ? 'primary' : 'outline'}
                size="sm"
                onClick={() => toggleDay(day.value)}
              >
                {day.label}
              </AppButton>
            );
          })}
        </Group>
        {formErrors.workingDays && (
          <Text c="red" size="xs">
            {formErrors.workingDays}
          </Text>
        )}
      </Stack>
    </Paper>
  );
}
