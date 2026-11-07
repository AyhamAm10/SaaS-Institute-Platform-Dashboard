import { describe, it } from 'node:test';
import assert from 'node:assert';
import type { AttendanceRecord, DailyAttendanceRow } from '@/src/core/api';
import {
  bulkNotice,
  editFormFrom,
  isValidTime,
  localToday,
  rowActions,
  toInstant,
  toTime,
  toUpdatePayload,
} from '../utils/attendance.utils';
import { createAttendanceStore } from '../store/attendance.store';

const record = (over: Partial<AttendanceRecord> = {}): AttendanceRecord => ({
  id: 1,
  studentId: 7,
  date: '2026-11-04T00:00:00.000Z',
  checkInAt: null,
  checkOutAt: null,
  status: 'ABSENT',
  checkInMethod: null,
  checkOutMethod: null,
  note: null,
  ...over,
});
const row = (r: AttendanceRecord | null): DailyAttendanceRow => ({
  student: { id: 7, fullName: 'أحمد', familyName: null },
  record: r,
});

describe('attendance utils', () => {
  it('round-trips local times', () => {
    const iso = toInstant('2026-11-04', '08:30')!;
    assert.strictEqual(toTime(iso), '08:30');
    assert.strictEqual(toInstant('2026-11-04', ' '), null);
    assert.strictEqual(localToday(new Date(2026, 0, 5)), '2026-01-05');
  });

  it('validates HH:mm and allows empty', () => {
    assert.ok(isValidTime('08:05'));
    assert.ok(isValidTime(''));
    assert.ok(!isValidTime('8:5'));
    assert.ok(!isValidTime('24:00'));
  });

  it('offers the right actions per row', () => {
    assert.deepStrictEqual(rowActions(row(null)), {
      canCheckIn: true,
      canCheckOut: false,
      canExcuse: true,
      canEdit: false,
    });
    const inside = rowActions(row(record({ status: 'PRESENT', checkInAt: '2026-11-04T05:00:00Z' })));
    assert.strictEqual(inside.canCheckIn, false);
    assert.strictEqual(inside.canCheckOut, true);
    assert.strictEqual(inside.canExcuse, false);
    // An ABSENT mark can still check in late
    assert.strictEqual(rowActions(row(record())).canCheckIn, true);
  });

  it('lets the server recompute the status when only the check-in time changed', () => {
    const r = record({ status: 'PRESENT', checkInAt: toInstant('2026-11-04', '08:00') });
    const form = { ...editFormFrom(r), checkIn: '08:40' };
    assert.strictEqual('status' in toUpdatePayload(form, r), false);
    assert.strictEqual(toUpdatePayload({ ...form, status: 'EXCUSED' }, r).status, 'EXCUSED');
  });

  it('builds the bulk notice with skipped names', () => {
    const notice = bulkNotice({ done: [], skipped: [{ studentId: 7, reason: 'سجّل مسبقاً' }] }, [row(null)], 'تم');
    assert.strictEqual(notice.tone, 'error');
    assert.match(notice.text, /أحمد \(سجّل مسبقاً\)/);
  });
});

describe('AttendanceStore', () => {
  it('selects the first section automatically and opens / closes modals', () => {
    const store = createAttendanceStore();
    store.getState().syncSectionOptions([{ value: '3', label: 'أ' }]);
    assert.strictEqual(store.getState().sectionId, '3');
    store.getState().openEdit(record({ status: 'LATE' }));
    assert.strictEqual(store.getState().editForm.status, 'LATE');
    store.getState().closeModals();
    assert.strictEqual(store.getState().editRecord, null);
  });
});

describe('attendance times in the institute time zone', () => {
  it('shows and parses times in the institute zone, not the browser', () => {
    // 10:55 UTC = 13:55 in Damascus (UTC+3)
    assert.strictEqual(toTime('2026-11-05T10:55:00.000Z', 'Asia/Damascus'), '13:55');
    assert.strictEqual(toInstant('2026-11-05', '08:05', 'Asia/Damascus'), '2026-11-05T05:05:00.000Z');
    assert.strictEqual(localToday(new Date('2026-11-04T22:30:00Z'), 'Asia/Damascus'), '2026-11-05');
  });
});
