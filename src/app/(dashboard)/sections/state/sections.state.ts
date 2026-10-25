import {
  AcademicBranch,
  AcademicYear,
  Section,
  SectionDetails,
  SectionSubjectItem,
  Subject,
  Teacher,
} from '@/src/core/api';

/**
 * SectionsState
 *
 * Domain state schema for the Sections page controller.
 * Defines all state properties, derived data slots, and action signatures.
 * Adheres strictly to the Controller Component Pattern (role.md).
 */
export interface SectionsState {
  // ── Pagination & Filters ──
  page: number;
  limit: number;
  search: string;
  selectedYearId: string | null;
  selectedBranchId: string | null;
  filterOptionsRequested: boolean;

  // ── Query-Derived Data (synced from React Query) ──
  data: Section[];
  total: number;
  totalPages: number;
  isLoading: boolean;
  isFetching: boolean;

  // ── Academic Years & Academic Branches (for filter options & modal) ──
  academicYears: AcademicYear[];
  academicBranches: AcademicBranch[];

  // ── Form Modal State (Section Create / Edit) ──
  formModalOpened: boolean;
  selectedSection: Section | null;
  sectionForm: {
    name: string;
    academicBranchId: string | null;
    academicYearId: string | null;
    feeAmount: string;
  };
  sectionFormError: string | null;

  // ── Fee Modal State ──
  feeModalOpened: boolean;
  feeSection: Section | null;
  feeFormAmount: string;
  feeError: string | null;

  // ── Details Drawer State ──
  drawerOpened: boolean;
  detailsActiveTab: string;
  detailSectionId: number | null;
  detailsData: SectionDetails | null;
  sectionSubjectsData: SectionSubjectItem[];
  instituteSubjectsData: Subject[];
  teachersData: Teacher[];
  isLoadingDetails: boolean;
  isLoadingSectionSubjects: boolean;

  // ── Academic Branches Management Modal State ──
  branchesModalOpened: boolean;
  branchForm: {
    name: string;
    description: string;
  };
  branchError: string | null;
  branchSuccess: string | null;

  // ── Section Subjects Assignment State ──
  assignSubjectId: string | null;
  assignWeeklyPeriods: number;
  assignTeacherId: string | null;
  assignSubjectError: string | null;
  isAssigningSubject: boolean;
  isRemovingSubjectId: number | null;

  // ── Mutation Loading ──
  formSubmitting: boolean;
  feeSubmitting: boolean;
  branchSubmitting: boolean;

  // ── Actions: Section Subjects ──
  setAssignSubjectId: (id: string | null) => void;
  setAssignWeeklyPeriods: (periods: number) => void;
  setAssignTeacherId: (teacherId: string | null) => void;
  setAssignSubjectError: (error: string | null) => void;
  setIsAssigningSubject: (submitting: boolean) => void;
  setIsRemovingSubjectId: (id: number | null) => void;

  // ── Actions: Pagination & Filters ──
  setPage: (page: number) => void;
  setSearch: (search: string) => void;
  setSelectedYearId: (yearId: string | null) => void;
  setSelectedBranchId: (branchId: string | null) => void;
  requestFilterOptions: () => void;

  // ── Actions: Form Modal ──
  openCreate: () => void;
  openEdit: (section: Section) => void;
  closeFormModal: () => void;
  setSectionFormField: (
    field: 'name' | 'academicBranchId' | 'academicYearId' | 'feeAmount',
    value: string | null,
  ) => void;
  setSectionFormError: (error: string | null) => void;
  resetSectionForm: () => void;

  // ── Actions: Fee Modal ──
  openFeeModal: (section: Section) => void;
  closeFeeModal: () => void;
  setFeeFormAmount: (amount: string) => void;
  setFeeError: (error: string | null) => void;

  // ── Actions: Details Drawer ──
  openDetails: (section: Section, tab?: string) => void;
  setDetailsActiveTab: (tab: string) => void;
  closeDrawer: () => void;

  // ── Actions: Branches Modal ──
  openBranchesModal: () => void;
  closeBranchesModal: () => void;
  setBranchFormField: (field: 'name' | 'description', value: string) => void;
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
  syncSectionDetails: (details: SectionDetails | null, isLoading: boolean) => void;
  syncSectionSubjects: (subjects: SectionSubjectItem[], isLoading: boolean) => void;
  syncInstituteSubjects: (subjects: Subject[]) => void;
  syncTeachers: (teachers: Teacher[]) => void;

  // ── Actions: Mutations (orchestrated externally) ──
  setFormSubmitting: (submitting: boolean) => void;
  setFeeSubmitting: (submitting: boolean) => void;
  setBranchSubmitting: (submitting: boolean) => void;
}

/**
 * Initial props for the Sections controller.
 */
export type SectionsInitialProps = Record<string, never>;
