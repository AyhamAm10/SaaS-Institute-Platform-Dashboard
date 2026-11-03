import { Family, Student, StudentDeletionReport, StudentField } from '@/src/core/api';

export type CustomFieldValue = string | number | boolean | null;

export interface StudentEditFormState {
  fullName: string;
  birthDate: string | null;
  gender: 'MALE' | 'FEMALE';
  familyId: number | null;
  customFields: Record<string, CustomFieldValue>;
}

export interface StudentsState {
  students: Student[];
  total: number;
  totalPages: number;
  page: number;
  limit: number;
  search: string;
  selectedBranchId: number | null;
  isLoading: boolean;

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
  deletionReport: StudentDeletionReport | null;
  isLoadingDeletionReport: boolean;
  deleteError: string | null;
  isDeleting: boolean;

  setPage: (page: number) => void;
  setSearch: (search: string) => void;
  setSelectedBranchId: (branchId: number | null) => void;
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
  closeDeleteModal: () => void;
  setDeleteError: (error: string | null) => void;
  setIsDeleting: (deleting: boolean) => void;
  syncDeletionReport: (payload: {
    report: StudentDeletionReport | null;
    isLoading: boolean;
  }) => void;
}
