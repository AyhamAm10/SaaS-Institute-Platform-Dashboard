import { describe, it } from 'node:test';
import assert from 'node:assert';
import type { PortalLesson, PortalMe, PortalOverview } from '@/src/core/api';
import { createPortalStore } from '../store/portal.store';
import { clockOf, dayState, dayStateText, lessonsAround, minutesOf, monthOptions, percentText } from '../utils/portal.utils';

const TZ = 'Asia/Damascus';
const lesson = (id: number, startTime: string, endTime: string): PortalLesson => ({ id, subject: `م${id}`, startTime, endTime, room: null, teacher: null });
type Today = PortalOverview['today'];
const today = (over: Partial<Omit<Today, 'attendance'>> & { attendance?: Partial<Today['attendance']> }): Today => ({
  date: '2026-11-18',
  isWorkingDay: true,
  lessons: [],
  ...over,
  attendance: { status: null, checkInAt: null, checkOutAt: null, ...over.attendance },
});

describe('portal: where the child is today', () => {
  it('reads the state from the attendance record, never guesses', () => {
    assert.strictEqual(dayState(today({ isWorkingDay: false })), 'noSchool');
    assert.strictEqual(dayState(today({})), 'notArrived');
    assert.strictEqual(dayState(today({ attendance: { status: 'ABSENT' } })), 'absent');
    assert.strictEqual(dayState(today({ attendance: { status: 'EXCUSED' } })), 'excused');
    assert.strictEqual(dayState(today({ attendance: { status: 'PRESENT', checkInAt: '2026-11-18T04:55:00Z' } })), 'inside');
    assert.strictEqual(dayState(today({ attendance: { status: 'LATE', checkInAt: '2026-11-18T05:20:00Z' } })), 'inside');
    assert.strictEqual(dayState(today({ attendance: { status: 'PRESENT', checkInAt: '2026-11-18T04:55:00Z', checkOutAt: '2026-11-18T09:30:00Z' } })), 'left');
  });

  it('shows the times in the institute zone (UTC+3), not the browser zone', () => {
    assert.strictEqual(clockOf('2026-11-18T04:55:00Z', TZ), '07:55');
    assert.strictEqual(clockOf('2026-11-18T20:59:00Z', TZ), '23:59');
    assert.strictEqual(clockOf('2026-11-18T21:00:00Z', TZ), '00:00'); // the next local day
    assert.strictEqual(clockOf(null, TZ), '—');
  });

  it('says it in words: inside since, late, left at, not yet', () => {
    const inside = today({ attendance: { status: 'PRESENT', checkInAt: '2026-11-18T04:55:00Z' } });
    assert.strictEqual(dayStateText(inside, TZ), 'داخل المعهد منذ 07:55');
    assert.strictEqual(dayStateText(today({ attendance: { status: 'LATE', checkInAt: '2026-11-18T05:20:00Z' } }), TZ), 'وصل متأخراً الساعة 08:20');
    assert.strictEqual(dayStateText(today({ attendance: { status: 'PRESENT', checkInAt: '2026-11-18T04:55:00Z', checkOutAt: '2026-11-18T09:30:00Z' } }), TZ), 'غادر الساعة 12:30');
    assert.strictEqual(dayStateText(today({}), TZ), 'لم يصل بعد');
    assert.strictEqual(dayStateText(today({ isWorkingDay: false }), TZ), 'لا دوام اليوم');
  });

  it('finds the lesson under way and the next one (the end of a lesson is not inside it)', () => {
    const lessons = [lesson(3, '10:45', '11:30'), lesson(1, '08:00', '08:45'), lesson(2, '08:45', '09:30')];
    assert.deepStrictEqual([lessonsAround(lessons, '08:44').current?.id, lessonsAround(lessons, '08:44').next?.id], [1, 2]);
    assert.deepStrictEqual([lessonsAround(lessons, '08:45').current?.id, lessonsAround(lessons, '08:45').next?.id], [2, 3]); // 08:45 starts the second
    assert.deepStrictEqual([lessonsAround(lessons, '10:00').current, lessonsAround(lessons, '10:00').next?.id], [null, 3]); // the break
    assert.deepStrictEqual([lessonsAround(lessons, '11:30').current, lessonsAround(lessons, '11:30').next], [null, null]);
    assert.strictEqual(minutesOf('09:05'), 545);
  });
});

describe('portal: months and numbers', () => {
  it('lists the last 12 months, newest first, across a year end', () => {
    const list = monthOptions(12, new Date(Date.UTC(2027, 1, 10)));
    assert.deepStrictEqual([list[0].value, list[1].value, list[2].value, list[11].value], ['2027-02', '2027-01', '2026-12', '2026-03']);
  });

  it('shows a percentage or a dash', () => {
    assert.strictEqual(percentText(87.5), '87.5%');
    assert.strictEqual(percentText(0), '0%');
    assert.strictEqual(percentText(null), '—');
  });
});

describe('portal store', () => {
  const me = (ids: number[]): PortalMe => ({
    role: 'FAMILY',
    displayName: 'الخطيب',
    children: ids.map((id) => ({ id, fullName: `طالب ${id}`, gender: 'MALE', section: null, branch: { id: 1, name: 'ف' }, statusName: null })),
  });

  it('follows the first child, keeps a later choice, and falls back when the child leaves the list', () => {
    const store = createPortalStore();
    store.getState().syncMe(me([7, 9]), false, TZ);
    assert.strictEqual(store.getState().childId, 7);
    store.getState().selectChild(9);
    store.getState().syncMe(me([7, 9]), false, TZ); // a refetch keeps the choice
    assert.strictEqual(store.getState().childId, 9);
    store.getState().syncMe(me([7]), false, TZ);
    assert.strictEqual(store.getState().childId, 7);
  });

  it('choosing another child goes back to the current month and keeps each slot as the server sent it', () => {
    const store = createPortalStore();
    store.getState().setMonth('2026-10');
    store.getState().selectChild(5);
    assert.strictEqual(store.getState().month, '');
    store.getState().syncSlot('notes', [], false);
    assert.deepStrictEqual(store.getState().slots.notes, { data: [], isLoading: false });
    assert.strictEqual(store.getState().slots.finance.isLoading, true); // untouched until its tab opens
  });
});
