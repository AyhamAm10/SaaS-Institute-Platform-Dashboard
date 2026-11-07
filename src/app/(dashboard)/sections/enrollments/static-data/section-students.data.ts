import type { BadgeTone } from '@/src/components/controllers/badge/init/badge.init';
import type { EnrollmentStatus } from '@/src/core/api';

/** Labels of the section "students" tab (enrollments). */
export const sectionStudentsLabels = {
  title: 'طلاب الشعبة',
  description: 'الطلاب المسجلون بهذه الشعبة مع حالتهم وموادهم',
  addStudents: 'إضافة طلاب',
  emptyTitle: 'لا يوجد طلاب بعد',
  emptyDescription: 'أضف طلاباً غير مسجلين بشعبة في هذه السنة الدراسية',
  emptyFiltered: 'لا يوجد طلاب بهذه الحالة',
  allSubjects: 'كل مواد الشعبة',

  // Row actions
  actionTransfer: 'نقل لشعبة أخرى',
  actionSubjects: 'تخصيص المواد',
  actionWithdraw: 'تسجيل انسحاب',
  actionComplete: 'إنهاء السنة',
  actionReactivate: 'إعادة التفعيل',
  actionsMenu: 'إجراءات',

  // Add modal
  addTitle: 'إضافة طلاب للشعبة',
  addDescription: 'طلاب نفس الفرع غير المسجلين بأي شعبة في هذه السنة',
  searchPlaceholder: 'ابحث بالاسم أو العائلة أو الهاتف...',
  noCandidates: 'لا يوجد طلاب غير مسجلين',
  selectedCount: (n: number) => `تم اختيار ${n}`,
  enrollButton: (n: number) => (n > 0 ? `تسجيل ${n} طالب` : 'تسجيل'),
  enrolledSummary: (n: number) => `تم تسجيل ${n} طالب`,
  rejectedTitle: 'طلاب لم يتم تسجيلهم',
  enrollError: 'تعذّر تسجيل الطلاب',
  done: 'تم',

  // Transfer
  transferTitle: 'نقل الطالب لشعبة أخرى',
  transferSection: 'الشعبة الجديدة',
  transferHint: 'النقل ضمن نفس السنة والفرع. المواد المخصصة غير الموجودة بالشعبة الجديدة ستُحذف من اختيار الطالب.',
  noOtherSections: 'لا توجد شعب أخرى بنفس السنة والفرع',
  transferButton: 'نقل',
  transferError: 'تعذّر نقل الطالب',

  // Status
  withdrawTitle: 'تسجيل انسحاب الطالب',
  completeTitle: 'إنهاء السنة الدراسية للطالب',
  reactivateTitle: 'إعادة تفعيل تسجيل الطالب',
  completeHint: 'بعد إنهاء السنة لا يمكن إعادة التسجيل لحالة فعّال.',
  reactivateHint: 'سيعود الطالب فعّالاً بنفس الشعبة.',
  reasonLabel: 'السبب',
  reasonRequired: 'سبب الانسحاب مطلوب',
  reasonPlaceholder: 'مثال: انتقل لمعهد آخر',
  confirm: 'تأكيد',
  statusError: 'تعذّر تغيير حالة التسجيل',

  // Subjects
  subjectsTitle: 'مواد الطالب',
  subjectsAllHint: 'بدون اختيار (أو باختيار كل المواد) يدرس الطالب كل مواد الشعبة.',
  noPlanSubjects: 'لا توجد مواد في خطة الشعبة',
  selectAll: 'كل المواد',
  save: 'حفظ',
  subjectsError: 'تعذّر حفظ المواد',

  cancel: 'إلغاء',
} as const;

export const ENROLLMENT_STATUS_META: Record<EnrollmentStatus, { label: string; tone: BadgeTone }> = {
  ACTIVE: { label: 'فعّال', tone: 'success' },
  WITHDRAWN: { label: 'منسحب', tone: 'danger' },
  COMPLETED: { label: 'منتهي', tone: 'info' },
  TRANSFERRED: { label: 'منقول', tone: 'neutral' },
};

export const ENROLLMENT_STATUS_FILTERS = [
  { value: 'ALL', label: 'كل الحالات' },
  { value: 'ACTIVE', label: ENROLLMENT_STATUS_META.ACTIVE.label },
  { value: 'WITHDRAWN', label: ENROLLMENT_STATUS_META.WITHDRAWN.label },
  { value: 'COMPLETED', label: ENROLLMENT_STATUS_META.COMPLETED.label },
];
