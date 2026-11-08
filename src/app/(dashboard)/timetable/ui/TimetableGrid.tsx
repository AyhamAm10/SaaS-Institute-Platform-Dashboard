'use client';

import { Card, Center, Loader, Stack, Table, Text } from '@mantine/core';
import { IconCalendarOff } from '@tabler/icons-react';
import { TimetableEntry } from '@/src/core/api';
import { sortWeekDays, weekDayName } from '@/src/core/format';
import { useTimetableMirror } from '../store/useTimetableMirror';
import { TimetableCell } from './TimetableCell';
import { StatusBadge } from '@/src/components/controllers/badge';

interface TimetableGridProps {
  onToggleLock: (entry: TimetableEntry) => void;
  onDeleteEntry: (entry: TimetableEntry) => void;
  canManage?: boolean;
}

export function TimetableGrid({ onToggleLock, onDeleteEntry, canManage = true }: TimetableGridProps) {
  const sectionId = useTimetableMirror('sectionId');
  const timetable = useTimetableMirror('timetable');
  const scheduleConfig = useTimetableMirror('scheduleConfig');
  const isLoading = useTimetableMirror('isLoading');

  if (!sectionId) {
    return (
      <Card radius="xl" withBorder p="xl">
        <Center py="xl">
          <Stack align="center" gap="xs">
            <IconCalendarOff size={48} color="var(--app-text-muted)" />
            <Text fw={500} size="md" c="dimmed">
              يرجى اختيار الشعبة الدراسية لعرض جدولها الأسبوعي
            </Text>
            <Text size="xs" c="dimmed">
              اختر السنة الدراسية ثم الشعبة من شريط الأدوات أعلاه
            </Text>
          </Stack>
        </Center>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card radius="xl" withBorder p="xl">
        <Center py="xl">
          <Stack align="center" gap="md">
            <Loader size="md" color="brand" />
            <Text size="sm" c="dimmed" fw={500}>
              جاري تحميل الجدول الدراسي...
            </Text>
          </Stack>
        </Center>
      </Card>
    );
  }

  const workingDays = sortWeekDays(scheduleConfig?.workingDays || [6, 0, 1, 2, 3, 4]);
  const slots = scheduleConfig?.slots || [];
  const entries = timetable?.entries || [];

  return (
    <Card radius="xl" withBorder p="md">
      <Table.ScrollContainer minWidth={850}>
        <Table
          withTableBorder
          withColumnBorders
          verticalSpacing="sm"
          horizontalSpacing="sm"
          style={{ borderColor: 'var(--app-table-border)' }}
        >
          <Table.Thead
            style={{ backgroundColor: 'var(--app-table-header-bg)', borderBottom: '1px solid var(--app-table-border)' }}
          >
            <Table.Tr style={{ borderColor: 'var(--app-table-border)' }}>
              <Table.Th
                style={{
                  width: 140,
                  textAlign: 'center',
                  color: 'var(--app-text-secondary)',
                  borderColor: 'var(--app-table-border)',
                }}
              >
                الحصة / الوقت
              </Table.Th>
              {workingDays.map((day) => (
                <Table.Th
                  key={day}
                  style={{
                    textAlign: 'center',
                    color: 'var(--app-text-secondary)',
                    borderColor: 'var(--app-table-border)',
                  }}
                >
                  <Text fw={500} size="sm">
                    {weekDayName(day)}
                  </Text>
                </Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {slots.map((slot, sIdx) => {
              const isBreak = slot.type === 'BREAK';

              return (
                <Table.Tr key={sIdx} bg={isBreak ? 'var(--app-brand-accent-soft)' : undefined}>
                  {/* Row Header: Slot Period & Time */}
                  <Table.Td style={{ textAlign: 'center' }}>
                    <Stack gap={2} align="center">
                      <StatusBadge tone={isBreak ? 'warning' : 'info'} variant={isBreak ? 'solid' : 'soft'} size="xs">
                        {isBreak ? 'استراحة' : `الحصة ${slot.periodNumber}`}
                      </StatusBadge>
                      <Text size="11px" fw={500} dir="ltr">
                        {slot.startTime} - {slot.endTime}
                      </Text>
                    </Stack>
                  </Table.Td>

                  {/* Day Columns */}
                  {workingDays.map((day) => {
                    // Match entry for this day and slot start time
                    const matchingEntry = entries.find((e) => e.dayOfWeek === day && e.startTime === slot.startTime);

                    return (
                      <Table.Td key={day} p={4} style={{ verticalAlign: 'stretch' }}>
                        <TimetableCell
                          dayOfWeek={day}
                          slot={slot}
                          entry={matchingEntry}
                          onToggleLock={onToggleLock}
                          onDeleteEntry={onDeleteEntry}
                          canManage={canManage}
                        />
                      </Table.Td>
                    );
                  })}
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Card>
  );
}
