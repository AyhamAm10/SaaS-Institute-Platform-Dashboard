import type { AccountItem, AccountType, AccountsSummary, EligibleStudentItem } from '@/src/core/api';
import type {
  AccountStatusFilter,
  StaffForm,
  StaffFormErrors,
  StudentAccountErrors,
  StudentAccountForm,
} from '../utils/accounts.utils';

export type AccountModal = 'reset' | 'deactivate' | 'activate' | null;

/** Which family accounts are missing, and the result of the last back-fill. */
export interface FamilySyncState {
  summary: AccountsSummary | null;
  isSyncing: boolean;
  notice: string | null;
  error: string | null;
}

/**
 * AccountsState
 *
 * One list at a time (the active sub-tab), the reset / switch confirmation of
 * one account, the staff drawer and the student-account drawer.
 */
export interface AccountsState extends FamilySyncState {
  type: AccountType;
  page: number;
  limit: number;
  search: string;
  status: AccountStatusFilter;
  data: AccountItem[];
  total: number;
  totalPages: number;
  isLoading: boolean;

  modal: AccountModal;
  target: AccountItem | null;
  modalError: string | null;
  isModalSubmitting: boolean;

  staffDrawerOpened: boolean;
  editingStaff: AccountItem | null;
  staffForm: StaffForm;
  staffErrors: StaffFormErrors;
  staffGeneralError: string | null;
  isStaffSubmitting: boolean;

  studentDrawerOpened: boolean;
  studentForm: StudentAccountForm;
  studentErrors: StudentAccountErrors;
  studentGeneralError: string | null;
  isStudentSubmitting: boolean;
  studentSearch: string;
  eligibleStudents: EligibleStudentItem[];

  setType: (type: AccountType) => void;
  setPage: (page: number) => void;
  setSearch: (search: string) => void;
  setStatus: (status: AccountStatusFilter) => void;
  openModal: (modal: Exclude<AccountModal, null>, account: AccountItem) => void;
  closeModal: () => void;
  setModalError: (error: string | null) => void;
  setIsModalSubmitting: (value: boolean) => void;

  openStaffCreate: () => void;
  openStaffEdit: (member: AccountItem) => void;
  closeStaffDrawer: () => void;
  setStaffField: <K extends keyof StaffForm>(key: K, value: StaffForm[K]) => void;
  setStaffErrors: (errors: StaffFormErrors) => void;
  setStaffGeneralError: (error: string | null) => void;
  setIsStaffSubmitting: (value: boolean) => void;

  openStudentDrawer: () => void;
  closeStudentDrawer: () => void;
  setStudentField: <K extends keyof StudentAccountForm>(key: K, value: StudentAccountForm[K]) => void;
  setStudentErrors: (errors: StudentAccountErrors) => void;
  setStudentGeneralError: (error: string | null) => void;
  setIsStudentSubmitting: (value: boolean) => void;
  setStudentSearch: (search: string) => void;

  setIsSyncing: (value: boolean) => void;
  setSyncResult: (notice: string | null, error: string | null) => void;
  syncList: (payload: { data: AccountItem[]; total: number; totalPages: number; isLoading: boolean }) => void;
  syncSummary: (summary: AccountsSummary | null) => void;
  syncEligible: (students: EligibleStudentItem[]) => void;
}
