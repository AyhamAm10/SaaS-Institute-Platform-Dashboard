'use client';

import { Center, Loader, SimpleGrid, Stack, Text } from '@mantine/core';
import { AppSurface } from '@/src/components/controllers';
import { usePortalMirror } from '../store/portal.store';
import { portalLabels as labels, WEEKDAY_NAMES } from '../static-data/portal.data';

/** The weekly timetable of his section, a card per working day (empty days stay, so the week reads whole). ZERO useState hooks. */
export function TimetableTab() {
  const slot = usePortalMirror('slots').timetable;
  if (!slot.data) {
    return slot.isLoading ? (
      <Center py="xl">
        <Loader size="sm" color="primary" />
      </Center>
    ) : null;
  }

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
      {slot.data.days.map((day) => (
        <AppSurface key={day.weekday} level={2} radius="lg" padding="md">
          <Text fw={600} size="sm" mb="xs">
            {WEEKDAY_NAMES[day.weekday]}
          </Text>
          {day.slots.length === 0 ? (
            <Text size="sm" c="var(--app-text-muted)">
              —
            </Text>
          ) : (
            <Stack gap={6}>
              {day.slots.map((s) => (
                <Stack key={`${s.startTime}-${s.subject}`} gap={0}>
                  <Text size="sm">
                    {s.startTime} - {s.endTime} · {s.subject}
                  </Text>
                  <Text size="xs" c="var(--app-text-muted)">
                    {[s.teacher, s.room].filter(Boolean).join(' · ') || labels.tabTimetable}
                  </Text>
                </Stack>
              ))}
            </Stack>
          )}
        </AppSurface>
      ))}
    </SimpleGrid>
  );
}
