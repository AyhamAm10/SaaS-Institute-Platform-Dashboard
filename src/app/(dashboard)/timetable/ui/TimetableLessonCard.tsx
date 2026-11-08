'use client';

import { Card, Group, Stack, Text, ThemeIcon } from '@mantine/core';
import {
  IconBook,
  IconBuildingCommunity,
  IconEdit,
  IconLock,
  IconLockOpen,
  IconTrash,
  IconUser,
} from '@tabler/icons-react';
import { TimetableEntry } from '@/src/core/api';
import { AppIconButton } from '@/src/components/controllers/button';
import { useTimetableMirror } from '../store/useTimetableMirror';

interface TimetableLessonCardProps {
  entry: TimetableEntry;
  onToggleLock: (entry: TimetableEntry) => void;
  onDeleteEntry: (entry: TimetableEntry) => void;
  canManage: boolean;
}

/** A scheduled lesson: subject, teacher, room, lock and edit / delete actions. */
export function TimetableLessonCard({ entry, onToggleLock, onDeleteEntry, canManage }: TimetableLessonCardProps) {
  const openEditEntryModal = useTimetableMirror('openEditEntryModal');

  return (
    <Card
      p="xs"
      radius="md"
      withBorder
      h="100%"
      style={{
        minHeight: 90,
        backgroundColor: entry.isLocked ? 'var(--app-subtle)' : 'var(--app-surface)',
        borderColor: entry.isLocked ? 'var(--app-brand-accent)' : 'var(--app-border)',
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
            <Text size="xs" fw={500} lineClamp={1}>
              {entry.subject?.name || `مادة ${entry.subjectId}`}
            </Text>
          </Group>

          {canManage ? (
            <AppIconButton
              variant={entry.isLocked ? 'brand' : 'ghost'}
              label={entry.isLocked ? 'حصة مثبتة (محمية من التوليد الآلي)' : 'تثبيت الحصة'}
              size="xs"
              onClick={() => onToggleLock(entry)}
            >
              {entry.isLocked ? <IconLock size={14} /> : <IconLockOpen size={14} />}
            </AppIconButton>
          ) : entry.isLocked ? (
            <ThemeIcon size="xs" variant="subtle" color="indigo">
              <IconLock size={14} />
            </ThemeIcon>
          ) : null}
        </Group>

        {/* Middle Details: Teacher & Room */}
        <Stack gap={2}>
          <Group gap={4} wrap="nowrap">
            <IconUser size={12} color="var(--app-text-secondary)" />
            <Text size="11px" c="dimmed" lineClamp={1}>
              {entry.teacher?.user?.fullName || 'معلم غير محدد'}
            </Text>
          </Group>

          {entry.room && (
            <Group gap={4} wrap="nowrap">
              <IconBuildingCommunity size={12} color="var(--app-text-secondary)" />
              <Text size="11px" c="dimmed" lineClamp={1}>
                {entry.room.name}
              </Text>
            </Group>
          )}
        </Stack>

        {/* Bottom Actions Bar */}
        {canManage && (
          <Group justify="flex-end" gap={4}>
            <AppIconButton variant="ghost" label="تعديل الحصة" size="xs" onClick={() => openEditEntryModal(entry)}>
              <IconEdit size={12} />
            </AppIconButton>

            <AppIconButton variant="danger" label="حذف الحصة" size="xs" onClick={() => onDeleteEntry(entry)}>
              <IconTrash size={12} />
            </AppIconButton>
          </Group>
        )}
      </Stack>
    </Card>
  );
}
