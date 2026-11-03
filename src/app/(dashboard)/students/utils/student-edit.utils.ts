import { Student, StudentField, UpdateStudentPayload } from '@/src/core/api';
import { StudentEditFormState } from '../state/students.state';

/**
 * Client-side validation of the student edit form, including the institute's
 * required custom fields. Returns field → Arabic error message.
 * Custom field errors use the key `custom.<fieldName>`.
 */
export function validateStudentEditForm(
  form: StudentEditFormState,
  fields: StudentField[],
): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!form.fullName.trim()) errors['fullName'] = 'يرجى إدخال اسم الطالب';
  if (!form.birthDate) errors['birthDate'] = 'يرجى إدخال تاريخ الميلاد';
  if (!form.familyId) errors['familyId'] = 'يرجى اختيار عائلة الطالب';

  for (const field of fields) {
    if (!field.isActive || !field.isRequired) continue;
    const value = form.customFields[field.name];
    if (value === undefined || value === null || String(value).trim() === '') {
      errors[`custom.${field.name}`] = `حقل "${field.label}" مطلوب`;
    }
  }

  return errors;
}

/** Builds the PATCH payload, sending the family only when it changed. */
export function toUpdateStudentPayload(
  form: StudentEditFormState,
  student: Student,
): UpdateStudentPayload {
  return {
    fullName: form.fullName.trim(),
    birthDate: form.birthDate!,
    gender: form.gender,
    ...(form.familyId && form.familyId !== student.familyId && { familyId: form.familyId }),
    customFields: form.customFields,
  };
}

export function extractErrorMessage(err: unknown, fallback: string): string {
  const e = err as { response?: { data?: { message?: string | string[] } }; message?: string };
  const msg = e?.response?.data?.message || e?.message || fallback;
  return Array.isArray(msg) ? msg.join('، ') : msg;
}
