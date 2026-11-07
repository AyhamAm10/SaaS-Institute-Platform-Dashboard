import { describe, it } from 'node:test';
import assert from 'node:assert';
import type { SectionRosterItem } from '@/src/core/api';
import {
  availableActions,
  filterRoster,
  initialSubjectChoice,
  inputText,
  statusOfAction,
  summarizeEnrollResult,
  toggleSubjectChoice,
} from '../utils/section-students.utils';
import { createSectionStudentsStore } from '../store/section-students.store';

const row = (over: Partial<SectionRosterItem> = {}): SectionRosterItem => ({
  enrollmentId: 1,
  sectionId: 1,
  status: 'ACTIVE',
  statusReason: null,
  enrolledAt: '2026-09-01',
  student: { id: 1, fullName: 'طالب', gender: 'MALE', familyName: null, phone: null, status: null },
  takesAllSubjects: true,
  subjects: [
    { id: 1, name: 'رياضيات' },
    { id: 2, name: 'فيزياء' },
  ],
  ...over,
});

describe('section students utils', () => {
  it('offers actions by enrollment status', () => {
    assert.deepStrictEqual(availableActions(row()), ['transfer', 'subjects', 'withdraw', 'complete']);
    assert.deepStrictEqual(availableActions(row({ status: 'WITHDRAWN' })), ['reactivate']);
    assert.deepStrictEqual(availableActions(row({ status: 'COMPLETED' })), []);
  });

  it('maps status actions to their target status', () => {
    assert.strictEqual(statusOfAction('withdraw'), 'WITHDRAWN');
    assert.strictEqual(statusOfAction('reactivate'), 'ACTIVE');
    assert.strictEqual(statusOfAction('transfer'), null);
  });

  it('filters the roster by status', () => {
    const roster = [row(), row({ enrollmentId: 2, status: 'WITHDRAWN' })];
    assert.strictEqual(filterRoster(roster, 'ALL').length, 2);
    assert.deepStrictEqual(
      filterRoster(roster, 'WITHDRAWN').map((r) => r.enrollmentId),
      [2],
    );
  });

  it('starts the subject choice empty when the student takes every subject', () => {
    assert.deepStrictEqual(initialSubjectChoice(row()), []);
    assert.deepStrictEqual(
      initialSubjectChoice(row({ takesAllSubjects: false, subjects: [{ id: 2, name: 'x' }] })),
      [2],
    );
  });

  it('unticking one subject from "all" keeps the others', () => {
    assert.deepStrictEqual(toggleSubjectChoice([], [1, 2, 3], 2), [1, 3]);
    assert.deepStrictEqual(toggleSubjectChoice([1], [1, 2, 3], 3), [1, 3]);
  });

  it('summarizes the bulk enroll result with student names', () => {
    const summary = summarizeEnrollResult(
      { enrolled: [{ studentId: 1, enrollmentId: 9 }], rejected: [{ studentId: 2, reason: 'فرع آخر' }] },
      [
        { id: 1, fullName: 'أحمد', familyName: null },
        { id: 2, fullName: 'سامر', familyName: null },
      ],
    );
    assert.deepStrictEqual(summary, { enrolled: 1, rejected: [{ name: 'سامر', reason: 'فرع آخر' }] });
  });

  it('reads text from a value or an input event', () => {
    assert.strictEqual(inputText('abc'), 'abc');
    assert.strictEqual(inputText({ target: { value: 'x' } }), 'x');
    assert.strictEqual(inputText(null), '');
  });
});

describe('SectionStudentsStore', () => {
  it('opens an action with the student subject choice and resets on close', () => {
    const store = createSectionStudentsStore({ id: 1, academicYearId: 1, branchId: 1 });
    store.getState().syncSectionSubjects([
      { id: 1, name: 'a' },
      { id: 2, name: 'b' },
    ]);
    store.getState().openAction('subjects', row());
    store.getState().toggleSubject(1);
    assert.deepStrictEqual(store.getState().subjectChoice, [2]);

    store.getState().closeAction();
    assert.strictEqual(store.getState().actionType, null);
    assert.deepStrictEqual(store.getState().subjectChoice, []);
  });

  it('keeps the candidate selection and clears it when the modal reopens', () => {
    const store = createSectionStudentsStore({ id: 1, academicYearId: 1, branchId: 1 });
    store.getState().openAdd();
    store.getState().toggleCandidate(5);
    store.getState().toggleCandidate(6);
    store.getState().toggleCandidate(5);
    assert.deepStrictEqual(store.getState().selectedIds, [6]);
    store.getState().openAdd();
    assert.deepStrictEqual(store.getState().selectedIds, []);
  });
});
