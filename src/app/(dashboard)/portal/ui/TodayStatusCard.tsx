'use client';

import { Group, Stack, Text } from '@mantine/core';
import { AppSurface, StatusBadge } from '@/src/components/controllers';
import type { BadgeTone } from '@/src/components/controllers';
import type { PortalOverview } from '@/src/core/api';
import { todayLabels as labels } from '../static-data/portal.data';
import { clockOf, type DayState, dayState, dayStateText, lessonsAround } from '../utils/portal.utils';

const TONES: Record<DayState, BadgeTone> = {
  noSchool: 'neutral',
  notArrived: 'warning',
  absent: 'danger',
  excused: 'info',
  inside: 'success',
  left: 'neutral',
};

/**
 * Where the child is today: the sentence from his attendance record ("داخل المعهد منذ 07:55",
 * "غادر الساعة 12:30", "لم يصل بعد"...), and while he is inside, the lesson under way and the next
 * one. All times in the institute's zone. Props only.
 */
export function TodayStatusCard({ today, timeZone }: { today: PortalOverview['today']; timeZone: string }) {
  const state = dayState(today);
  const inside = state === 'inside';
  const { current, next } = lessonsAround(today.lessons, clockOf(new Date().toISOString(), timeZone));
  const line = (title: string, lesson: { subject: string; startTime: string; endTime: string; room: string | null } | null) =>
    lesson && (
      <Text size="sm">
        <Text span c="var(--app-text-muted)">
          {title}:{' '}
        </Text>
        {lesson.subject} · {lesson.startTime} - {lesson.endTime}
        {lesson.room ? ` · ${lesson.room}` : ''}
      </Text>
    );

  return (
    <AppSurface level={2} radius="lg" padding="md" tone="brand">
      <Stack gap="xs">
        <Group gap="sm" justify="space-between" wrap="wrap">
          <Text fw={600} size="lg">
            {dayStateText(today, timeZone)}
          </Text>
          <StatusBadge tone={TONES[state]} size="md">
            {labels.statusTitle}
          </StatusBadge>
        </Group>
        {today.attendance.checkInAt && (
          <Text size="sm" c="var(--app-text-muted)">
            {labels.arrivedAt} {clockOf(today.attendance.checkInAt, timeZone)}
            {today.attendance.checkOutAt ? ` · ${labels.leftAt} ${clockOf(today.attendance.checkOutAt, timeZone)}` : ''}
          </Text>
        )}
        {inside && (
          <Stack gap={2}>
            {line(labels.now, current)}
            {line(labels.next, next)}
            {!current && !next && today.lessons.length > 0 && <Text size="sm">{labels.noMoreLessons}</Text>}
          </Stack>
        )}
      </Stack>
    </AppSurface>
  );
}
