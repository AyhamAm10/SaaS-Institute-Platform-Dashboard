import type { BadgeTone } from '@/src/components/controllers/badge/init/badge.init';
import type { StaffRole } from '@/src/core/api';
import { ROLE_LABELS } from '@/src/core/auth/permissions';

/** Labels of the staff page (D2). */
export const staffLabels = {
  title: 'الموظفون والصلاحيات',
  description: 'حسابات موظفي المعهد: المدير يدير كل شيء، المسجّل للطلاب والحضور، المحاسب للمالية',
  searchPlaceholder: 'ابحث بالاسم أو الهاتف...',
  emptyMessage: 'لا يوجد موظفون',
  emptyDescription: 'أضف حساباً لموظف وحدد دوره',
  create: 'موظف جديد',
  roleFilter: 'كل الأدوار',
  colName: 'الموظف',
  colRole: 'الدور',
  colCreated: 'تاريخ الإنشاء',
  colActions: 'إجراءات',
  you: 'أنت',
  edit: 'تعديل',
  resetPassword: 'تغيير كلمة المرور',
  deactivate: 'إيقاف الحساب',

  createTitle: 'موظف جديد',
  editTitle: 'تعديل الموظف',
  drawerDescription: 'رقم الهاتف هو اسم الدخول ولا يتغير بعد الإنشاء',
  fullName: 'الاسم الكامل',
  phone: 'رقم الهاتف',
  role: 'الدور',
  password: 'كلمة المرور',
  passwordHint: '8 محارف على الأقل',
  selfRoleHint: 'لا يمكنك تغيير دورك بنفسك',
  roleChangeHint: 'تغيير الدور يُخرج الموظف من جلساته الحالية',
  save: 'حفظ',
  cancel: 'إلغاء',
  saveError: 'تعذّر حفظ الموظف',

  passwordTitle: 'تغيير كلمة المرور',
  passwordFor: (name: string) => `كلمة مرور جديدة لـ "${name}". سيُطلب منه تسجيل الدخول من جديد.`,
  newPassword: 'كلمة المرور الجديدة',
  passwordError: 'تعذّر تغيير كلمة المرور',

  deactivateTitle: 'إيقاف الحساب',
  deactivateConfirm: (name: string) =>
    `سيتوقف دخول "${name}" فوراً، ويبقى سجله وعملياته محفوظة. هل تريد المتابعة؟`,
  confirmDeactivate: 'تأكيد الإيقاف',
  deactivateError: 'تعذّر إيقاف الحساب',
} as const;

/** Roles offered in the drawer and the filter, in display order. */
export const STAFF_ROLE_OPTIONS: { value: StaffRole; label: string }[] = (
  ['INSTITUTE_ADMIN', 'REGISTRAR', 'ACCOUNTANT'] as const
).map((value) => ({ value, label: ROLE_LABELS[value] }));

export const STAFF_ROLE_TONES: Record<StaffRole, BadgeTone> = {
  INSTITUTE_ADMIN: 'brand',
  REGISTRAR: 'info',
  ACCOUNTANT: 'success',
};
