import type { BadgeTone } from '@/src/components/controllers/badge/init/badge.init';
import type { ExamResultStatus } from '@/src/core/api';

/** Labels of the exams pages (E9). */
export const examsLabels = {
  title: 'المذاكرات',
  description: 'مذاكرات الشعب حسب المادة والنوع، وإدخال العلامات',
  searchPlaceholder: 'ابحث بعنوان المذاكرة...',
  emptyMessage: 'لا توجد مذاكرات',
  emptyDescription: 'أنشئ مذاكرة لشعبة ومادة من خطتها',
  create: 'مذاكرة جديدة',
  sectionFilter: 'كل الشعب',
  typeFilter: 'كل الأنواع',
  from: 'من تاريخ',
  to: 'إلى تاريخ',
  colTitle: 'المذاكرة',
  colSection: 'الشعبة / المادة',
  colDate: 'التاريخ',
  colMarks: 'العظمى / النجاح',
  colResults: 'العلامات',
  colActions: 'إجراءات',
  enterMarks: 'إدخال العلامات',
  edit: 'تعديل',
  delete: 'حذف',

  createTitle: 'مذاكرة جديدة',
  editTitle: 'تعديل المذاكرة',
  drawerDescription: 'المادة من خطة الشعبة، والتاريخ ضمن السنة الدراسية',
  section: 'الشعبة',
  subject: 'المادة',
  subjectHint: 'مواد خطة الشعبة فقط',
  pickSectionFirst: 'اختر الشعبة أولاً',
  examType: 'نوع المذاكرة',
  examTitle: 'العنوان',
  examDate: 'التاريخ',
  maxMark: 'العلامة العظمى',
  passMark: 'علامة النجاح',
  lockedHint: 'لا يمكن تغيير الشعبة أو المادة بعد الإنشاء.',
  save: 'حفظ',
  cancel: 'إلغاء',
  saveError: 'تعذّر حفظ المذاكرة',

  deleteTitle: 'حذف المذاكرة',
  deleteConfirm: (title: string) => `هل تريد حذف "${title}"؟`,
  deleteWithMarks: (n: number) => `هذه المذاكرة فيها ${n} علامة، ستُحذف معها (ويُسجَّل ذلك في سجل التدقيق).`,
  confirmDelete: 'تأكيد الحذف',
  deleteError: 'تعذّر حذف المذاكرة',
} as const;

export const sheetLabels = {
  back: 'المذاكرات',
  student: 'الطالب',
  mark: 'العلامة',
  absent: 'غائب',
  status: 'الحالة',
  notEligible: 'لم يعد يدرس المادة بهذه الشعبة',
  save: 'حفظ العلامات',
  saved: 'تم حفظ العلامات',
  saveError: 'تعذّر حفظ العلامات',
  fixErrors: 'صحّح العلامات المظللة أولاً',
  noStudents: 'لا يوجد طلاب يدرسون هذه المادة في الشعبة',
  stats: {
    students: 'الطلاب',
    average: 'المعدل',
    passed: 'ناجح',
    failed: 'راسب',
    absent: 'غائب',
    pending: 'بلا علامة',
  },
  outOf: (max: number) => `من ${max}`,
} as const;

export const RESULT_STATUS_META: Record<ExamResultStatus, { label: string; tone: BadgeTone }> = {
  PENDING: { label: 'بلا علامة', tone: 'neutral' },
  PASSED: { label: 'ناجح', tone: 'success' },
  FAILED: { label: 'راسب', tone: 'danger' },
  ABSENT: { label: 'غائب', tone: 'warning' },
};
