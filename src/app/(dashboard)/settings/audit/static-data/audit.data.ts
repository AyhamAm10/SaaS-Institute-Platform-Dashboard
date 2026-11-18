import type { BadgeTone } from '@/src/components/controllers/badge/init/badge.init';
import type { AuditAction } from '@/src/core/api';

/** Labels of the audit viewer. */
export const auditLabels = {
  title: 'سجل التدقيق',
  description: 'من عدّل أو حذف ماذا ومتى. تُسجَّل التعديلات والحذف فقط، ولا تُعرض كلمات السر.',
  colTime: 'الوقت',
  colUser: 'المستخدم',
  colAction: 'العملية',
  colRecord: 'السجل',
  colChanges: 'التغييرات',
  entityFilter: 'نوع السجل',
  actionFilter: 'العملية',
  from: 'من تاريخ',
  to: 'إلى تاريخ',
  empty: 'لا عمليات مطابقة',
  system: 'النظام',
  noChanges: 'لا تفاصيل',
  deletedRecord: 'سجل محذوف',
} as const;

export const AUDIT_ACTION_META: Record<AuditAction, { label: string; tone: BadgeTone }> = {
  CREATE: { label: 'إنشاء', tone: 'success' },
  UPDATE: { label: 'تعديل', tone: 'info' },
  DELETE: { label: 'حذف', tone: 'danger' },
};

export const AUDIT_ACTION_OPTIONS = (['UPDATE', 'DELETE'] as const).map((value) => ({
  value,
  label: AUDIT_ACTION_META[value].label,
}));

/** Model names the audited repositories write, in Arabic. */
export const AUDIT_ENTITY_LABELS: Record<string, string> = {
  student: 'طالب',
  family: 'عائلة',
  teacher: 'معلم',
  user: 'حساب',
  section: 'شعبة',
  subject: 'مادة',
  room: 'قاعة',
  closure: 'عطلة',
  studentEnrollment: 'تسجيل بشعبة',
  studentSubscription: 'عقد مالي',
  installment: 'قسط',
  payment: 'دفعة',
  dailyAttendance: 'حضور',
  exam: 'مذاكرة',
  examResult: 'علامة',
  studentNote: 'ملاحظة أهل',
};

export const AUDIT_ENTITY_OPTIONS = Object.entries(AUDIT_ENTITY_LABELS).map(([value, label]) => ({ value, label }));

/** Field names shown in Arabic where they are common; others keep their technical name. */
export const AUDIT_FIELD_LABELS: Record<string, string> = {
  fullName: 'الاسم',
  name: 'الاسم',
  phone: 'الهاتف',
  status: 'الحالة',
  isActive: 'فعّال',
  note: 'ملاحظة',
  checkOutNote: 'سبب الخروج',
  body: 'النص',
  visibleToFamily: 'ظاهرة للأهل',
  checkInAt: 'وقت الدخول',
  checkOutAt: 'وقت الانصراف',
  mark: 'العلامة',
  amount: 'المبلغ',
  discountAmount: 'الحسم',
  role: 'الدور',
};
