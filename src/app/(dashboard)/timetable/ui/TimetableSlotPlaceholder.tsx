'use client';

import { Card, Stack, Text } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { ScheduleSlot } from '@/src/core/api';
import { StatusBadge } from '@/src/components/controllers/badge';
import { AppIconButton } from '@/src/components/controllers/button';
import { useTimetableMirror } from '../store/useTimetableMirror';

/** A break slot. */
export function TimetableBreakCard({ slot }: { slot: ScheduleSlot }) {
  return (
    <Card
      p="xs"
      radius="md"
      withBorder
      bg="var(--app-brand-accent-soft)"
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
        <StatusBadge tone="warning" size="xs">
          استراحة
        </StatusBadge>
        <Text size="xs" fw={500} c="var(--app-brand-accent-text)">
          {slot.name || 'فسحة'}
        </Text>
      </Stack>
    </Card>
  );
}

/** An empty lesson slot: read-only dash, or a click target that opens the entry modal. */
export function TimetableEmptySlot({
  dayOfWeek,
  slot,
  canManage,
}: {
  dayOfWeek: number;
  slot: ScheduleSlot;
  canManage: boolean;
}) {
  const openCreateEntryModal = useTimetableMirror('openCreateEntryModal');

  if (!canManage) {
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
          borderColor: 'var(--app-border)',
          backgroundColor: 'var(--app-subtle)',
        }}
      >
        <Text size="xs" c="dimmed">
          —
        </Text>
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
        borderColor: 'var(--app-border)',
        backgroundColor: 'var(--app-subtle)',
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
      <AppIconButton variant="ghost" label="إضافة حصة دراسية في هذه الخانة" size="sm">
        <IconPlus size={16} />
      </AppIconButton>
    </Card>
  );
}
