import {
  DashboardOverview,
  Family,
  Student,
  StudentDeletionReport,
  StudentField,
} from '@/src/core/api';
import type {
  StudentReferenceField,
  StudentReferenceOptions,
  StudentReferenceValues,
} from '../utils/student-references.utils';
import type { FinanceStudent } from '../finance/state/student-finance.state';

/** List filters by reference data (null = all). */
export interface StudentListFilters {
  statusId: number | null;
  busId: number | null;
  cityId: number | null;
  /** Students without an enrollment in this academic year. */
  unassignedYearId: number | null;
}

export type CustomFieldValue = string | number | boolean | null;

export interface StudentEditFormState {
  fullName: string;
  birthDate: string | null;
  gender: 'MALE' | 'FEMALE';
  familyId: number | null;
  customFields: Record<string, CustomFieldValue>;
  references: StudentReferenceValues;
}

export interface StudentsState {
  students: Student[];
  total: number;
  totalPages: number;
  page: number;
  limit: number;
  search: string;
  selectedBranchId: number | null;
  filters: StudentListFilters;
  isLoading: boolean;

  // ── Reference-data options (filters + edit drawer) ──
  referenceOptions: StudentReferenceOptions;
  yearOptions: { value: string; label: string }[];

  // ── Edit Drawer State ──
  editDrawerOpened: boolean;
  selectedStudent: Student | null;
  form: StudentEditFormState;
  formErrors: Record<string, string>;
  generalError: string | null;
  isSubmitting: boolean;

  // ── Edit Drawer Lookups (families search & institute custom fields) ──
  familySearch: string;
  familyOptions: Family[];
  isLoadingFamilies: boolean;
  studentFields: StudentField[];

  // ── Delete Modal State ──
  deleteModalOpened: boolean;
  studentToDelete: Student | null;

  /** Student whose finance drawer is open (E10). */
  financeStudent: FinanceStudent | null;

  /** Real KPIs above the table (GET /dashboard/overview). */
  overview: DashboardOverview | null;
  deletionReport: StudentDeletionReport | null;
  isLoadingDeletionReport: boolean;
  deleteError: string | null;
  isDeleting: boolean;

  setPage: (page: number) => void;
  setSearch: (search: string) => void;
  setSelectedBranchId: (branchId: number | null) => void;
  setFilter: (field: keyof StudentListFilters, value: number | null) => void;
  syncReferenceOptions: (options: StudentReferenceOptions) => void;
  syncYearOptions: (options: { value: string; label: string }[]) => void;
  syncQueryData: (payload: {
    data: Student[];
    total: number;
    totalPages: number;
    isLoading: boolean;
  }) => void;

  // ── Actions: Edit Drawer ──
  openEditDrawer: (student: Student) => void;
  closeEditDrawer: () => void;
  setFormField: <K extends keyof StudentEditFormState>(
    field: K,
    value: StudentEditFormState[K],
  ) => void;
  setCustomFieldValue: (name: string, value: CustomFieldValue) => void;
  setReference: (field: StudentReferenceField, value: number | null) => void;
  setFamilySearch: (search: string) => void;
  setFieldError: (field: string, error: string | null) => void;
  setGeneralError: (error: string | null) => void;
  setIsSubmitting: (submitting: boolean) => void;
  syncEditLookups: (payload: {
    families: Family[];
    isLoadingFamilies: boolean;
    fields: StudentField[];
  }) => void;

  // ── Actions: Delete Modal ──
  openDeleteModal: (student: Student) => void;
  openFinance: (student: Student) => void;
  syncOverview: (overview: DashboardOverview | null) => void;
  closeFinance: () => void;
  closeDeleteModal: () => void;
  setDeleteError: (error: string | null) => void;
  setIsDeleting: (deleting: boolean) => void;
  syncDeletionReport: (payload: {
    report: StudentDeletionReport | null;
    isLoading: boolean;
  }) => void;
}
