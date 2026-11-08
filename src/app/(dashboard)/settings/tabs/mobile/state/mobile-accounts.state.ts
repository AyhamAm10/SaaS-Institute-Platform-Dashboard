import {
  GuardianRelationship,
  MobileAccountItem,
  MobileAccountRole,
} from '@/src/core/api';

export interface MobileGuardianForm {
  familyId: number | null;
  familyName: string;
  fullName: string;
  phone: string;
  relationship: GuardianRelationship;
  password: string;
}

export interface MobileStudentForm {
  studentId: number | null;
  studentName: string;
  phone: string;
  password: string;
}

export interface MobileAccountsState {
  data: MobileAccountItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  search: string;
  roleFilter: MobileAccountRole | null;
  isLoading: boolean;

  // Drawer
  drawerOpened: boolean;
  drawerType: MobileAccountRole;
  guardianForm: MobileGuardianForm;
  studentForm: MobileStudentForm;
  drawerError: string | null;
  isSubmittingDrawer: boolean;

  // Password Modal
  passwordModalOpened: boolean;
  selectedAccount: MobileAccountItem | null;
  newPassword: string;
  passwordError: string | null;
  isPasswordSubmitting: boolean;

  // Deactivate Modal
  deactivateModalOpened: boolean;
  deactivateTarget: MobileAccountItem | null;
  isDeactivating: boolean;
  deactivateError: string | null;

  // Actions
  setPage: (page: number) => void;
  setSearch: (search: string) => void;
  setRoleFilter: (role: MobileAccountRole | null) => void;
  syncData: (payload: { data: MobileAccountItem[]; total: number; totalPages: number; isLoading: boolean }) => void;

  openDrawer: (type?: MobileAccountRole) => void;
  closeDrawer: () => void;
  setDrawerType: (type: MobileAccountRole) => void;
  setGuardianFormField: <K extends keyof MobileGuardianForm>(field: K, value: MobileGuardianForm[K]) => void;
  setStudentFormField: <K extends keyof MobileStudentForm>(field: K, value: MobileStudentForm[K]) => void;
  setDrawerError: (error: string | null) => void;
  setIsSubmittingDrawer: (submitting: boolean) => void;

  openPasswordModal: (account: MobileAccountItem) => void;
  closePasswordModal: () => void;
  setNewPassword: (password: string) => void;
  setPasswordError: (error: string | null) => void;
  setIsPasswordSubmitting: (submitting: boolean) => void;

  openDeactivateModal: (account: MobileAccountItem) => void;
  closeDeactivateModal: () => void;
  setIsDeactivating: (deactivating: boolean) => void;
  setDeactivateError: (error: string | null) => void;
}

