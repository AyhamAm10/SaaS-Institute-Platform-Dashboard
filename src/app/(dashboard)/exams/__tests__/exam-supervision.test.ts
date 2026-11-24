import { describe, it } from 'node:test';
import assert from 'node:assert';
import type { Exam } from '@/src/core/api';
import { EMPTY_EXAM_FORM, examFormFrom, toExamPayload, toUpdateExamPayload } from '../utils/exams.utils';
import { mustSaveSupervisors, supervisorIdsToSave } from '../utils/exam-supervision.utils';

const form = { ...EMPTY_EXAM_FORM, sectionId: '2', subjectId: '3', title: 'ت', examDate: '2026-11-25' };

describe('exam supervision form', () => {
  it('a teacher request carries no supervision flag at all (the server would refuse it)', () => {
    const f = { ...form, needsSupervision: true };
    assert.strictEqual('needsSupervision' in toExamPayload(f, false), false);
    assert.strictEqual('needsSupervision' in toUpdateExamPayload(f, false), false);
  });

  it('the administration sends the flag on create and on update', () => {
    assert.strictEqual(toExamPayload({ ...form, needsSupervision: true }, true).needsSupervision, true);
    assert.strictEqual(toUpdateExamPayload({ ...form, needsSupervision: false }, true).needsSupervision, false);
  });

  it('the chosen supervisors are saved only while the exam needs supervision', () => {
    assert.deepStrictEqual(supervisorIdsToSave({ ...form, needsSupervision: true, supervisorIds: ['4', '5'] }), [4, 5]);
    assert.deepStrictEqual(supervisorIdsToSave({ ...form, needsSupervision: false, supervisorIds: ['4'] }), []);
  });

  it('when the supervisors are sent after the exam is saved', () => {
    const on = { ...form, needsSupervision: true };
    const exam = { id: 1 } as Exam;
    assert.strictEqual(mustSaveSupervisors({ ...on, supervisorIds: [] }, null), false); // new, none chosen
    assert.strictEqual(mustSaveSupervisors({ ...on, supervisorIds: ['4'] }, null), true);
    assert.strictEqual(mustSaveSupervisors({ ...on, supervisorIds: [] }, exam), true); // edited: clears the old ones
    assert.strictEqual(mustSaveSupervisors({ ...form, needsSupervision: false, supervisorIds: ['4'] }, exam), false); // the PATCH clears them
  });

  it('editing an exam loads its flag and supervisors into the form', () => {
    const exam = {
      id: 9, sectionId: 2, subjectId: 3, examTypeId: null, title: 'ت', examDate: '2026-11-25T00:00:00.000Z', maxMark: '20', passMark: '10',
      needsSupervision: true, supervisors: [{ id: 4, fullName: 'منى' }, { id: 6, fullName: 'هالة' }],
    } as unknown as Exam;
    const f = examFormFrom(exam);
    assert.deepStrictEqual([f.needsSupervision, f.supervisorIds], [true, ['4', '6']]);
  });
});
