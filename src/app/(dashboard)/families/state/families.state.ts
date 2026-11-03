import { Family } from '@/src/core/api';

export interface FamilyFormState {
  familyName: string;
  fatherName: string;
  motherName: string;
  phone: string;
}

/**
 * FamiliesState
 *
 * Domain state schema for the Families page controller.
 * Defines all state properties, query slots, form inputs, and action signatures.
 */
export interface FamiliesState {
  // ── Search ──
  search: string;

  // ── Query-Derived Data ──
  data: Family[];
  isLoading: boolean;
  isFetching: boolean;

  // ── Form Drawer State (Create / Edit) ──
  drawerOpened: boolean;
  drawerMode: 'create' | 'edit';
  selectedFamily: Family | null;
  form: FamilyFormState;
  formErrors: Record<string, string>;
  generalError: string | null;
  isSubmitting: boolean;

  // ── Delete Modal State ──
  deleteModalOpened: boolean;
  familyToDelete: Family | null;
  deleteError: string | null;
  isDeleting: boolean;

  // ── Actions: Search ──
  setSearch: (search: string) => void;

  // ── Actions: Drawer & Form ──
  openCreateDrawer: () => void;
  openEditDrawer: (family: Family) => void;
  closeDrawer: () => void;
  setFormField: (field: keyof FamilyFormState, value: string) => void;
  setFieldError: (field: string, error: string | null) => void;
  setGeneralError: (error: string | null) => void;
  setIsSubmitting: (submitting: boolean) => void;

  // ── Actions: Delete Modal ──
  openDeleteModal: (family: Family) => void;
  closeDeleteModal: () => void;
  setDeleteError: (error: string | null) => void;
  setIsDeleting: (deleting: boolean) => void;

  // ── Actions: Query Sync ──
  syncQueryData: (payload: { data: Family[]; isLoading: boolean; isFetching: boolean }) => void;
}
