'use client';

import { Center, Group, Paper, SimpleGrid, Stack, Text, ThemeIcon } from '@mantine/core';
import { IconCalendarTime, IconClock, IconTrash } from '@tabler/icons-react';
import { StatusBadge } from '@/src/components/controllers/badge';
import { AppIconButton } from '@/src/components/controllers/button';
import { weekDayName } from '@/src/core/format';
import { useTeacherRegistrationMirror } from '../store/useTeacherRegistrationMirror';

/** The availability windows added so far. */
export function Step3AvailabilityList() {
  const availabilities = useTeacherRegistrationMirror('availabilities');
  const removeAvailability = useTeacherRegistrationMirror('removeAvailability');

  return (
    <Stack gap="sm">
      <Group justify="space-between" align="center">
        <Text size="sm" fw={500} c="primary.8">
          فترات الدوام المعتمدة ({availabilities.length})
        </Text>
        {availabilities.length > 0 && (
          <StatusBadge tone="info">تم تسجيل {availabilities.length} فترات تفرغ</StatusBadge>
        )}
      </Group>

      {availabilities.length === 0 ? (
        <Paper p="xl" radius="xl" withBorder style={{ borderStyle: 'dashed' }}>
          <Center>
            <Stack align="center" gap="xs">
              <ThemeIcon color="gray" variant="light" size="xl" radius="xl">
                <IconCalendarTime size={22} />
              </ThemeIcon>
              <Text size="sm" fw={500} c="dimmed">
                لم يتم تحديد فترات مخصصة (متاح كامل أوقات الدوام الرسمي)
              </Text>
              <Text size="xs" c="dimmed" ta="center">
                يمكنك إضافة فترات محددة للأيام وساعات التفرغ في الأعلى، أو المتابعة للخطوة التالية.
              </Text>
            </Stack>
          </Center>
        </Paper>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="sm">
          {availabilities.map((avail, idx) => (
            <Paper key={`${avail.dayOfWeek}-${avail.startTime}-${idx}`} p="md" radius="xl" withBorder>
              <Group justify="space-between" align="center" wrap="nowrap">
                <Group gap="sm" wrap="nowrap">
                  <ThemeIcon color="teal" variant="light" radius="xl" size="md">
                    <IconClock size={16} />
                  </ThemeIcon>
                  <Stack gap={2}>
                    <Text size="sm" fw={500}>
                      يوم {weekDayName(avail.dayOfWeek)}
                    </Text>
                    <StatusBadge tone="neutral" variant="outline" size="sm">
                      {avail.startTime} — {avail.endTime}
                    </StatusBadge>
                  </Stack>
                </Group>

                <AppIconButton variant="danger" label="إزالة الفترة" onClick={() => removeAvailability(idx)}>
                  <IconTrash size={16} />
                </AppIconButton>
              </Group>
            </Paper>
          ))}
        </SimpleGrid>
      )}
    </Stack>
  );
}
