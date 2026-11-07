import { describe, it } from 'node:test';
import assert from 'node:assert';
import type { ExamSheet } from '@/src/core/api';
import {
  EMPTY_EXAM_FORM,
  entriesFrom,
  liveStats,
  liveStatus,
  markError,
  toResultEntries,
  toUpdateExamPayload,
  validateExamForm,
} from '../utils/exams.utils';
import { createExamsStore } from '../store/exams.store';
import { createMarkSheetStore } from '../[id]/results/store/mark-sheet.store';

const sheet = {
  exam: { maxMark: '100', passMark: '50' },
  rows: [
    {
      student: { id: 1, fullName: 'أ', familyName: null },
      eligible: true,
      result: { id: 1, mark: 80, status: 'PASSED' },
    },
    {
      student: { id: 2, fullName: 'ب', familyName: null },
      eligible: true,
      result: { id: 2, mark: null, status: 'ABSENT' },
    },
    {
      student: { id: 3, fullName: 'ج', familyName: null },
      eligible: true,
      result: null,
    },
  ],
  stats: {},
} as unknown as ExamSheet;

describe('exam form', () => {
  it('validates required fields and the mark bounds', () => {
    const errors = validateExamForm({ ...EMPTY_EXAM_FORM, passMark: '120' }, true);
    assert.deepStrictEqual(Object.keys(errors).sort(), ['examDate', 'passMark', 'sectionId', 'subjectId', 'title']);
    assert.strictEqual('sectionId' in validateExamForm(EMPTY_EXAM_FORM, false), false);
  });

  it('never sends the section or subject on update', () => {
    const payload = toUpdateExamPayload({
      ...EMPTY_EXAM_FORM,
      sectionId: '1',
      subjectId: '2',
      title: 'x',
      examDate: '2026-11-10',
    });
    assert.strictEqual('sectionId' in payload, false);
    assert.strictEqual('subjectId' in payload, false);
  });
});

describe('mark sheet', () => {
  it('loads entries and computes the live status like the server', () => {
    const entries = entriesFrom(sheet);
    assert.deepStrictEqual(entries[2], { mark: '', absent: true });
    assert.strictEqual(liveStatus({ mark: '50', absent: false }, 50), 'PASSED');
    assert.strictEqual(liveStatus({ mark: '49.5', absent: false }, 50), 'FAILED');
    assert.strictEqual(liveStatus({ mark: '', absent: false }, 50), 'PENDING');
  });

  it('flags marks out of range or with too many decimals', () => {
    assert.strictEqual(markError({ mark: '101', absent: false }, 100), 'بين 0 و 100');
    assert.ok(markError({ mark: '10.555', absent: false }, 100));
    assert.strictEqual(markError({ mark: '101', absent: true }, 100), '');
  });

  it('builds the save payload and live stats', () => {
    const entries = { ...entriesFrom(sheet), 3: { mark: '40', absent: false } };
    assert.deepStrictEqual(
      toResultEntries(entries).find((e) => e.studentId === 2),
      {
        studentId: 2,
        absent: true,
        mark: null,
      },
    );
    const stats = liveStats(entries, 50);
    assert.strictEqual(stats.passed, 1);
    assert.strictEqual(stats.failed, 1);
    assert.strictEqual(stats.absent, 1);
    assert.strictEqual(stats.average, 60);
  });

  it('keeps edits when the server data refreshes, and resets after a save', () => {
    const store = createMarkSheetStore();
    store.getState().syncSheet(sheet, false);
    store.getState().setMark(3, '70');
    store.getState().syncSheet(sheet, false);
    assert.strictEqual(store.getState().entries[3].mark, '70');
    store.getState().syncSheet(sheet, false, true);
    assert.strictEqual(store.getState().entries[3].mark, '');
    assert.strictEqual(store.getState().dirty, false);
  });
});

describe('ExamsStore', () => {
  it('resets the subject when the drawer section changes', () => {
    const store = createExamsStore();
    store.getState().openCreate();
    store.getState().setField('sectionId', '1');
    store.getState().setField('subjectId', '5');
    store.getState().setField('sectionId', '2');
    assert.strictEqual(store.getState().form.subjectId, null);
  });
});
