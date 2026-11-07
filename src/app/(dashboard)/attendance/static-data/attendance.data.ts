import type { BadgeTone } from '@/src/components/controllers/badge/init/badge.init';
import type { AttendanceStatus } from '@/src/core/api';

/** Labels of the daily attendance page (E8). */
export const attendanceLabels = {
  title: 'الحضور والانصراف',
  description: 'تسجيل دخول الطلاب وانصرافهم اليومي حسب الشعبة (بتوقيت المعهد)',
  section: 'الشعبة',
  sectionPlaceholder: 'اختر الشعبة',
  date: 'التاريخ',
  bulkCheckIn: 'دخول للكل',
  bulkCheckOut: 'انصراف للكل',
  bulkCheckInDone: 'تم تسجيل الدخول',
  bulkCheckOutDone: 'تم تسجيل الانصراف',
  notWorkingDay: 'هذا اليوم ليس يوم دوام حسب إعدادات الجدول.',
  pickSection: 'اختر شعبة لعرض طلابها',
  noStudents: 'لا يوجد طلاب فعّالون في هذه الشعبة',
  checkIn: 'دخول',
  checkOut: 'انصراف',
  excuse: 'عذر',
  edit: 'تعديل',
  student: 'الطالب',
  status: 'الحالة',
  checkInTime: 'وقت الدخول',
  checkOutTime: 'وقت الانصراف',
  actions: 'إجراءات',
  notRecorded: 'لم يُسجَّل',
  counts: {
    present: 'حاضر',
    late: 'متأخر',
    absent: 'غائب',
    excused: 'بعذر',
    notRecorded: 'لم يسجّل بعد',
  },
  excuseTitle: 'تسجيل غياب بعذر',
  excuseNote: 'الملاحظة / سبب العذر',
  editTitle: 'تعديل سجل الحضور',
  editHint: 'التعديل يُسجَّل في سجل التدقيق. عند تغيير وقت الدخول فقط تُعاد حساب حالة التأخير تلقائياً.',
  invalidTime: 'الوقت بصيغة HH:mm (مثال 08:15)',
  note: 'ملاحظة',
  save: 'حفظ',
  cancel: 'إلغاء',
  actionError: 'تعذّر تنفيذ العملية',
} as const;

export const ATTENDANCE_STATUS_META: Record<AttendanceStatus, { label: string; tone: BadgeTone }> = {
  PRESENT: { label: 'حاضر', tone: 'success' },
  LATE: { label: 'متأخر', tone: 'warning' },
  ABSENT: { label: 'غائب', tone: 'danger' },
  EXCUSED: { label: 'بعذر', tone: 'info' },
};

export const ATTENDANCE_STATUS_OPTIONS = (Object.keys(ATTENDANCE_STATUS_META) as AttendanceStatus[]).map(
  (value) => ({ value, label: ATTENDANCE_STATUS_META[value].label }),
);
