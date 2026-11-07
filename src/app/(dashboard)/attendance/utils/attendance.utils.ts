import type {
  AttendanceRecord,
  BulkAttendanceResult,
  DailyAttendanceRow,
  UpdateAttendancePayload,
} from '@/src/core/api';
import type { EditForm, Notice } from '../state/attendance.state';

/**
 * Attendance helpers. Times are shown and edited in the INSTITUTE time zone
 * (from the signed-in user's institute), never the browser's; the server
 * stores UTC instants. Without a zone the browser's is used.
 */

const pad = (n: number) => String(n).padStart(2, '0');

function zonedParts(at: Date, timeZone?: string) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    })
      .formatToParts(at)
      .map((p) => [p.type, p.value]),
  );
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    time: `${parts.hour}:${parts.minute}`,
  };
}

/** Today as `YYYY-MM-DD` in the institute time zone. */
export function localToday(now: Date = new Date(), timeZone?: string): string {
  if (!timeZone) return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  return zonedParts(now, timeZone).date;
}

/** ISO instant → `HH:mm` in the institute time zone ('' when missing). */
export function toTime(value: string | null | undefined, timeZone?: string): string {
  if (!value) return '';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? '' : zonedParts(d, timeZone).time;
}

/** Institute-local date + `HH:mm` → ISO instant (null when the time is empty). */
export function toInstant(date: string, time: string, timeZone?: string): string | null {
  const t = time.trim();
  if (!t) return null;
  if (!timeZone) return new Date(`${date}T${t}:00`).toISOString();
  // Read the wall clock as UTC, then shift by the zone offset at that instant
  const guess = new Date(`${date}T${t}:00.000Z`);
  const local = zonedParts(guess, timeZone);
  const localAsUtc = Date.parse(`${local.date}T${local.time}:00.000Z`);
  return new Date(guess.getTime() - (localAsUtc - guess.getTime())).toISOString();
}

export function isValidTime(time: string): boolean {
  return time.trim() === '' || /^([01]\d|2[0-3]):[0-5]\d$/.test(time.trim());
}

/** What can be done on a row of the day roster. */
export function rowActions(row: DailyAttendanceRow) {
  const r = row.record;
  return {
    canCheckIn: !r?.checkInAt,
    canCheckOut: Boolean(r?.checkInAt && !r.checkOutAt),
    canExcuse: !r?.checkInAt && r?.status !== 'EXCUSED',
    canEdit: Boolean(r),
  };
}

export function editFormFrom(record: AttendanceRecord, timeZone?: string): EditForm {
  return {
    checkIn: toTime(record.checkInAt, timeZone),
    checkOut: toTime(record.checkOutAt, timeZone),
    status: record.status,
    note: record.note ?? '',
  };
}

export function toUpdatePayload(
  form: EditForm,
  record: AttendanceRecord,
  timeZone?: string,
): UpdateAttendancePayload {
  const date = record.date.slice(0, 10);
  const checkInChanged = form.checkIn !== toTime(record.checkInAt, timeZone);
  return {
    checkInAt: toInstant(date, form.checkIn, timeZone),
    checkOutAt: toInstant(date, form.checkOut, timeZone),
    // When only the check-in time changed, the server recomputes PRESENT / LATE
    ...(!(checkInChanged && form.status === record.status) && { status: form.status }),
    note: form.note.trim() || null,
  };
}

/** Bulk result → one notice (names of skipped students with the reason). */
export function bulkNotice(result: BulkAttendanceResult, rows: DailyAttendanceRow[], done: string): Notice {
  const names = new Map(rows.map((r) => [r.student.id, r.student.fullName]));
  if (result.skipped.length === 0) return { tone: 'success', text: `${done}: ${result.done.length}` };
  const skipped = result.skipped.map((s) => `${names.get(s.studentId) ?? s.studentId} (${s.reason})`);
  return {
    tone: result.done.length > 0 ? 'warning' : 'error',
    text: `${done}: ${result.done.length} — لم يتم: ${skipped.join('، ')}`,
  };
}
