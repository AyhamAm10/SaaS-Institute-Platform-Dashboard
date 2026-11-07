import type {
  Exam,
  ExamPayload,
  ExamResultStatus,
  ExamSheet,
  ExamStats,
  ResultEntry,
  UpdateExamPayload,
} from '@/src/core/api';

/** Exam drawer form (inputs as strings). */
export interface ExamForm {
  sectionId: string | null;
  subjectId: string | null;
  examTypeId: string | null;
  title: string;
  examDate: string;
  maxMark: string;
  passMark: string;
}

export const EMPTY_EXAM_FORM: ExamForm = {
  sectionId: null,
  subjectId: null,
  examTypeId: null,
  title: '',
  examDate: '',
  maxMark: '100',
  passMark: '50',
};

export function examFormFrom(exam: Exam): ExamForm {
  return {
    sectionId: String(exam.sectionId),
    subjectId: String(exam.subjectId),
    examTypeId: exam.examTypeId ? String(exam.examTypeId) : null,
    title: exam.title,
    examDate: exam.examDate.slice(0, 10),
    maxMark: String(Number(exam.maxMark)),
    passMark: String(Number(exam.passMark)),
  };
}

/** Field errors (Arabic) of the exam form; empty object = valid. */
export function validateExamForm(form: ExamForm, isCreate: boolean): Partial<Record<keyof ExamForm, string>> {
  const errors: Partial<Record<keyof ExamForm, string>> = {};
  if (isCreate && !form.sectionId) errors.sectionId = 'الشعبة مطلوبة';
  if (isCreate && !form.subjectId) errors.subjectId = 'المادة مطلوبة';
  if (!form.title.trim()) errors.title = 'العنوان مطلوب';
  if (!form.examDate) errors.examDate = 'التاريخ مطلوب';
  const max = Number(form.maxMark);
  const pass = Number(form.passMark);
  if (!(max > 0)) errors.maxMark = 'العلامة العظمى يجب أن تكون أكبر من صفر';
  if (!(pass > 0) || pass > max) errors.passMark = 'علامة النجاح بين 0 والعلامة العظمى';
  return errors;
}

export function toExamPayload(form: ExamForm): ExamPayload {
  return {
    sectionId: Number(form.sectionId),
    subjectId: Number(form.subjectId),
    examTypeId: form.examTypeId ? Number(form.examTypeId) : null,
    title: form.title.trim(),
    examDate: form.examDate,
    maxMark: Number(form.maxMark),
    passMark: Number(form.passMark),
  };
}

export function toUpdateExamPayload(form: ExamForm): UpdateExamPayload {
  const payload = toExamPayload(form);
  return {
    examTypeId: payload.examTypeId,
    title: payload.title,
    examDate: payload.examDate,
    maxMark: payload.maxMark,
    passMark: payload.passMark,
  };
}

// ── Mark sheet ──────────────────────────────────────────────────────────────

/** One editable line of the mark sheet. */
export interface MarkEntry {
  mark: string;
  absent: boolean;
}

export function entriesFrom(sheet: ExamSheet): Record<number, MarkEntry> {
  return Object.fromEntries(
    sheet.rows.map((row) => [
      row.student.id,
      {
        mark: row.result?.mark != null ? String(row.result.mark) : '',
        absent: row.result?.status === 'ABSENT',
      },
    ]),
  );
}

/** Same rule as the server: ABSENT, PENDING without a mark, PASSED / FAILED. */
export function liveStatus(entry: MarkEntry, passMark: number): ExamResultStatus {
  if (entry.absent) return 'ABSENT';
  if (entry.mark.trim() === '') return 'PENDING';
  return Number(entry.mark) >= passMark ? 'PASSED' : 'FAILED';
}

/** Error of one mark ('' when valid). */
export function markError(entry: MarkEntry, maxMark: number): string {
  if (entry.absent || entry.mark.trim() === '') return '';
  const mark = Number(entry.mark);
  const cents = mark * 100;
  if (Number.isNaN(mark) || mark < 0 || mark > maxMark) return `بين 0 و ${maxMark}`;
  if (Math.abs(cents - Math.round(cents)) > 1e-6) return 'رقمين بعد الفاصلة كحد أقصى';
  return '';
}

export function toResultEntries(entries: Record<number, MarkEntry>): ResultEntry[] {
  return Object.entries(entries).map(([studentId, e]) => ({
    studentId: Number(studentId),
    absent: e.absent,
    mark: e.absent || e.mark.trim() === '' ? null : Number(e.mark),
  }));
}

/** Live statistics of the sheet being edited. */
export function liveStats(entries: Record<number, MarkEntry>, passMark: number): ExamStats {
  const list = Object.values(entries);
  const statuses = list.map((e) => liveStatus(e, passMark));
  const marks = list.filter((e) => !e.absent && e.mark.trim() !== '').map((e) => Number(e.mark));
  const count = (s: ExamResultStatus) => statuses.filter((x) => x === s).length;
  return {
    students: list.length,
    graded: marks.length,
    passed: count('PASSED'),
    failed: count('FAILED'),
    absent: count('ABSENT'),
    pending: count('PENDING'),
    average: marks.length ? Math.round((marks.reduce((a, b) => a + b, 0) / marks.length) * 100) / 100 : null,
  };
}
