import { Subject } from '@/src/core/api';

export interface SubjectFormState {
  name: string;
  code: string;
}

/**
 * SubjectsState
 *
 * Domain state schema for the Subjects page controller.
 * Defines all state properties, query slots, form inputs, and action signatures.
 */
export interface SubjectsState {
  // ── Pagination & Filters ──
  page: number;
  limit: number;
  search: string;

  // ── Query-Derived Data ──
  data: Subject[];
  total: number;
  totalPages: number;
  isLoading: boolean;
  isFetching: boolean;

  // ── Form Drawer State (Create / Edit) ──
  drawerOpened: boolean;
  drawerMode: 'create' | 'edit';
  selectedSubject: Subject | null;
  form: SubjectFormState;
  formErrors: Record<string, string>;
  generalError: string | null;
  generalSuccess: string | null;
  isSubmitting: boolean;

  // ── Delete Modal State ──
  deleteModalOpened: boolean;
  subjectToDelete: Subject | null;
  deleteError: string | null;
  isDeleting: boolean;

  // ── Actions: Pagination & Filters ──
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSearch: (search: string) => void;

  // ── Actions: Drawer & Form ──
  openCreateDrawer: () => void;
  openEditDrawer: (subject: Subject) => void;
  closeDrawer: () => void;
  setFormField: (field: keyof SubjectFormState, value: string) => void;
  resetForm: () => void;
  setFieldError: (field: string, error: string | null) => void;
  setGeneralError: (error: string | null) => void;
  setGeneralSuccess: (success: string | null) => void;
  setIsSubmitting: (submitting: boolean) => void;

  // ── Actions: Delete Modal ──
  openDeleteModal: (subject: Subject) => void;
  closeDeleteModal: () => void;
  setDeleteError: (error: string | null) => void;
  setIsDeleting: (deleting: boolean) => void;

  // ── Actions: Query Sync ──
  syncQueryData: (payload: {
    data: Subject[];
    total: number;
    totalPages: number;
    isLoading: boolean;
    isFetching: boolean;
  }) => void;
}

export interface SubjectsInitialProps {}
