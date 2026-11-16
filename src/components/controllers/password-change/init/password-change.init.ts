import { passwordError } from '@/src/core/auth/password';

/** The password every new or reset account starts with: never accepted as the new one. */
export const DEFAULT_PASSWORD = '12345678';

export const passwordChangeLabels = {
  title: 'اختر كلمة مرور جديدة',
  description: 'حسابك يستخدم كلمة المرور الافتراضية. اختر كلمة مرور خاصة بك لمتابعة استخدام النظام.',
  current: 'كلمة المرور الحالية',
  next: 'كلمة المرور الجديدة',
  confirm: 'تأكيد كلمة المرور الجديدة',
  submit: 'حفظ كلمة المرور',
  currentRequired: 'كلمة المرور الحالية مطلوبة',
  mismatch: 'تأكيد كلمة المرور غير مطابق',
  sameAsDefault: 'اختر كلمة مرور مختلفة عن الافتراضية',
  failed: 'تعذّر تغيير كلمة المرور. تحقق من كلمة المرور الحالية وحاول مجدداً.',
} as const;

/** Arabic error of the form, or null when it can be sent. */
export function validatePasswordChange(current: string, next: string, confirm: string): string | null {
  if (!current) return passwordChangeLabels.currentRequired;
  const invalid = passwordError(next);
  if (invalid) return invalid;
  if (next === DEFAULT_PASSWORD) return passwordChangeLabels.sameAsDefault;
  if (next !== confirm) return passwordChangeLabels.mismatch;
  return null;
}
