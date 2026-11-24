'use client';

import { Center, Loader, SimpleGrid, Stack, Text } from '@mantine/core';
import { IconCash, IconChartBar, IconCalendarCheck } from '@tabler/icons-react';
import { AppSurface, InfoTile, StatusBadge } from '@/src/components/controllers';
import { formatDate, formatMoney } from '@/src/core/format';
import { usePortalMirror } from '../store/portal.store';
import { todayLabels as labels } from '../static-data/portal.data';
import { percentText } from '../utils/portal.utils';
import { TodayStatusCard } from './TodayStatusCard';

/** The child's day: where he is now, the 30-day attendance, marks, the next installment, today's lessons. ZERO useState hooks. */
export function TodayTab() {
  const slot = usePortalMirror('slots').overview;
  const timeZone = usePortalMirror('timeZone');
  const o = slot.data;
  if (!o) {
    return slot.isLoading ? (
      <Center py="xl">
        <Loader size="sm" color="primary" />
      </Center>
    ) : null;
  }
  const due = o.finance?.nextDue;

  return (
    <Stack gap="md">
      <TodayStatusCard today={o.today} timeZone={timeZone} />
      <SimpleGrid cols={{ base: 1, sm: o.finance ? 3 : 2 }} spacing="md">
        <InfoTile label={labels.rate30} value={percentText(o.attendance30d.ratePercent)} icon={<IconCalendarCheck size={20} />} tone="brand" />
        <InfoTile label={labels.average} value={percentText(o.marks.averagePercent)} icon={<IconChartBar size={20} />} tone="ink" />
        {o.finance && (
          <InfoTile
            label={labels.nextDue}
            value={due ? formatMoney(due.amount, due.currency) : labels.noDue}
            hint={due ? formatDate(due.dueDate) : undefined}
            icon={<IconCash size={20} />}
            tone={due ? 'danger' : 'success'}
          />
        )}
      </SimpleGrid>
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
        <AppSurface level={2} radius="lg" padding="md">
          <Text fw={600} size="sm" mb="xs">
            {labels.lessonsTitle}
          </Text>
          {o.today.lessons.length === 0 ? (
            <Text size="sm" c="var(--app-text-muted)">
              {labels.noLessons}
            </Text>
          ) : (
            <Stack gap={6}>
              {o.today.lessons.map((l) => (
                <Text key={l.id} size="sm">
                  {l.startTime} - {l.endTime} · {l.subject}
                  {l.room ? ` · ${l.room}` : ''}
                </Text>
              ))}
            </Stack>
          )}
        </AppSurface>
        <AppSurface level={2} radius="lg" padding="md">
          <Text fw={600} size="sm" mb="xs">
            {labels.latestMarks}
          </Text>
          {o.marks.latest.length === 0 ? (
            <Text size="sm" c="var(--app-text-muted)">
              {labels.none}
            </Text>
          ) : (
            <Stack gap={6}>
              {o.marks.latest.map((m) => (
                <Text key={m.examId} size="sm">
                  {m.subject} - {m.title}: {m.score}/{m.max}{' '}
                  <StatusBadge size="xs" tone={m.percent >= 50 ? 'success' : 'danger'}>
                    {percentText(m.percent)}
                  </StatusBadge>
                </Text>
              ))}
            </Stack>
          )}
          {o.marks.upcoming.length > 0 && (
            <>
              <Text fw={600} size="sm" mt="md" mb="xs">
                {labels.upcomingExams}
              </Text>
              <Stack gap={6}>
                {o.marks.upcoming.map((e) => (
                  <Text key={e.examId} size="sm">
                    {formatDate(e.date)} · {e.subject} - {e.title}
                  </Text>
                ))}
              </Stack>
            </>
          )}
        </AppSurface>
      </SimpleGrid>
    </Stack>
  );
}
