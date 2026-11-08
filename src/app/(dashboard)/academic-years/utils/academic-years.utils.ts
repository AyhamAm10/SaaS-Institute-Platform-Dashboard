import type { AcademicYear } from '@/src/core/api';

/** Academic year drawer form (inputs as strings). */
export interface AcademicYearForm {
  name: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

export interface AcademicYearPayload {
  name: string;
  startDate: string;
  endDate: string;
  isCurrent?: boolean;
}

export const EMPTY_YEAR_FORM: AcademicYearForm = { name: '', startDate: '', endDate: '', isCurrent: false };

export function yearFormFrom(year: AcademicYear): AcademicYearForm {
  return {
    name: year.name,
    startDate: year.startDate ? year.startDate.split('T')[0] : '',
    endDate: year.endDate ? year.endDate.split('T')[0] : '',
    isCurrent: year.isCurrent,
  };
}

/** A bare year ("2026") means 1 Sept / 30 June of that year. */
function normalizeDate(value: string, fallbackMonthDay: string): string {
  const trimmed = value.trim();
  return /^\d{4}$/.test(trimmed) ? `${trimmed}-${fallbackMonthDay}` : trimmed;
}

/** Arabic error of the form, or the payload to send. */
export function validateYearForm(form: AcademicYearForm): { error: string } | { payload: AcademicYearPayload } {
  if (!form.name.trim()) return { error: 'يرجى إدخال اسم السنة الدراسية' };
  if (!form.startDate) return { error: 'يرجى تحديد تاريخ بداية السنة الدراسية' };
  if (!form.endDate) return { error: 'يرجى تحديد تاريخ نهاية السنة الدراسية' };
  const startDate = normalizeDate(form.startDate, '09-01');
  const endDate = normalizeDate(form.endDate, '06-30');
  if (new Date(startDate) >= new Date(endDate)) return { error: 'يجب أن يكون تاريخ البداية قبل تاريخ النهاية' };
  return { payload: { name: form.name.trim(), startDate, endDate, isCurrent: form.isCurrent } };
}

/** Server error → message for the drawer (date overlap explained). */
export function yearSaveError(message: string): string {
  if (message.includes('overlap') || message.includes('تتداخل')) {
    return 'تواريخ السنة الدراسية تتداخل مع سنة دراسية أخرى موجودة مسبقاً، يرجى اختيار تاريخ بداية ونهاية لا يتقاطعان مع السنوات السابقة';
  }
  return message;
}
