import type { BadgeTone } from '@/src/components/controllers';
import type { PortalAttendanceStatus, PortalWeekday } from '@/src/core/api';

/** Labels of the follow-up portal (guardians and students). */
export const portalLabels = {
  title: 'متابعة الابن',
  titleStudent: 'متابعتي',
  breadcrumb: 'المتابعة',
  childPlaceholder: 'اختر الابن',
  noChildren: 'لا يوجد أبناء مرتبطون بهذا الحساب',
  noChildrenHint: 'تواصل مع إدارة المعهد لربط الحساب بالطلاب',
  loadError: 'تعذّر تحميل البيانات',
  tabToday: 'اليوم',
  tabAttendance: 'الحضور',
  tabTimetable: 'البرنامج',
  tabResults: 'العلامات',
  tabFinance: 'المالية',
  tabNotes: 'ملاحظات المعهد',
} as const;

export const todayLabels = {
  statusTitle: 'وضع اليوم',
  noSchool: 'لا دوام اليوم',
  notArrived: 'لم يصل بعد',
  absent: 'غائب اليوم',
  excused: 'غياب بعذر',
  inside: (since: string) => `داخل المعهد منذ ${since}`,
  late: (since: string) => `وصل متأخراً الساعة ${since}`,
  left: (at: string) => `غادر الساعة ${at}`,
  arrivedAt: 'وصل الساعة',
  leftAt: 'غادر الساعة',
  now: 'الحصة الحالية',
  next: 'الحصة التالية',
  noMoreLessons: 'انتهت حصص اليوم',
  lessonsTitle: 'حصص اليوم',
  noLessons: 'لا حصص اليوم',
  rate30: 'نسبة الحضور (30 يوماً)',
  average: 'معدل العلامات',
  nextDue: 'القسط القادم',
  noDue: 'لا أقساط مستحقة',
  latestMarks: 'آخر العلامات',
  upcomingExams: 'مذاكرات قادمة',
  none: '—',
} as const;

export const attendanceLabels = {
  month: 'الشهر',
  currentMonth: 'الشهر الحالي',
  present: 'حاضر',
  late: 'متأخر',
  absent: 'غائب',
  excused: 'بعذر',
  rate: 'النسبة',
  colDate: 'التاريخ',
  colStatus: 'الحالة',
  colIn: 'الدخول',
  colOut: 'الخروج',
  colNote: 'ملاحظة',
  empty: 'لا سجلات حضور في هذا الشهر',
} as const;

export const resultsLabels = {
  overall: 'المعدل العام',
  colSubject: 'المادة',
  colExam: 'المذاكرة',
  colDate: 'التاريخ',
  colMark: 'العلامة',
  colPercent: 'النسبة',
  colStatus: 'الحالة',
  empty: 'لا علامات بعد',
  upcoming: 'مذاكرات قادمة',
  pending: 'بانتظار العلامة',
} as const;

export const financeLabels = {
  total: 'الإجمالي',
  paid: 'المدفوع',
  remaining: 'المتبقي',
  overdue: 'المتأخر',
  installments: 'الأقساط',
  payments: 'الدفعات',
  colYear: 'السنة',
  colNumber: 'القسط',
  colDue: 'الاستحقاق',
  colAmount: 'المبلغ',
  colPaid: 'المدفوع',
  colRemaining: 'المتبقي',
  colStatus: 'الحالة',
  colReceipt: 'الإيصال',
  colDate: 'التاريخ',
  colMethod: 'الطريقة',
  emptyInstallments: 'لا عقود مالية',
  emptyPayments: 'لا دفعات بعد',
  cancelled: 'ملغاة',
} as const;

export const notesLabels = {
  empty: 'لا ملاحظات من المعهد بعد',
  by: (name: string) => `من ${name}`,
} as const;

/** Day status → Arabic label and badge tone (same wording as the staff attendance page). */
export const ATTENDANCE_BADGES: Record<PortalAttendanceStatus, { label: string; tone: BadgeTone }> = {
  PRESENT: { label: 'حاضر', tone: 'success' },
  LATE: { label: 'متأخر', tone: 'warning' },
  ABSENT: { label: 'غائب', tone: 'danger' },
  EXCUSED: { label: 'بعذر', tone: 'info' },
};

export const WEEKDAY_NAMES: Record<PortalWeekday, string> = {
  SATURDAY: 'السبت',
  SUNDAY: 'الأحد',
  MONDAY: 'الاثنين',
  TUESDAY: 'الثلاثاء',
  WEDNESDAY: 'الأربعاء',
  THURSDAY: 'الخميس',
  FRIDAY: 'الجمعة',
};

export const INSTALLMENT_BADGES: Record<string, { label: string; tone: BadgeTone }> = {
  PAID: { label: 'مدفوع', tone: 'success' },
  PARTIAL: { label: 'مدفوع جزئياً', tone: 'info' },
  DUE: { label: 'مستحق', tone: 'warning' },
  OVERDUE: { label: 'متأخر', tone: 'danger' },
  CANCELLED: { label: 'ملغى', tone: 'neutral' },
};

export const RESULT_BADGES: Record<string, { label: string; tone: BadgeTone }> = {
  PASSED: { label: 'ناجح', tone: 'success' },
  FAILED: { label: 'راسب', tone: 'danger' },
  ABSENT: { label: 'غائب', tone: 'info' },
  PENDING: { label: 'بانتظار العلامة', tone: 'neutral' },
};

export const PAYMENT_METHODS: Record<string, string> = {
  CASH: 'نقداً',
  BANK_TRANSFER: 'تحويل بنكي',
  OTHER: 'أخرى',
};
