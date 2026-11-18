import { Center, Loader, Stack, Text } from '@mantine/core';
import { AppSurface, StatusBadge } from '@/src/components/controllers';
import type { Timetable, TimetableEntry } from '@/src/core/api';
import { sortWeekDays, weekDayName } from '@/src/core/format';
import { sectionDetailLabels as labels } from '../static-data/section-detail.data';

const hhmm = (t: string) => t.slice(0, 5);

function byDay(entries: TimetableEntry[]) {
  const days = new Map<number, TimetableEntry[]>();
  for (const e of entries) days.set(e.dayOfWeek, [...(days.get(e.dayOfWeek) ?? []), e]);
  return sortWeekDays([...days.keys()]).map((day) => ({
    day,
    rows: [...(days.get(day) ?? [])].sort((a, b) => a.startTime.localeCompare(b.startTime)),
  }));
}

/** Weekly timetable of the section, grouped by day. Props only. */
export function SectionTimetableTab({ timetable, isLoading }: { timetable: Timetable | null; isLoading: boolean }) {
  if (isLoading)
    return (
      <Center py="xl">
        <Loader size="sm" color="primary" />
      </Center>
    );
  const entries = timetable?.entries ?? [];
  if (entries.length === 0)
    return (
      <Text ta="center" py="xl" c="var(--app-text-muted)">
        {labels.noTimetable}
      </Text>
    );
  return (
    <Stack gap="sm">
      {byDay(entries).map(({ day, rows }) => (
        <AppSurface key={day} level={2} radius="md" padding="sm">
          <Text fw={600} size="sm" mb={6}>
            {weekDayName(day)}
          </Text>
          <Stack gap={6}>
            {rows.map((e) => (
              <Text key={e.id} component="div" size="sm">
                {hhmm(e.startTime)} – {hhmm(e.endTime)} · {e.subject?.name ?? '—'} · {e.teacher?.user.fullName ?? '—'}{' '}
                {e.room && <StatusBadge size="xs">{e.room.name}</StatusBadge>}
              </Text>
            ))}
          </Stack>
        </AppSurface>
      ))}
    </Stack>
  );
}
