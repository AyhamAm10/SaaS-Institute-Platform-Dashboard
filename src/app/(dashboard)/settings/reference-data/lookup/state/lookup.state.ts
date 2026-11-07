import type { LookupItem } from '@/src/core/api';
import { LookupConfig, LookupFormValue, LookupOptionsSource } from '../lookup.config';
import type { LookupForm } from '../utils/lookup-form.utils';

export interface SelectOption {
  value: string;
  label: string;
}

/**
 * LookupState
 *
 * State of one reference table (one LookupController instance per tab).
 */
export interface LookupState {
  config: LookupConfig;

  // ── Pagination & Search ──
  page: number;
  limit: number;
  search: string;

  // ── Query-Derived Data ──
  data: LookupItem[];
  total: number;
  totalPages: number;
  isLoading: boolean;
  isFetching: boolean;
  options: Partial<Record<LookupOptionsSource, SelectOption[]>>;

  // ── Form Drawer ──
  drawerOpened: boolean;
  editing: LookupItem | null;
  form: LookupForm;
  formErrors: Record<string, string>;
  generalError: string | null;
  isSubmitting: boolean;

  // ── Delete Modal ──
  deleteTarget: LookupItem | null;
  deleteError: string | null;
  isDeleting: boolean;

  // ── Actions ──
  setPage: (page: number) => void;
  setSearch: (search: string) => void;
  openCreate: () => void;
  openEdit: (item: LookupItem) => void;
  closeDrawer: () => void;
  setField: (name: string, value: LookupFormValue) => void;
  setFormErrors: (errors: Record<string, string>) => void;
  setGeneralError: (error: string | null) => void;
  setIsSubmitting: (submitting: boolean) => void;
  openDelete: (item: LookupItem) => void;
  closeDelete: () => void;
  setDeleteError: (error: string | null) => void;
  setIsDeleting: (deleting: boolean) => void;
  syncQueryData: (payload: {
    data: LookupItem[];
    total: number;
    totalPages: number;
    isLoading: boolean;
    isFetching: boolean;
  }) => void;
  syncOptions: (source: LookupOptionsSource, options: SelectOption[]) => void;
}
