import {
  AvailabilityWindowPayload,
  Teacher,
  TeacherAssignment,
  TeacherAvailability,
} from '@/src/core/api';

export interface TeacherFormState {
  fullName: string;
  phone: string;
  password?: string;
  specialization: string;
  branchIds: number[];
  isActive: boolean;
}

export interface TeachersState {
  // ── Pagination & Filters ──
  page: number;
  limit: number;
  search: string;
  branchId?: number;

  // ── Query-derived Data ──
  data: Teacher[];
  total: number;
  totalPages: number;
  isLoading: boolean;
  isFetching: boolean;

  // ── Form Drawer State ──
  drawerOpened: boolean;
  drawerMode: 'create' | 'edit';
  selectedTeacher: Teacher | null;
  form: TeacherFormState;
  formErrors: Partial<Record<keyof TeacherFormState, string>>;
  generalError: string | null;
  generalSuccess: string | null;
  isSubmitting: boolean;

  // ── Details Drawer State ──
  detailsDrawerOpened: boolean;
  activeDetailsTab: string;
  selectedTeacherDetails: Teacher | null;
  isDetailsLoading: boolean;

  // ── Qualifications sub-state inside details drawer ──
  newAcademicBranchId?: number;
  newSubjectId?: number;
  isAssigningQualification: boolean;

  // ── Availability sub-state inside details drawer ──
  stagedAvailabilities: AvailabilityWindowPayload[];
  isSavingAvailabilities: boolean;

  // ── Delete Modal State ──
  deleteModalOpened: boolean;
  teacherToDelete: Teacher | null;
  deleteError: string | null;
  isDeleting: boolean;

  // ── Actions: Filters ──
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSearch: (search: string) => void;
  setBranchId: (branchId?: number) => void;

  // ── Actions: Form Drawer ──
  openCreateDrawer: () => void;
  openEditDrawer: (teacher: Teacher) => void;
  closeDrawer: () => void;
  setFormField: <K extends keyof TeacherFormState>(
    field: K,
    value: TeacherFormState[K],
  ) => void;
  resetForm: () => void;
  setFieldError: (field: keyof TeacherFormState, error: string | null) => void;
  setGeneralError: (error: string | null) => void;
  setGeneralSuccess: (success: string | null) => void;
  setIsSubmitting: (submitting: boolean) => void;

  // ── Actions: Details Drawer ──
  openDetailsDrawer: (teacher: Teacher) => void;
  closeDetailsDrawer: () => void;
  setActiveDetailsTab: (tab: string) => void;
  setSelectedTeacherDetails: (teacher: Teacher | null) => void;
  setIsDetailsLoading: (loading: boolean) => void;

  setNewAcademicBranchId: (id?: number) => void;
  setNewSubjectId: (id?: number) => void;
  setIsAssigningQualification: (loading: boolean) => void;

  setStagedAvailabilities: (windows: AvailabilityWindowPayload[]) => void;
  addStagedAvailability: (win: AvailabilityWindowPayload) => void;
  removeStagedAvailability: (index: number) => void;
  setIsSavingAvailabilities: (saving: boolean) => void;

  // ── Actions: Delete Modal ──
  openDeleteModal: (teacher: Teacher) => void;
  closeDeleteModal: () => void;
  setDeleteError: (error: string | null) => void;
  setIsDeleting: (deleting: boolean) => void;

  // ── Query Synchronization ──
  syncQueryData: (payload: {
    data: Teacher[];
    total: number;
    totalPages: number;
    isLoading: boolean;
    isFetching: boolean;
  }) => void;
}
