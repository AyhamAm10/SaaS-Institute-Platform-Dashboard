import {
  Room,
  RoomAvailability,
  RoomAvailabilityWindowPayload,
  RoomType,
} from '@/src/core/api';

export interface RoomFormState {
  name: string;
  type: RoomType | string;
  capacity: number;
  branchId?: number | null;
}

export interface RoomsState {
  // ── Pagination & Filters ──
  page: number;
  limit: number;
  search: string;
  type?: string;
  branchId?: number;

  // ── Query-derived Data ──
  data: Room[];
  total: number;
  totalPages: number;
  isLoading: boolean;
  isFetching: boolean;

  // ── Form Drawer State ──
  drawerOpened: boolean;
  drawerMode: 'create' | 'edit';
  selectedRoom: Room | null;
  form: RoomFormState;
  formErrors: Partial<Record<keyof RoomFormState, string>>;
  generalError: string | null;
  generalSuccess: string | null;
  isSubmitting: boolean;

  // ── Details Drawer State ──
  detailsDrawerOpened: boolean;
  selectedRoomDetails: Room | null;
  stagedAvailabilities: RoomAvailabilityWindowPayload[];
  isSavingAvailabilities: boolean;

  // ── Delete Modal State ──
  deleteModalOpened: boolean;
  roomToDelete: Room | null;
  deleteError: string | null;
  isDeleting: boolean;

  // ── Actions: Filters ──
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSearch: (search: string) => void;
  setType: (type?: string) => void;
  setBranchId: (branchId?: number) => void;

  // ── Actions: Form Drawer ──
  openCreateDrawer: () => void;
  openEditDrawer: (room: Room) => void;
  closeDrawer: () => void;
  setFormField: <K extends keyof RoomFormState>(
    field: K,
    value: RoomFormState[K],
  ) => void;
  resetForm: () => void;
  setFieldError: (field: keyof RoomFormState, error: string | null) => void;
  setGeneralError: (error: string | null) => void;
  setGeneralSuccess: (success: string | null) => void;
  setIsSubmitting: (submitting: boolean) => void;

  // ── Actions: Details Drawer ──
  openDetailsDrawer: (room: Room) => void;
  closeDetailsDrawer: () => void;
  setSelectedRoomDetails: (room: Room | null) => void;
  setStagedAvailabilities: (windows: RoomAvailabilityWindowPayload[]) => void;
  addStagedAvailability: (win: RoomAvailabilityWindowPayload) => void;
  removeStagedAvailability: (index: number) => void;
  setIsSavingAvailabilities: (saving: boolean) => void;

  // ── Actions: Delete Modal ──
  openDeleteModal: (room: Room) => void;
  closeDeleteModal: () => void;
  setDeleteError: (error: string | null) => void;
  setIsDeleting: (deleting: boolean) => void;

  // ── Sync ──
  syncQueryData: (payload: {
    data: Room[];
    total: number;
    totalPages: number;
    isLoading: boolean;
    isFetching: boolean;
  }) => void;
}
