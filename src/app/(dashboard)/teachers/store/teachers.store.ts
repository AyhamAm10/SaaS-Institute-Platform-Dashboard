'use client';

import { createContext, useContext } from 'react';
import { createControllerStore } from '@/src/core/mirror';
import { ControllerStoreApi } from '@/src/core/mirror/types';
import { TeacherFormState, TeachersState } from '../state/teachers.state';

export type TeachersStore = ControllerStoreApi<TeachersState>;

const defaultFormState: TeacherFormState = {
  fullName: '',
  phone: '',
  password: '',
  specialization: '',
  branchIds: [],
  isActive: true,
};

export function createTeachersStore(): TeachersStore {
  return createControllerStore<TeachersState>((set) => ({
    // Pagination & Filters
    page: 1,
    limit: 10,
    search: '',
    branchId: undefined,

    // Query Data
    data: [],
    total: 0,
    totalPages: 1,
    isLoading: true,
    isFetching: false,

    // Form Drawer
    drawerOpened: false,
    drawerMode: 'create',
    selectedTeacher: null,
    form: { ...defaultFormState },
    formErrors: {},
    generalError: null,
    generalSuccess: null,
    isSubmitting: false,

    // Details Drawer
    detailsDrawerOpened: false,
    activeDetailsTab: 'overview',
    selectedTeacherDetails: null,
    isDetailsLoading: false,

    newAcademicBranchId: undefined,
    newSubjectId: undefined,
    isAssigningQualification: false,

    stagedAvailabilities: [],
    isSavingAvailabilities: false,

    // Delete Modal
    deleteModalOpened: false,
    teacherToDelete: null,
    deleteError: null,
    isDeleting: false,

    // Actions: Filters
    setPage: (page) => set({ page }),
    setLimit: (limit) => set({ limit, page: 1 }),
    setSearch: (search) => set({ search, page: 1 }),
    setBranchId: (branchId) => set({ branchId, page: 1 }),

    // Actions: Form Drawer
    openCreateDrawer: () =>
      set({
        drawerOpened: true,
        drawerMode: 'create',
        selectedTeacher: null,
        form: { ...defaultFormState },
        formErrors: {},
        generalError: null,
        generalSuccess: null,
      }),

    openEditDrawer: (teacher) =>
      set({
        drawerOpened: true,
        drawerMode: 'edit',
        selectedTeacher: teacher,
        form: {
          fullName: teacher.user.fullName,
          phone: teacher.user.phone,
          password: '',
          specialization: teacher.specialization || '',
          branchIds: teacher.teacherBranches?.map((b) => b.branchId) || [],
          isActive: teacher.isActive,
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

    // Actions: Details Drawer
    openDetailsDrawer: (teacher) =>
      set({
        detailsDrawerOpened: true,
        selectedTeacherDetails: teacher,
        activeDetailsTab: 'overview',
        stagedAvailabilities:
          teacher.availabilities?.map((a) => ({
            dayOfWeek: a.dayOfWeek,
            startTime: a.startTime,
            endTime: a.endTime,
          })) || [],
      }),

    closeDetailsDrawer: () =>
      set({
        detailsDrawerOpened: false,
        selectedTeacherDetails: null,
        newAcademicBranchId: undefined,
        newSubjectId: undefined,
      }),

    setActiveDetailsTab: (tab) => set({ activeDetailsTab: tab }),
    setSelectedTeacherDetails: (teacher) =>
      set({
        selectedTeacherDetails: teacher,
        stagedAvailabilities:
          teacher?.availabilities?.map((a) => ({
            dayOfWeek: a.dayOfWeek,
            startTime: a.startTime,
            endTime: a.endTime,
          })) || [],
      }),
    setIsDetailsLoading: (loading) => set({ isDetailsLoading: loading }),

    setNewAcademicBranchId: (id) => set({ newAcademicBranchId: id }),
    setNewSubjectId: (id) => set({ newSubjectId: id }),
    setIsAssigningQualification: (loading) =>
      set({ isAssigningQualification: loading }),

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

    // Actions: Delete Modal
    openDeleteModal: (teacher) =>
      set({
        deleteModalOpened: true,
        teacherToDelete: teacher,
        deleteError: null,
      }),

    closeDeleteModal: () =>
      set({
        deleteModalOpened: false,
        teacherToDelete: null,
        deleteError: null,
      }),

    setDeleteError: (error) => set({ deleteError: error }),
    setIsDeleting: (deleting) => set({ isDeleting: deleting }),

    // Actions: Sync
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

export const TeachersContext = createContext<TeachersStore | null>(null);

export function useTeachersStore(): TeachersStore {
  const store = useContext(TeachersContext);
  if (!store) {
    throw new Error('useTeachersStore must be used within a TeachersController.');
  }
  return store;
}
