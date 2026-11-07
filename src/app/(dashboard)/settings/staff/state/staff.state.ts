import type { StaffMember, StaffRole } from '@/src/core/api';
import type { StaffForm, StaffFormErrors } from '../utils/staff.utils';

export type StaffModal = 'password' | 'deactivate' | null;

/**
 * StaffState
 *
 * Staff page (D2): filtered list, the create / edit drawer, and the reset
 * password and deactivate modals of one member.
 */
export interface StaffState {
  page: number;
  limit: number;
  search: string;
  roleFilter: StaffRole | null;
  data: StaffMember[];
  total: number;
  totalPages: number;
  isLoading: boolean;

  drawerOpened: boolean;
  editing: StaffMember | null;
  form: StaffForm;
  formErrors: StaffFormErrors;
  generalError: string | null;
  isSubmitting: boolean;

  modal: StaffModal;
  target: StaffMember | null;
  newPassword: string;
  modalError: string | null;
  isModalSubmitting: boolean;

  setPage: (page: number) => void;
  setSearch: (search: string) => void;
  setRoleFilter: (role: StaffRole | null) => void;
  openCreate: () => void;
  openEdit: (member: StaffMember) => void;
  closeDrawer: () => void;
  setField: <K extends keyof StaffForm>(key: K, value: StaffForm[K]) => void;
  setFormErrors: (errors: StaffFormErrors) => void;
  setGeneralError: (error: string | null) => void;
  setIsSubmitting: (value: boolean) => void;
  openModal: (modal: Exclude<StaffModal, null>, member: StaffMember) => void;
  closeModal: () => void;
  setNewPassword: (password: string) => void;
  setModalError: (error: string | null) => void;
  setIsModalSubmitting: (value: boolean) => void;
  syncQueryData: (payload: { data: StaffMember[]; total: number; totalPages: number; isLoading: boolean }) => void;
}
