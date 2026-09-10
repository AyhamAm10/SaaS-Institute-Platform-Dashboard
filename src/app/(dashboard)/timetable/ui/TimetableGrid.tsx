'use client';

import {
  Badge,
  Card,
  Center,
  Loader,
  Paper,
  Stack,
  Table,
  Text,
} from '@mantine/core';
import { IconCalendarOff } from '@tabler/icons-react';
import { TimetableEntry } from '@/src/core/api';
import { useTimetableMirror } from '../store/useTimetableMirror';
import { TimetableCell } from './TimetableCell';

const dayNames: Record<number, string> = {
  0: 'الأحد',
  1: 'الإثنين',
  2: 'الثلاثاء',
  3: 'الأربعاء',
  4: 'الخميس',
  5: 'الجمعة',
  6: 'السبت',
};

interface TimetableGridProps {
  onToggleLock: (entry: TimetableEntry) => void;
  onDeleteEntry: (entry: TimetableEntry) => void;
}

export function TimetableGrid({ onToggleLock, onDeleteEntry }: TimetableGridProps) {
  const sectionId = useTimetableMirror('sectionId');
  const timetable = useTimetableMirror('timetable');
  const scheduleConfig = useTimetableMirror('scheduleConfig');
  const isLoading = useTimetableMirror('isLoading');

  if (!sectionId) {
    return (
      <Card radius="xl" withBorder p="xl">
        <Center py="xl">
          <Stack align="center" gap="xs">
            <IconCalendarOff size={48} color="var(--mantine-color-gray-4)" />
            <Text fw={700} size="md" c="dimmed">
              يرجى اختيار الشُعبة الدراسية لعرض جدولها الأسبوعي
            </Text>
            <Text size="xs" c="dimmed">
              اختر السنة الدراسية ثم الشُعبة من شريط الأدوات أعلاه
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
            <Loader size="md" color="indigo" />
            <Text size="sm" c="dimmed" fw={600}>
              جاري تحميل الجدول الدراسي...
            </Text>
          </Stack>
        </Center>
      </Card>
    );
  }

  const workingDays = scheduleConfig?.workingDays || [0, 1, 2, 3, 4];
  const slots = scheduleConfig?.slots || [];
  const entries = timetable?.entries || [];

  return (
    <Card radius="xl" withBorder p="md">
      <Table.ScrollContainer minWidth={850}>
        <Table withTableBorder withColumnBorders verticalSpacing="sm" horizontalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ width: 140, textAlign: 'center' }}>
                الحصة / الوقت
              </Table.Th>
              {workingDays.map((day) => (
                <Table.Th key={day} style={{ textAlign: 'center' }}>
                  <Text fw={700} size="sm">
                    {dayNames[day] || `يوم ${day}`}
                  </Text>
                </Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {slots.map((slot, sIdx) => {
              const isBreak = slot.type === 'BREAK';

              return (
                <Table.Tr
                  key={sIdx}
                  bg={isBreak ? 'var(--mantine-color-orange-0)' : undefined}
                >
                  {/* Row Header: Slot Period & Time */}
                  <Table.Td style={{ textAlign: 'center' }}>
                    <Stack gap={2} align="center">
                      <Badge
                        size="xs"
                        variant={isBreak ? 'filled' : 'light'}
                        color={isBreak ? 'orange' : 'blue'}
                        radius="xl"
                      >
                        {isBreak ? 'استراحة' : `الحصة ${slot.periodNumber}`}
                      </Badge>
                      <Text size="11px" fw={700} dir="ltr">
                        {slot.startTime} - {slot.endTime}
                      </Text>
                    </Stack>
                  </Table.Td>

                  {/* Day Columns */}
                  {workingDays.map((day) => {
                    // Match entry for this day and slot start time
                    const matchingEntry = entries.find(
                      (e) => e.dayOfWeek === day && e.startTime === slot.startTime,
                    );

                    return (
                      <Table.Td key={day} p={4} style={{ verticalAlign: 'stretch' }}>
                        <TimetableCell
                          dayOfWeek={day}
                          slot={slot}
                          entry={matchingEntry}
                          onToggleLock={onToggleLock}
                          onDeleteEntry={onDeleteEntry}
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
