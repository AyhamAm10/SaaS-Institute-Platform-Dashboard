import { AcademicBranch, AcademicYear, Section } from '@/src/core/api';

/**
 * SectionsState
 *
 * Domain state schema for the Sections page controller.
 * Defines all state properties, derived data slots, and action signatures.
 */
export interface SectionsState {
  // ── Pagination & Filters ──
  page: number;
  limit: number;
  search: string;
  selectedYearId: string | null;
  selectedBranchId: string | null;

  // ── Query-Derived Data (synced from React Query) ──
  data: Section[];
  total: number;
  totalPages: number;
  isLoading: boolean;
  isFetching: boolean;

  // ── Academic Years & Academic Branches (for filter options & modal) ──
  academicYears: AcademicYear[];
  academicBranches: AcademicBranch[];

  // ── Form Modal State ──
  formModalOpened: boolean;
  selectedSection: Section | null;

  // ── Fee Modal State ──
  feeModalOpened: boolean;
  feeSection: Section | null;

  // ── Details Drawer State ──
  drawerOpened: boolean;
  detailSectionId: number | null;

  // ── Academic Branches Management Modal State ──
  branchesModalOpened: boolean;
  branchForm: {
    name: string;
    code: string;
    description: string;
  };
  branchError: string | null;
  branchSuccess: string | null;

  // ── Mutation Loading ──
  formSubmitting: boolean;
  feeSubmitting: boolean;
  branchSubmitting: boolean;

  // ── Actions: Pagination & Filters ──
  setPage: (page: number) => void;
  setSearch: (search: string) => void;
  setSelectedYearId: (yearId: string | null) => void;
  setSelectedBranchId: (branchId: string | null) => void;

  // ── Actions: Form Modal ──
  openCreate: () => void;
  openEdit: (section: Section) => void;
  closeFormModal: () => void;

  // ── Actions: Fee Modal ──
  openFeeModal: (section: Section) => void;
  closeFeeModal: () => void;

  // ── Actions: Details Drawer ──
  openDetails: (section: Section) => void;
  closeDrawer: () => void;

  // ── Actions: Branches Modal ──
  openBranchesModal: () => void;
  closeBranchesModal: () => void;
  setBranchFormField: (field: 'name' | 'code' | 'description', value: string) => void;
  resetBranchForm: () => void;
  setBranchError: (error: string | null) => void;
  setBranchSuccess: (success: string | null) => void;

  // ── Actions: Query Sync ──
  syncQueryData: (payload: {
    data: Section[];
    total: number;
    totalPages: number;
    isLoading: boolean;
    isFetching: boolean;
  }) => void;
  syncAcademicYears: (years: AcademicYear[]) => void;
  syncAcademicBranches: (branches: AcademicBranch[]) => void;

  // ── Actions: Mutations (orchestrated externally) ──
  setFormSubmitting: (submitting: boolean) => void;
  setFeeSubmitting: (submitting: boolean) => void;
  setBranchSubmitting: (submitting: boolean) => void;
}

/**
 * Initial props for the Sections controller.
 */
export interface SectionsInitialProps {}
