import { Institute } from '@/src/core/api';

export interface CreateInstituteFormState {
  name: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  phone: string;
  address: string;
  adminFullName: string;
  adminPhone: string;
  adminPassword: string;
}

/**
 * InstitutesState
 *
 * Domain state schema for the Institutes page controller.
 * Defines all state properties, query slots, form inputs, and action signatures.
 */
export interface InstitutesState {
  // ── Pagination & Filters ──
  page: number;
  limit: number;
  search: string;

  // ── Query-Derived Data ──
  data: Institute[];
  total: number;
  totalPages: number;
  isLoading: boolean;
  isFetching: boolean;

  // ── Form State (Creation Drawer) ──
  createDrawerOpened: boolean;
  form: CreateInstituteFormState;
  formErrors: Record<string, string>;
  generalError: string | null;
  generalSuccess: string | null;
  isSubmitting: boolean;

  // ── Details Drawer State ──
  detailsDrawerOpened: boolean;
  selectedInstitute: Institute | null;

  // ── Actions: Pagination & Filters ──
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSearch: (search: string) => void;

  // ── Actions: Create Drawer & Form ──
  openCreateDrawer: () => void;
  closeCreateDrawer: () => void;
  setFormField: (field: keyof CreateInstituteFormState, value: string) => void;
  resetForm: () => void;
  setFieldError: (field: string, error: string | null) => void;
  setGeneralError: (error: string | null) => void;
  setGeneralSuccess: (success: string | null) => void;
  setIsSubmitting: (submitting: boolean) => void;

  // ── Actions: Details Drawer ──
  openDetailsDrawer: (institute: Institute) => void;
  closeDetailsDrawer: () => void;

  // ── Actions: Query Sync ──
  syncQueryData: (payload: {
    data: Institute[];
    total: number;
    totalPages: number;
    isLoading: boolean;
    isFetching: boolean;
  }) => void;
}

export interface InstitutesInitialProps {}
