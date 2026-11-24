import type { Exam } from '@/src/core/api';
import type { ExamForm } from './exams.utils';

/** The form holds the chosen supervisors as strings; they are saved only while the exam needs supervision. */
export function supervisorIdsToSave(form: ExamForm): number[] {
  return form.needsSupervision ? form.supervisorIds.map(Number) : [];
}

/**
 * Whether the supervisors must be sent after the exam itself is saved: for a new exam when some
 * are chosen; for an edited one whenever it stays under supervision (turning it off clears them
 * on the server).
 */
export function mustSaveSupervisors(form: ExamForm, editing: Exam | null): boolean {
  return form.needsSupervision && (editing ? true : form.supervisorIds.length > 0);
}
