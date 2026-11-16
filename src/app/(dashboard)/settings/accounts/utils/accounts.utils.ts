import type {
  AccountItem,
  AccountsQueryParams,
  CreateStaffPayload,
  CreateStudentAccountPayload,
  StaffRole,
  UpdateStaffPayload,
} from '@/src/core/api';
import { accountsLabels as labels } from '../static-data/accounts.data';

export type AccountStatusFilter = 'active' | 'inactive' | null;

/** Staff drawer form (inputs as strings). No password: the account starts on the default one. */
export interface StaffForm {
  fullName: string;
  phone: string;
  role: StaffRole | null;
}

export type StaffFormErrors = Partial<Record<keyof StaffForm, string>>;

export const EMPTY_STAFF_FORM: StaffForm = { fullName: '', phone: '', role: null };

export function staffFormFrom(member: AccountItem): StaffForm {
  return { fullName: member.fullName, phone: member.phone, role: member.role as StaffRole };
}

/** Field errors of the staff form; empty = valid. The phone is only asked on create. */
export function validateStaffForm(form: StaffForm, isCreate: boolean): StaffFormErrors {
  const errors: StaffFormErrors = {};
  if (!form.fullName.trim()) errors.fullName = 'الاسم مطلوب';
  if (!form.role) errors.role = 'الدور مطلوب';
  if (isCreate && !form.phone.trim()) errors.phone = labels.phoneRequired;
  return errors;
}

export function toCreateStaffPayload(form: StaffForm): CreateStaffPayload {
  return { fullName: form.fullName.trim(), phone: form.phone.trim(), role: form.role as StaffRole };
}

/** Only the changed fields; the role is left out for the signed-in user (the server refuses it). */
export function toUpdateStaffPayload(form: StaffForm, member: AccountItem, isSelf: boolean): UpdateStaffPayload {
  const payload: UpdateStaffPayload = {};
  const fullName = form.fullName.trim();
  if (fullName !== member.fullName) payload.fullName = fullName;
  if (!isSelf && form.role && form.role !== member.role) payload.role = form.role;
  return payload;
}

/** Student account drawer form. */
export interface StudentAccountForm {
  studentId: string | null;
  phone: string;
}

export type StudentAccountErrors = Partial<Record<keyof StudentAccountForm, string>>;

export const EMPTY_STUDENT_FORM: StudentAccountForm = { studentId: null, phone: '' };

export function validateStudentForm(form: StudentAccountForm): StudentAccountErrors {
  const errors: StudentAccountErrors = {};
  if (!form.studentId) errors.studentId = labels.studentRequired;
  if (!form.phone.trim()) errors.phone = labels.phoneRequired;
  return errors;
}

export function toStudentPayload(form: StudentAccountForm): CreateStudentAccountPayload {
  return { studentId: Number(form.studentId), phone: form.phone.trim() };
}

/** Query params of the list: no empty search, no "all" status. */
export function toQueryParams(
  type: AccountsQueryParams['type'],
  page: number,
  limit: number,
  search: string,
  status: AccountStatusFilter,
): AccountsQueryParams {
  return { type, page, limit, search: search.trim() || undefined, status: status ?? undefined };
}

/** Which confirmation an account row asks for: switching off, on, or a reset. */
export function toggleModalFor(account: AccountItem): 'deactivate' | 'activate' {
  return account.isActive ? 'deactivate' : 'activate';
}
