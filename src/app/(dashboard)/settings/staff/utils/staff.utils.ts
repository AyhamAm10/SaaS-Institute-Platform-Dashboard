import type { CreateStaffPayload, StaffMember, StaffRole, UpdateStaffPayload } from '@/src/core/api';
import { passwordError, STAFF_PASSWORD_MIN } from '@/src/core/auth';

export { passwordError, STAFF_PASSWORD_MIN };

/** Staff drawer form (inputs as strings). */
export interface StaffForm {
  fullName: string;
  phone: string;
  role: StaffRole | null;
  password: string;
}

export type StaffFormErrors = Partial<Record<keyof StaffForm, string>>;

export const EMPTY_STAFF_FORM: StaffForm = { fullName: '', phone: '', role: null, password: '' };

export function staffFormFrom(member: StaffMember): StaffForm {
  return { fullName: member.fullName, phone: member.phone, role: member.role, password: '' };
}

/** Field errors of the staff form; empty object = valid. Phone and password only on create. */
export function validateStaffForm(form: StaffForm, isCreate: boolean): StaffFormErrors {
  const errors: StaffFormErrors = {};
  if (!form.fullName.trim()) errors.fullName = 'الاسم مطلوب';
  if (!form.role) errors.role = 'الدور مطلوب';
  if (isCreate) {
    if (!form.phone.trim()) errors.phone = 'رقم الهاتف مطلوب';
    const pwd = passwordError(form.password);
    if (pwd) errors.password = pwd;
  }
  return errors;
}

export function toCreateStaffPayload(form: StaffForm): CreateStaffPayload {
  return {
    fullName: form.fullName.trim(),
    phone: form.phone.trim(),
    role: form.role as StaffRole,
    password: form.password,
  };
}

/** Only the changed fields; the role is left out for the signed-in user (the server refuses it). */
export function toUpdateStaffPayload(form: StaffForm, member: StaffMember, isSelf: boolean): UpdateStaffPayload {
  const payload: UpdateStaffPayload = {};
  const fullName = form.fullName.trim();
  if (fullName !== member.fullName) payload.fullName = fullName;
  if (!isSelf && form.role && form.role !== member.role) payload.role = form.role;
  return payload;
}
