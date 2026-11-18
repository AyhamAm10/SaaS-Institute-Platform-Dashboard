import type { AccountType, StaffRole } from '@/src/core/api';
import { ROLE_LABELS } from '@/src/core/auth/permissions';

/** The default password every new or reset account starts with (shown to the administrator). */
export const DEFAULT_PASSWORD_HINT = '12345678';

/** Labels of the accounts screen. */
export const accountsLabels = {
  title: 'إدارة الحسابات',
  description: 'حسابات الدخول لكل من الموظفين والمعلمين والعائلات والطلاب: إعادة التعيين والتفعيل والإيقاف',
  searchPlaceholder: 'ابحث بالاسم أو الهاتف...',
  statusAll: 'كل الحالات',
  statusActive: 'فعّال',
  statusInactive: 'موقوف',
  emptyMessage: 'لا توجد حسابات',
  colName: 'الحساب',
  colLinked: 'مرتبط بـ',
  colStatus: 'الحالة',
  colActions: 'إجراءات',
  you: 'أنت',
  mustChange: 'كلمة المرور افتراضية',
  edit: 'تعديل',
  resetPassword: 'إعادة تعيين كلمة المرور',
  deactivate: 'إيقاف الحساب',
  activate: 'تفعيل الحساب',

  resetTitle: 'إعادة تعيين كلمة المرور',
  resetConfirm: (name: string) =>
    `ستعود كلمة مرور "${name}" إلى ${DEFAULT_PASSWORD_HINT}، ويُخرَج من جلساته، وسيُطلب منه اختيار كلمة جديدة عند أول دخول.`,
  confirmReset: 'تأكيد إعادة التعيين',
  resetError: 'تعذّر إعادة تعيين كلمة المرور',
  deactivateTitle: 'إيقاف الحساب',
  deactivateConfirm: (name: string) =>
    `سيتوقف دخول "${name}" فوراً ويبقى سجله محفوظاً، ويمكنك إعادة تفعيله في أي وقت.`,
  confirmDeactivate: 'تأكيد الإيقاف',
  deactivateError: 'تعذّر إيقاف الحساب',
  activateTitle: 'تفعيل الحساب',
  activateConfirm: (name: string) => `سيتمكن "${name}" من تسجيل الدخول من جديد.`,
  confirmActivate: 'تأكيد التفعيل',
  activateError: 'تعذّر تفعيل الحساب',
  cancel: 'إلغاء',
  save: 'حفظ',

  staffCreate: 'موظف جديد',
  staffCreateTitle: 'موظف جديد',
  staffEditTitle: 'تعديل الموظف',
  staffDrawerDescription: `رقم الهاتف هو اسم الدخول، وكلمة المرور الأولى ${DEFAULT_PASSWORD_HINT} ويغيّرها عند أول دخول`,
  fullName: 'الاسم الكامل',
  phone: 'رقم الهاتف',
  role: 'الدور',
  selfRoleHint: 'لا يمكنك تغيير دورك بنفسك',
  roleChangeHint: 'تغيير الدور يُخرج الموظف من جلساته الحالية',
  staffSaveError: 'تعذّر حفظ الموظف',

  teachersHint: 'تُنشأ حسابات المعلمين تلقائياً عند إضافة معلم من صفحة المعلمين.',
  familiesHint: 'تُنشأ حسابات العائلات تلقائياً من هاتف العائلة عند إضافتها.',
  syncFamilies: 'إنشاء الحسابات الناقصة',
  syncing: 'جارٍ الإنشاء...',
  missingWithPhone: (n: number) => `${n} عائلة لها هاتف وبلا حساب دخول`,
  missingWithoutPhone: (n: number) => `${n} عائلة بلا رقم هاتف: أضف رقماً من صفحة العائلة ليُنشأ حسابها`,
  syncDone: (r: { created: number; linked: number; phoneTaken: number }) =>
    `أُنشئ ${r.created} حساب وارتبط ${r.linked}${r.phoneTaken ? `، وتعذّر ${r.phoneTaken} لأن الهاتف يخص موظفاً أو معلماً` : ''}`,
  syncError: 'تعذّر إنشاء حسابات العائلات',

  studentCreate: 'حساب طالب',
  studentCreateTitle: 'حساب دخول لطالب',
  studentDrawerDescription: `الطالب بلا هاتف في سجله، فأدخل رقماً خاصاً به. كلمة المرور الأولى ${DEFAULT_PASSWORD_HINT}`,
  student: 'الطالب',
  studentSearch: 'ابحث عن طالب بلا حساب...',
  studentRequired: 'اختر الطالب',
  phoneRequired: 'رقم الهاتف مطلوب',
  studentSaveError: 'تعذّر إنشاء حساب الطالب',
} as const;

export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  staff: 'الموظفون',
  teachers: 'المعلمون',
  families: 'العائلات',
  students: 'الطلاب',
};

export const ACCOUNT_TYPES: AccountType[] = ['staff', 'teachers', 'families', 'students'];

export const STAFF_ROLE_OPTIONS: { value: StaffRole; label: string }[] = (
  ['INSTITUTE_ADMIN', 'REGISTRAR', 'DATA_ENTRY', 'ACCOUNTANT'] as const
).map((value) => ({ value, label: ROLE_LABELS[value] }));

export const STATUS_OPTIONS = [
  { value: 'active', label: accountsLabels.statusActive },
  { value: 'inactive', label: accountsLabels.statusInactive },
];

/** Role label of one account row. */
export function accountRoleLabel(role: string): string {
  return ROLE_LABELS[role] ?? role;
}
