import type { EnrollmentDetailsPayload, StudentEnrollmentItem } from '@/src/core/api';

/** Labels of the "yearly data" of an enrollment (situation, origin, exam candidacy). */
export const enrollmentDetailsLabels = {
  title: 'بيانات السنة',
  edit: 'بيانات السنة',
  situation: 'وضع الطالب هذه السنة',
  pick: 'اختر...',
  previousSchool: 'المدرسة السابقة',
  transferredFrom: 'منقول من',
  candidacy: 'الترشح للامتحان الرسمي',
  isCandidate: 'متقدم للامتحان هذه السنة',
  examLanguage: 'لغة الامتحان',
  examLanguageDefault: 'لغة الطالب الأجنبية',
  candidateNumber: 'رقم الاكتتاب',
  certificateName: 'الشهادة (المؤهل)',
  certificateNumber: 'رقم الشهادة',
  certificateDate: 'تاريخ إصدار الشهادة',
  certificateSource: 'مصدر الشهادة',
  certificateGrade: 'الدرجات',
  candidateBadge: 'متقدم للامتحان',
  cancel: 'إلغاء',
  save: 'حفظ',
  error: 'تعذّر حفظ بيانات السنة',
} as const;

export type EnrollmentTextField =
  | 'previousSchool'
  | 'transferredFrom'
  | 'candidateNumber'
  | 'certificateName'
  | 'certificateNumber'
  | 'certificateSource'
  | 'certificateGrade';

/** The modal's form: select values as strings (Mantine), texts as plain strings. */
export type EnrollmentDetailsForm = Record<EnrollmentTextField, string> & {
  situationId: string | null;
  isExamCandidate: boolean;
  examLanguageId: string | null;
  certificateDate: string | null;
};

const TEXT_FIELDS: EnrollmentTextField[] = [
  'previousSchool',
  'transferredFrom',
  'candidateNumber',
  'certificateName',
  'certificateNumber',
  'certificateSource',
  'certificateGrade',
];

export function detailsFormFrom(e: StudentEnrollmentItem): EnrollmentDetailsForm {
  const texts = Object.fromEntries(TEXT_FIELDS.map((k) => [k, e[k] ?? ''])) as Record<EnrollmentTextField, string>;
  return {
    ...texts,
    situationId: e.situation ? String(e.situation.id) : null,
    isExamCandidate: Boolean(e.isExamCandidate),
    examLanguageId: e.examLanguage ? String(e.examLanguage.id) : null,
    certificateDate: e.certificateDate ? e.certificateDate.slice(0, 10) : null,
  };
}

/** The PATCH payload: every field sent, so an emptied one is cleared on the server. */
export function detailsPayloadFrom(form: EnrollmentDetailsForm): EnrollmentDetailsPayload {
  const texts = Object.fromEntries(TEXT_FIELDS.map((k) => [k, form[k].trim() || null]));
  return {
    ...texts,
    situationId: form.situationId ? Number(form.situationId) : null,
    isExamCandidate: form.isExamCandidate,
    // Empty for a candidate: let the server take the student's language
    ...(form.examLanguageId ? { examLanguageId: Number(form.examLanguageId) } : !form.isExamCandidate && { examLanguageId: null }),
    certificateDate: form.certificateDate,
  };
}
