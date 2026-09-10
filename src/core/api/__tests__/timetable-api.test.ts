import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ConflictType } from '../timetables.api';

describe('Timetable API Models', () => {
  it('defines all required conflict types', () => {
    assert.equal(ConflictType.TEACHER_DOUBLE_BOOKING, 'TEACHER_DOUBLE_BOOKING');
    assert.equal(ConflictType.SECTION_DOUBLE_BOOKING, 'SECTION_DOUBLE_BOOKING');
    assert.equal(ConflictType.ROOM_DOUBLE_BOOKING, 'ROOM_DOUBLE_BOOKING');
    assert.equal(ConflictType.TEACHER_UNAVAILABLE, 'TEACHER_UNAVAILABLE');
    assert.equal(ConflictType.ROOM_UNAVAILABLE, 'ROOM_UNAVAILABLE');
    assert.equal(ConflictType.TEACHER_NOT_QUALIFIED, 'TEACHER_NOT_QUALIFIED');
    assert.equal(ConflictType.SCHEDULE_CONFIG_VIOLATION, 'SCHEDULE_CONFIG_VIOLATION');
    assert.equal(ConflictType.WEEKLY_PERIODS_MISMATCH, 'WEEKLY_PERIODS_MISMATCH');
  });
});
