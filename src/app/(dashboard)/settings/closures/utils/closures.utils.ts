import type { Closure, ClosurePayload, ClosureScope } from '@/src/core/api';
import { closureLabels as labels, type ClosureStatus } from '../static-data/closures.data';

/** Closure drawer form (dates as `YYYY-MM-DD`, branch as the select's string value). */
export interface ClosureForm {
  scope: ClosureScope;
  branchId: string | null;
  sectionIds: number[];
  fromDate: string;
  toDate: string;
  reason: string;
}

export type ClosureFormErrors = Partial<Record<'scope' | 'branchId' | 'sectionIds' | 'fromDate' | 'toDate' | 'reason', string>>;

export const EMPTY_CLOSURE_FORM: ClosureForm = {
  scope: 'INSTITUTE',
  branchId: null,
  sectionIds: [],
  fromDate: '',
  toDate: '',
  reason: '',
};

export function closureFormFrom(closure: Closure): ClosureForm {
  return {
    scope: closure.scope,
    branchId: closure.branchId === null ? null : String(closure.branchId),
    sectionIds: closure.sections.map((s) => s.id),
    fromDate: closure.fromDate,
    toDate: closure.toDate,
    reason: closure.reason,
  };
}

/** Field errors of the closure form; empty object = valid. */
export function validateClosureForm(form: ClosureForm): ClosureFormErrors {
  const errors: ClosureFormErrors = {};
  if (form.reason.trim().length < 2) errors.reason = labels.reasonShort;
  if (!form.fromDate) errors.fromDate = labels.required;
  if (!form.toDate) errors.toDate = labels.required;
  if (form.fromDate && form.toDate && form.toDate < form.fromDate) errors.toDate = labels.invalidRange;
  if (form.scope === 'BRANCH' && !form.branchId) errors.branchId = labels.branchRequired;
  if (form.scope === 'SECTION' && form.sectionIds.length === 0) errors.sectionIds = labels.sectionsRequired;
  return errors;
}

/** Only what the chosen scope needs: a branch closure carries no sections and vice versa. */
export function toClosurePayload(form: ClosureForm): ClosurePayload {
  return {
    scope: form.scope,
    fromDate: form.fromDate,
    toDate: form.toDate,
    reason: form.reason.trim(),
    ...(form.scope === 'BRANCH' && form.branchId ? { branchId: Number(form.branchId) } : {}),
    ...(form.scope === 'SECTION' ? { sectionIds: form.sectionIds } : {}),
  };
}

/** Ongoing / upcoming / past relative to `today` (institute-local `YYYY-MM-DD`). */
export function closureStatus(closure: Pick<Closure, 'fromDate' | 'toDate'>, today: string): ClosureStatus {
  if (closure.toDate < today) return 'past';
  if (closure.fromDate > today) return 'upcoming';
  return 'ongoing';
}

/** Number of days of the closure (inclusive). */
export function closureDays(closure: Pick<Closure, 'fromDate' | 'toDate'>): number {
  const ms = Date.parse(`${closure.toDate}T00:00:00Z`) - Date.parse(`${closure.fromDate}T00:00:00Z`);
  return Math.round(ms / 86_400_000) + 1;
}

/** Who the closure applies to, as text. */
export function closureTarget(closure: Closure): string {
  if (closure.scope === 'INSTITUTE') return labels.scopeInstitute;
  if (closure.scope === 'BRANCH') return closure.branchName ?? '—';
  return closure.sections.map((s) => s.name).join('، ') || '—';
}

/** Adds or removes one section id, keeping the list free of duplicates. */
export function toggleId(ids: number[], id: number): number[] {
  return ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];
}
