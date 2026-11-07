import type { BulkEnrollResult, SectionRosterItem } from '@/src/core/api';
import type {
  CandidateStudent,
  EnrollmentActionType,
  EnrollResultSummary,
  RosterStatusFilter,
} from '../state/section-students.state';

/** Add or remove an id from a selection (keeps insertion order). */
export function toggleId(ids: number[], id: number): number[] {
  return ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];
}

export function filterRoster(
  roster: SectionRosterItem[],
  filter: RosterStatusFilter,
): SectionRosterItem[] {
  return filter === 'ALL' ? roster : roster.filter((item) => item.status === filter);
}

/** Actions offered on a roster row, per enrollment status. */
export function availableActions(item: SectionRosterItem): EnrollmentActionType[] {
  switch (item.status) {
    case 'ACTIVE':
      return ['transfer', 'subjects', 'withdraw', 'complete'];
    case 'WITHDRAWN':
      return ['reactivate'];
    default:
      return [];
  }
}

/** Subject choice to edit: empty when the student takes every subject. */
export function initialSubjectChoice(item: SectionRosterItem): number[] {
  return item.takesAllSubjects ? [] : item.subjects.map((s) => s.id);
}

/** Bulk enroll response → message model (names instead of ids). */
export function summarizeEnrollResult(
  result: BulkEnrollResult,
  candidates: CandidateStudent[],
): EnrollResultSummary {
  const names = new Map(candidates.map((c) => [c.id, c.fullName]));
  return {
    enrolled: result.enrolled.length,
    rejected: result.rejected.map((r) => ({
      name: names.get(r.studentId) ?? `#${r.studentId}`,
      reason: r.reason,
    })),
  };
}

/** Target status of a status action; null for transfer / subjects. */
export function statusOfAction(type: EnrollmentActionType) {
  if (type === 'withdraw') return 'WITHDRAWN' as const;
  if (type === 'complete') return 'COMPLETED' as const;
  if (type === 'reactivate') return 'ACTIVE' as const;
  return null;
}

export { inputText } from '@/src/core/format';

/**
 * Toggle a subject of the choice. An empty choice means "all subjects", so
 * unticking one subject from "all" keeps every other plan subject.
 */
export function toggleSubjectChoice(choice: number[], planIds: number[], id: number): number[] {
  const base = choice.length === 0 ? planIds : choice;
  return toggleId(base, id);
}
