'use client';

import { createContext, useContext } from 'react';
import { createControllerStore } from '@/src/core/mirror';
import { ControllerStoreApi } from '@/src/core/mirror/types';
import { CustomFieldValue, StudentEditFormState, StudentsState } from '../state/students.state';
import {
  EMPTY_REFERENCE_OPTIONS,
  EMPTY_STUDENT_REFERENCES,
  studentReferencesFrom,
} from '../utils/student-references.utils';
import { financeStudentFrom } from '../finance/utils/student-finance.utils';

export type StudentsStore = ControllerStoreApi<StudentsState>;

const defaultFormState: StudentEditFormState = {
  fullName: '',
  birthDate: null,
  gender: 'MALE',
  familyId: null,
  customFields: {},
  references: { ...EMPTY_STUDENT_REFERENCES },
};

/**
 * Creates an isolated per-instance Zustand store for the Students Controller.
 * All UI state (pagination, search, edit drawer, delete modal) lives here.
 */
export function createStudentsStore(): StudentsStore {
  return createControllerStore<StudentsState>((set) => ({
    students: [],
    total: 0,
    totalPages: 1,
    page: 1,
    limit: 20,
    search: '',
    selectedBranchId: null,
    filters: { statusId: null, busId: null, cityId: null, unassignedYearId: null },
    isLoading: true,
    referenceOptions: EMPTY_REFERENCE_OPTIONS,
    yearOptions: [],

    // ── Edit Drawer State ──
    editDrawerOpened: false,
    selectedStudent: null,
    form: { ...defaultFormState },
    formErrors: {},
    generalError: null,
    isSubmitting: false,

    // ── Edit Drawer Lookups ──
    familySearch: '',
    familyOptions: [],
    isLoadingFamilies: false,
    studentFields: [],

    // ── Delete Modal State ──
    deleteModalOpened: false,
    studentToDelete: null,
    deletionReport: null,
    isLoadingDeletionReport: false,
    deleteError: null,
    isDeleting: false,

    setPage: (page) => set({ page }),
    setSearch: (search) => set({ search, page: 1 }),
    setSelectedBranchId: (selectedBranchId) => set({ selectedBranchId, page: 1 }),
    setFilter: (field, value) =>
      set((state) => ({ filters: { ...state.filters, [field]: value }, page: 1 })),
    syncReferenceOptions: (referenceOptions) => set({ referenceOptions }),
    syncYearOptions: (yearOptions) => set({ yearOptions }),

    syncQueryData: ({ data, total, totalPages, isLoading }) =>
      set({
        students: data,
        total,
        totalPages: totalPages > 0 ? totalPages : 1,
        isLoading,
      }),

    // ── Actions: Edit Drawer ──
    openEditDrawer: (student) =>
      set({
        editDrawerOpened: true,
        selectedStudent: student,
        form: {
          fullName: student.fullName,
          birthDate: student.birthDate ? String(student.birthDate).split('T')[0] : null,
          gender: student.gender === 'FEMALE' ? 'FEMALE' : 'MALE',
          familyId: student.familyId,
          customFields: { ...((student.customFields ?? {}) as Record<string, CustomFieldValue>) },
          references: studentReferencesFrom(student),
        },
        familySearch: '',
        formErrors: {},
        generalError: null,
      }),

    closeEditDrawer: () => set({ editDrawerOpened: false, selectedStudent: null }),

    setFormField: (field, value) =>
      set((state) => ({
        form: { ...state.form, [field]: value },
        formErrors: { ...state.formErrors, [field]: '' },
      })),

    setCustomFieldValue: (name, value) =>
      set((state) => ({
        form: { ...state.form, customFields: { ...state.form.customFields, [name]: value } },
        formErrors: { ...state.formErrors, [`custom.${name}`]: '' },
      })),

    setReference: (field, value) =>
      set((state) => ({
        form: { ...state.form, references: { ...state.form.references, [field]: value } },
      })),

    setFamilySearch: (familySearch) => set({ familySearch }),

    setFieldError: (field, error) =>
      set((state) => ({
        formErrors: { ...state.formErrors, [field]: error || '' },
      })),

    setGeneralError: (generalError) => set({ generalError }),
    setIsSubmitting: (isSubmitting) => set({ isSubmitting }),

    syncEditLookups: ({ families, isLoadingFamilies, fields }) =>
      set((state) => {
        // Keep the student's current family selectable even if it is not in the search results
        const current = state.selectedStudent?.family;
        const familyOptions =
          current && !families.some((f) => f.id === current.id) ? [current, ...families] : families;
        return { familyOptions, isLoadingFamilies, studentFields: fields };
      }),

    // ── Actions: Delete Modal ──
    financeStudent: null,
    overview: null,
    syncOverview: (overview) => set({ overview }),
    openFinance: (student) => set({ financeStudent: financeStudentFrom(student) }),
    closeFinance: () => set({ financeStudent: null }),
    openDeleteModal: (student) =>
      set({
        deleteModalOpened: true,
        studentToDelete: student,
        deletionReport: null,
        deleteError: null,
      }),

    closeDeleteModal: () =>
      set({
        deleteModalOpened: false,
        studentToDelete: null,
        deletionReport: null,
        deleteError: null,
      }),

    setDeleteError: (deleteError) => set({ deleteError }),
    setIsDeleting: (isDeleting) => set({ isDeleting }),

    syncDeletionReport: ({ report, isLoading }) =>
      set({ deletionReport: report, isLoadingDeletionReport: isLoading }),
  }));
}

export const StudentsContext = createContext<StudentsStore | null>(null);

export function useStudentsStore(): StudentsStore {
  const store = useContext(StudentsContext);
  if (!store) {
    throw new Error('useStudentsStore must be used within StudentsContext.Provider');
  }
  return store;
}
