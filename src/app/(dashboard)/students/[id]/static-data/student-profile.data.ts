/** Labels of the student profile page. */
export const profileLabels = {
  back: 'سجل الطلاب',
  notFound: 'الطالب غير موجود',
  family: 'العائلة',
  phone: 'الهاتف',
  branch: 'الفرع',
  enrollments: 'الشعب',
  noEnrollment: 'غير مسجل بشعبة',
  tabFinance: 'المالية',
  tabAttendance: 'الحضور',
  tabResults: 'العلامات',

  // Attendance tab
  attendanceRange: 'آخر 30 يوماً',
  noAttendance: 'لا توجد سجلات حضور في هذه الفترة',
  date: 'التاريخ',
  status: 'الحالة',
  checkIn: 'الدخول',
  checkOut: 'الانصراف',
  note: 'ملاحظة',

  // Results tab
  subjectAverages: 'معدل كل مادة',
  noResults: 'لا توجد علامات بعد',
  exam: 'المذاكرة',
  subject: 'المادة',
  mark: 'العلامة',
  averageOf: (n: number) => `${n} مذاكرات`,
} as const;
