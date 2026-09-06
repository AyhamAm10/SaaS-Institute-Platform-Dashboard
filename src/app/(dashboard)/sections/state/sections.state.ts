import { AcademicYear, Section } from '@/src/core/api';

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
  selectedGrade: string | null;

  // ── Query-Derived Data (synced from React Query) ──
  data: Section[];
  total: number;
  totalPages: number;
  isLoading: boolean;
  isFetching: boolean;

  // ── Academic Years (for filter options & modal) ──
  academicYears: AcademicYear[];

  // ── Form Modal State ──
  formModalOpened: boolean;
  selectedSection: Section | null;

  // ── Fee Modal State ──
  feeModalOpened: boolean;
  feeSection: Section | null;

  // ── Details Drawer State ──
  drawerOpened: boolean;
  detailSectionId: number | null;

  // ── Mutation Loading ──
  formSubmitting: boolean;
  feeSubmitting: boolean;

  // ── Actions: Pagination & Filters ──
  setPage: (page: number) => void;
  setSearch: (search: string) => void;
  setSelectedYearId: (yearId: string | null) => void;
  setSelectedGrade: (grade: string | null) => void;

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

  // ── Actions: Query Sync ──
  syncQueryData: (payload: {
    data: Section[];
    total: number;
    totalPages: number;
    isLoading: boolean;
    isFetching: boolean;
  }) => void;
  syncAcademicYears: (years: AcademicYear[]) => void;

  // ── Actions: Mutations (orchestrated externally) ──
  setFormSubmitting: (submitting: boolean) => void;
  setFeeSubmitting: (submitting: boolean) => void;
}

/**
 * Initial props for the Sections controller.
 */
export interface SectionsInitialProps {}
