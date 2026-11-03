import { FeatureKey, FeatureStatus, Institute } from '@/src/core/api';

export interface InstituteFormState {
  name: string;
  code: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  phone: string;
  address: string;
  // Creation-only (initial administrator account)
  adminFullName: string;
  adminPhone: string;
  adminPassword: string;
}

export type InstituteDrawerMode = 'create' | 'edit';

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

  // ── Form Drawer State (Create / Edit) ──
  formDrawerOpened: boolean;
  drawerMode: InstituteDrawerMode;
  editingInstitute: Institute | null;
  form: InstituteFormState;
  formErrors: Record<string, string>;
  generalError: string | null;
  generalSuccess: string | null;
  isSubmitting: boolean;

  // ── Details Drawer State ──
  detailsDrawerOpened: boolean;
  selectedInstitute: Institute | null;

  // ── Feature Flags (of the selected institute) ──
  features: FeatureStatus[];
  isLoadingFeatures: boolean;
  featureSavingKey: FeatureKey | null;
  featuresError: string | null;

  // ── Actions: Pagination & Filters ──
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSearch: (search: string) => void;

  // ── Actions: Form Drawer ──
  openCreateDrawer: () => void;
  openEditDrawer: (institute: Institute) => void;
  closeFormDrawer: () => void;
  setFormField: (field: keyof InstituteFormState, value: string) => void;
  resetForm: () => void;
  setFieldError: (field: string, error: string | null) => void;
  setGeneralError: (error: string | null) => void;
  setGeneralSuccess: (success: string | null) => void;
  setIsSubmitting: (submitting: boolean) => void;

  // ── Actions: Details Drawer ──
  openDetailsDrawer: (institute: Institute) => void;
  closeDetailsDrawer: () => void;

  // ── Actions: Feature Flags ──
  setFeatureSavingKey: (key: FeatureKey | null) => void;
  setFeaturesError: (error: string | null) => void;
  syncFeatures: (payload: { features: FeatureStatus[]; isLoading: boolean }) => void;

  // ── Actions: Query Sync ──
  syncQueryData: (payload: {
    data: Institute[];
    total: number;
    totalPages: number;
    isLoading: boolean;
    isFetching: boolean;
  }) => void;
}
