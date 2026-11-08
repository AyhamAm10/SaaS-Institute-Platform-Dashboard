'use client';

import { ScheduleSlot, TimetableEntry } from '@/src/core/api';
import { TimetableLessonCard } from './TimetableLessonCard';
import { TimetableBreakCard, TimetableEmptySlot } from './TimetableSlotPlaceholder';

interface TimetableCellProps {
  dayOfWeek: number;
  slot: ScheduleSlot;
  entry?: TimetableEntry;
  onToggleLock: (entry: TimetableEntry) => void;
  onDeleteEntry: (entry: TimetableEntry) => void;
  canManage?: boolean;
}

export function TimetableCell({
  dayOfWeek,
  slot,
  entry,
  onToggleLock,
  onDeleteEntry,
  canManage = true,
}: TimetableCellProps) {
  if (slot.type === 'BREAK') return <TimetableBreakCard slot={slot} />;
  if (entry) {
    return (
      <TimetableLessonCard
        entry={entry}
        onToggleLock={onToggleLock}
        onDeleteEntry={onDeleteEntry}
        canManage={canManage}
      />
    );
  }
  return <TimetableEmptySlot dayOfWeek={dayOfWeek} slot={slot} canManage={canManage} />;
}
