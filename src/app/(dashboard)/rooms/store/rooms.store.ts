'use client';

import { createContext, useContext } from 'react';
import { createControllerStore } from '@/src/core/mirror';
import { ControllerStoreApi } from '@/src/core/mirror/types';
import { RoomFormState, RoomsState } from '../state/rooms.state';

export type RoomsStore = ControllerStoreApi<RoomsState>;

const defaultFormState: RoomFormState = {
  name: '',
  type: 'CLASSROOM',
  capacity: 30,
  branchId: null,
};

export function createRoomsStore(): RoomsStore {
  return createControllerStore<RoomsState>((set) => ({
    page: 1,
    limit: 10,
    search: '',
    type: undefined,
    branchId: undefined,

    data: [],
    total: 0,
    totalPages: 1,
    isLoading: true,
    isFetching: false,

    drawerOpened: false,
    drawerMode: 'create',
    selectedRoom: null,
    form: { ...defaultFormState },
    formErrors: {},
    generalError: null,
    generalSuccess: null,
    isSubmitting: false,

    detailsDrawerOpened: false,
    selectedRoomDetails: null,
    stagedAvailabilities: [],
    isSavingAvailabilities: false,

    deleteModalOpened: false,
    roomToDelete: null,
    deleteError: null,
    isDeleting: false,

    setPage: (page) => set({ page }),
    setLimit: (limit) => set({ limit, page: 1 }),
    setSearch: (search) => set({ search, page: 1 }),
    setType: (type) => set({ type, page: 1 }),
    setBranchId: (branchId) => set({ branchId, page: 1 }),

    openCreateDrawer: () =>
      set({
        drawerOpened: true,
        drawerMode: 'create',
        selectedRoom: null,
        form: { ...defaultFormState },
        formErrors: {},
        generalError: null,
        generalSuccess: null,
      }),

    openEditDrawer: (room) =>
      set({
        drawerOpened: true,
        drawerMode: 'edit',
        selectedRoom: room,
        form: {
          name: room.name,
          type: room.type,
          capacity: room.capacity,
          branchId: room.branchId ?? null,
        },
        formErrors: {},
        generalError: null,
        generalSuccess: null,
      }),

    closeDrawer: () => set({ drawerOpened: false }),

    setFormField: (field, value) =>
      set((state) => ({
        form: { ...state.form, [field]: value },
        formErrors: { ...state.formErrors, [field]: undefined },
      })),

    resetForm: () =>
      set({
        form: { ...defaultFormState },
        formErrors: {},
        generalError: null,
        generalSuccess: null,
      }),

    setFieldError: (field, error) =>
      set((state) => ({
        formErrors: { ...state.formErrors, [field]: error || undefined },
      })),

    setGeneralError: (error) => set({ generalError: error }),
    setGeneralSuccess: (success) => set({ generalSuccess: success }),
    setIsSubmitting: (submitting) => set({ isSubmitting: submitting }),

    openDetailsDrawer: (room) =>
      set({
        detailsDrawerOpened: true,
        selectedRoomDetails: room,
        stagedAvailabilities:
          room.availabilities?.map((a) => ({
            dayOfWeek: a.dayOfWeek,
            startTime: a.startTime,
            endTime: a.endTime,
          })) || [],
      }),

    closeDetailsDrawer: () =>
      set({
        detailsDrawerOpened: false,
        selectedRoomDetails: null,
      }),

    setSelectedRoomDetails: (room) =>
      set({
        selectedRoomDetails: room,
        stagedAvailabilities:
          room?.availabilities?.map((a) => ({
            dayOfWeek: a.dayOfWeek,
            startTime: a.startTime,
            endTime: a.endTime,
          })) || [],
      }),

    setStagedAvailabilities: (windows) => set({ stagedAvailabilities: windows }),
    addStagedAvailability: (win) =>
      set((state) => ({
        stagedAvailabilities: [...state.stagedAvailabilities, win],
      })),
    removeStagedAvailability: (index) =>
      set((state) => ({
        stagedAvailabilities: state.stagedAvailabilities.filter(
          (_, i) => i !== index,
        ),
      })),
    setIsSavingAvailabilities: (saving) =>
      set({ isSavingAvailabilities: saving }),

    openDeleteModal: (room) =>
      set({
        deleteModalOpened: true,
        roomToDelete: room,
        deleteError: null,
      }),

    closeDeleteModal: () =>
      set({
        deleteModalOpened: false,
        roomToDelete: null,
        deleteError: null,
      }),

    setDeleteError: (error) => set({ deleteError: error }),
    setIsDeleting: (deleting) => set({ isDeleting: deleting }),

    syncQueryData: (payload) =>
      set({
        data: payload.data,
        total: payload.total,
        totalPages: payload.totalPages,
        isLoading: payload.isLoading,
        isFetching: payload.isFetching,
      }),
  }));
}

export const RoomsContext = createContext<RoomsStore | null>(null);

export function useRoomsStore(): RoomsStore {
  const store = useContext(RoomsContext);
  if (!store) {
    throw new Error('useRoomsStore must be used within a RoomsController.');
  }
  return store;
}
