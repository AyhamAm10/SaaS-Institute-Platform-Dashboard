import { AcademicYear } from '@/src/core/api';

/**
 * AcademicYearsState
 *
 * Domain state schema for the Academic Years page controller.
 * Defines all state properties, derived data slots, and action signatures.
 */
export interface AcademicYearsState {
  // ── Pagination & Filters ──
  page: number;
  limit: number;
  search: string;

  // ── Query-Derived Data (synced from React Query) ──
  data: AcademicYear[];
  total: number;
  totalPages: number;
  isLoading: boolean;
  isFetching: boolean;

  // ── Modal / Drawer State ──
  modalOpened: boolean;
  selectedYear: AcademicYear | null;

  // ── Set-Current Workflow Drawer State ──
  setCurrentDrawerOpened: boolean;
  selectedYearForSetCurrent: AcademicYear | null;
  setCurrentPending: boolean;
  setCurrentTargetId: number | null;

  // ── Mutation Loading ──
  formSubmitting: boolean;

  // ── Actions: Pagination & Filters ──
  setPage: (page: number) => void;
  setSearch: (search: string) => void;

  // ── Actions: Create/Edit Drawer ──
  openCreate: () => void;
  openEdit: (year: AcademicYear) => void;
  closeModal: () => void;

  // ── Actions: Set Current Drawer ──
  openSetCurrentDrawer: (year: AcademicYear) => void;
  closeSetCurrentDrawer: () => void;

  // ── Actions: Query Sync ──
  syncQueryData: (payload: {
    data: AcademicYear[];
    total: number;
    totalPages: number;
    isLoading: boolean;
    isFetching: boolean;
  }) => void;

  // ── Actions: Mutations (orchestrated externally) ──
  setFormSubmitting: (submitting: boolean) => void;
  setSetCurrentPending: (pending: boolean, targetId: number | null) => void;
}

/**
 * Initial props for the Academic Years controller.
 * Currently empty — reserved for server-side params if needed in the future.
 */
export interface AcademicYearsInitialProps {}
