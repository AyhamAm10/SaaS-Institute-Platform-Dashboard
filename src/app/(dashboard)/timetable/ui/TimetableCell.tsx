'use client';

import {
  ActionIcon,
  Badge,
  Card,
  Group,
  Stack,
  Text,
  ThemeIcon,
  Tooltip,
} from '@mantine/core';
import {
  IconBook,
  IconBuildingCommunity,
  IconEdit,
  IconLock,
  IconLockOpen,
  IconPlus,
  IconTrash,
  IconUser,
} from '@tabler/icons-react';
import { ScheduleSlot, TimetableEntry } from '@/src/core/api';
import { useTimetableMirror } from '../store/useTimetableMirror';

interface TimetableCellProps {
  dayOfWeek: number;
  slot: ScheduleSlot;
  entry?: TimetableEntry;
  onToggleLock: (entry: TimetableEntry) => void;
  onDeleteEntry: (entry: TimetableEntry) => void;
}

export function TimetableCell({
  dayOfWeek,
  slot,
  entry,
  onToggleLock,
  onDeleteEntry,
}: TimetableCellProps) {
  const openCreateEntryModal = useTimetableMirror('openCreateEntryModal');
  const openEditEntryModal = useTimetableMirror('openEditEntryModal');

  const isBreak = slot.type === 'BREAK';

  if (isBreak) {
    return (
      <Card
        p="xs"
        radius="md"
        withBorder
        bg="var(--mantine-color-orange-0)"
        h="100%"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 90,
          borderStyle: 'dashed',
        }}
      >
        <Stack align="center" gap={2}>
          <Badge size="xs" color="orange" variant="light">
            استراحة
          </Badge>
          <Text size="xs" fw={700} c="orange.8">
            {slot.name || 'فسحة'}
          </Text>
        </Stack>
      </Card>
    );
  }

  // If entry exists, render scheduled lesson card
  if (entry) {
    return (
      <Card
        p="xs"
        radius="md"
        withBorder
        h="100%"
        style={{
          minHeight: 90,
          backgroundColor: entry.isLocked
            ? 'var(--mantine-color-indigo-0)'
            : 'var(--mantine-color-blue-0)',
          borderColor: entry.isLocked
            ? 'var(--mantine-color-indigo-4)'
            : 'var(--mantine-color-blue-2)',
          position: 'relative',
        }}
      >
        <Stack justify="space-between" h="100%" gap="xs">
          {/* Top Row: Subject Name & Lock */}
          <Group justify="space-between" align="flex-start" wrap="nowrap">
            <Group gap={4} wrap="nowrap">
              <ThemeIcon size="xs" color="blue" variant="light" radius="xl">
                <IconBook size={12} />
              </ThemeIcon>
              <Text size="xs" fw={800} lineClamp={1}>
                {entry.subject?.name || `مادة ${entry.subjectId}`}
              </Text>
            </Group>

            <Tooltip label={entry.isLocked ? 'حصة مثبتة (محمية من التوليد الآلي)' : 'تثبيت الحصة'}>
              <ActionIcon
                size="xs"
                variant="subtle"
                color={entry.isLocked ? 'indigo' : 'gray'}
                onClick={() => onToggleLock(entry)}
              >
                {entry.isLocked ? <IconLock size={14} /> : <IconLockOpen size={14} />}
              </ActionIcon>
            </Tooltip>
          </Group>

          {/* Middle Details: Teacher & Room */}
          <Stack gap={2}>
            <Group gap={4} wrap="nowrap">
              <IconUser size={12} color="gray" />
              <Text size="11px" c="dimmed" lineClamp={1}>
                {entry.teacher?.user?.fullName || 'معلم غير محدد'}
              </Text>
            </Group>

            {entry.room && (
              <Group gap={4} wrap="nowrap">
                <IconBuildingCommunity size={12} color="gray" />
                <Text size="11px" c="dimmed" lineClamp={1}>
                  {entry.room.name}
                </Text>
              </Group>
            )}
          </Stack>

          {/* Bottom Actions Bar */}
          <Group justify="flex-end" gap={4}>
            <Tooltip label="تعديل الحصة">
              <ActionIcon
                size="xs"
                variant="subtle"
                color="blue"
                onClick={() => openEditEntryModal(entry)}
              >
                <IconEdit size={12} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="حذف الحصة">
              <ActionIcon
                size="xs"
                variant="subtle"
                color="red"
                onClick={() => onDeleteEntry(entry)}
              >
                <IconTrash size={12} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Stack>
      </Card>
    );
  }

  // Empty Slot
  return (
    <Card
      p="xs"
      radius="md"
      withBorder
      h="100%"
      style={{
        minHeight: 90,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderStyle: 'dashed',
        backgroundColor: 'var(--mantine-color-gray-0)',
        cursor: 'pointer',
      }}
      onClick={() =>
        openCreateEntryModal({
          dayOfWeek,
          periodNumber: slot.periodNumber || 1,
          startTime: slot.startTime,
          endTime: slot.endTime,
        })
      }
    >
      <Tooltip label="إضافة حصة دراسية في هذه الخانة">
        <ActionIcon variant="subtle" color="gray" radius="xl" size="sm">
          <IconPlus size={16} />
        </ActionIcon>
      </Tooltip>
    </Card>
  );
}
