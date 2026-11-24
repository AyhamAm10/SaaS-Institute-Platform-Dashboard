import type { PortalLesson, PortalOverview } from '@/src/core/api';
import { todayLabels } from '../static-data/portal.data';

/** `HH:mm` of an instant in the institute's time zone ('—' when none). */
export function clockOf(iso: string | null | undefined, timeZone: string): string {
  if (!iso) return todayLabels.none;
  return new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone }).format(new Date(iso));
}

/** Minutes since midnight of an `HH:mm` string. */
export function minutesOf(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

/** The lesson under way at `nowHHmm` and the next one that has not started (today's lessons, any order). */
export function lessonsAround(lessons: PortalLesson[], nowHHmm: string): { current: PortalLesson | null; next: PortalLesson | null } {
  const now = minutesOf(nowHHmm);
  const sorted = [...lessons].sort((a, b) => minutesOf(a.startTime) - minutesOf(b.startTime));
  const current = sorted.find((l) => minutesOf(l.startTime) <= now && now < minutesOf(l.endTime)) ?? null;
  const next = sorted.find((l) => minutesOf(l.startTime) > now) ?? null;
  return { current, next };
}

export type DayState = 'noSchool' | 'notArrived' | 'absent' | 'excused' | 'inside' | 'left';

/** Where the child is today, from the attendance record (the server's own status, never guessed). */
export function dayState(today: PortalOverview['today']): DayState {
  const a = today.attendance;
  if (!today.isWorkingDay) return 'noSchool';
  if (a.status === 'ABSENT') return 'absent';
  if (a.status === 'EXCUSED') return 'excused';
  if (a.status === 'PRESENT' || a.status === 'LATE') return a.checkOutAt ? 'left' : 'inside';
  return 'notArrived';
}

/** The sentence for the state card, with the times in the institute's zone. */
export function dayStateText(today: PortalOverview['today'], timeZone: string): string {
  const state = dayState(today);
  const a = today.attendance;
  switch (state) {
    case 'noSchool':
      return todayLabels.noSchool;
    case 'absent':
      return todayLabels.absent;
    case 'excused':
      return todayLabels.excused;
    case 'left':
      return todayLabels.left(clockOf(a.checkOutAt, timeZone));
    case 'inside':
      return a.status === 'LATE' ? todayLabels.late(clockOf(a.checkInAt, timeZone)) : todayLabels.inside(clockOf(a.checkInAt, timeZone));
    default:
      return todayLabels.notArrived;
  }
}

/** The last `count` months (newest first) as `YYYY-MM` with an Arabic name, for the attendance month picker. */
export function monthOptions(count: number, from: Date = new Date()): { value: string; label: string }[] {
  const formatter = new Intl.DateTimeFormat('ar-u-nu-latn', { month: 'long', year: 'numeric', timeZone: 'UTC' });
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth() - i, 1));
    return { value: `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`, label: formatter.format(d) };
  });
}

/** A percentage for display ('—' when none). */
export function percentText(value: number | null | undefined): string {
  return value === null || value === undefined ? todayLabels.none : `${value}%`;
}
