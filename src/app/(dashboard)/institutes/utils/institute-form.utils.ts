import { InstituteDrawerMode, InstituteFormState } from '../state/institutes.state';

const INSTITUTE_CODE_PATTERN = /^[A-Za-z0-9-]{3,20}$/;

/**
 * Client-side validation of the institute form.
 * Returns a map of field → Arabic error message (empty when valid).
 * Admin account fields are validated only in create mode.
 */
export function validateInstituteForm(
  form: InstituteFormState,
  mode: InstituteDrawerMode,
): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!form.name.trim()) errors['name'] = 'يرجى إدخال اسم المعهد التعليمي';
  if (form.code.trim() && !INSTITUTE_CODE_PATTERN.test(form.code.trim())) {
    errors['code'] = 'الكود من 3 إلى 20 حرفاً لاتينياً أو رقماً أو شرطة';
  }
  if (mode === 'edit' && !form.code.trim()) errors['code'] = 'يرجى إدخال كود المعهد';
  if (!form.phone.trim()) errors['phone'] = 'يرجى إدخال هاتف المعهد';
  if (!form.address.trim()) errors['address'] = 'يرجى إدخال عنوان المعهد';

  if (mode === 'create') {
    if (!form.adminFullName.trim()) errors['adminFullName'] = 'يرجى إدخال اسم مدير المعهد';
    if (!form.adminPhone.trim()) errors['adminPhone'] = 'يرجى إدخال رقم هاتف المدير';
    if (!form.adminPassword.trim() || form.adminPassword.length < 6) {
      errors['adminPassword'] = 'كلمة المرور يجب أن لا تقل عن 6 خانات';
    }
  }

  return errors;
}

/** Shared institute fields of the create/update payloads. */
export function toInstituteDetailsPayload(form: InstituteFormState) {
  return {
    name: form.name.trim(),
    code: form.code.trim().toUpperCase() || undefined,
    logoUrl: form.logoUrl.trim() || undefined,
    primaryColor: form.primaryColor || undefined,
    secondaryColor: form.secondaryColor || undefined,
    phone: form.phone.trim(),
    address: form.address.trim(),
  };
}

/** Extracts the backend error message (string or validation list). */
export function extractApiError(err: unknown, fallback: string): string {
  const e = err as { response?: { data?: { message?: string | string[] } }; message?: string };
  const msg = e?.response?.data?.message || e?.message || fallback;
  return Array.isArray(msg) ? msg.join('، ') : msg;
}
