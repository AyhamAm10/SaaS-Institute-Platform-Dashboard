'use client';

import { createContext, useContext } from 'react';
import { createControllerStore } from '@/src/core/mirror';
import { ControllerStoreApi } from '@/src/core/mirror/types';
import { StudentEditFormState, StudentsState } from '../state/students.state';
import { EMPTY_REFERENCE_OPTIONS, EMPTY_STUDENT_REFERENCES } from '../utils/student-references.utils';
import { DEFAULT_STUDENT_FILTERS, studentToEditForm } from '../utils/student-edit.utils';
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

export function createStudentsStore(): StudentsStore {
  return createControllerStore<StudentsState>((set) => ({
    students: [],
    total: 0,
    totalPages: 1,
    page: 1,
    limit: 10,
    search: '',
    selectedBranchId: null,
    filters: { ...DEFAULT_STUDENT_FILTERS },
    isLoading: true,
    referenceOptions: EMPTY_REFERENCE_OPTIONS,

    editDrawerOpened: false,
    selectedStudent: null,
    form: { ...defaultFormState },
    formErrors: {},
    generalError: null,
    isSubmitting: false,

    familySearch: '',
    familyOptions: [],
    isLoadingFamilies: false,
    studentFields: [],

    deleteModalOpened: false,
    studentToDelete: null,
    deletionReport: null,
    isLoadingDeletionReport: false,
    deleteError: null,
    isDeleting: false,
    financeStudent: null,
    overview: null,

    setPage: (page) => set({ page }),
    setSearch: (search) => set({ search, page: 1 }),
    setSelectedBranchId: (selectedBranchId) => set({ selectedBranchId, page: 1 }),
    setFilter: (field, value) =>
      set((state) => {
        const nextFilters = { ...state.filters, [field]: value };
        if (field === 'cityId' && nextFilters.schoolId) {
          const school = state.referenceOptions.schools.find((s) => Number(s.value) === nextFilters.schoolId);
          if (school && school.cityId != null && school.cityId !== value) nextFilters.schoolId = null;
        }
        return { filters: nextFilters, page: 1 };
      }),
    setCustomFilter: (field, value) =>
      set((state) => {
        const next = { ...state.filters.customFilters };
        if (value === null || value === undefined || value === '') delete next[field];
        else next[field] = value;
        return { filters: { ...state.filters, customFilters: next }, page: 1 };
      }),
    clearFilters: () => set({ filters: { ...DEFAULT_STUDENT_FILTERS }, page: 1 }),
    syncStudentFields: (studentFields) => set({ studentFields }),
    syncReferenceOptions: (referenceOptions) => set({ referenceOptions }),
    syncOverview: (overview) => set({ overview }),
    syncQueryData: ({ data, total, totalPages, isLoading }) =>
      set({ students: data, total, totalPages: totalPages > 0 ? totalPages : 1, isLoading }),

    openEditDrawer: (student) =>
      set({
        editDrawerOpened: true,
        selectedStudent: student,
        form: studentToEditForm(student),
        familySearch: '',
        formErrors: {},
        generalError: null,
      }),
    closeEditDrawer: () => set({ editDrawerOpened: false, selectedStudent: null }),
    setFormField: (field, value) =>
      set((s) => ({ form: { ...s.form, [field]: value }, formErrors: { ...s.formErrors, [field]: '' } })),
    setCustomFieldValue: (name, value) =>
      set((s) => ({
        form: { ...s.form, customFields: { ...s.form.customFields, [name]: value } },
        formErrors: { ...s.formErrors, [`custom.${name}`]: '' },
      })),
    setReference: (field, value) =>
      set((s) => ({ form: { ...s.form, references: { ...s.form.references, [field]: value } } })),
    setFamilySearch: (familySearch) => set({ familySearch }),
    setFieldError: (field, error) => set((s) => ({ formErrors: { ...s.formErrors, [field]: error || '' } })),
    setGeneralError: (generalError) => set({ generalError }),
    setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
    syncEditLookups: ({ families, isLoadingFamilies, fields }) =>
      set((state) => {
        const cur = state.selectedStudent?.family;
        const familyOptions = cur && !families.some((f) => f.id === cur.id) ? [cur, ...families] : families;
        return { familyOptions, isLoadingFamilies, studentFields: fields };
      }),

    openFinance: (student) => set({ financeStudent: financeStudentFrom(student) }),
    closeFinance: () => set({ financeStudent: null }),
    openDeleteModal: (student) =>
      set({ deleteModalOpened: true, studentToDelete: student, deletionReport: null, deleteError: null }),
    closeDeleteModal: () =>
      set({ deleteModalOpened: false, studentToDelete: null, deletionReport: null, deleteError: null }),
    setDeleteError: (deleteError) => set({ deleteError }),
    setIsDeleting: (isDeleting) => set({ isDeleting }),
    syncDeletionReport: ({ report, isLoading }) =>
      set({ deletionReport: report, isLoadingDeletionReport: isLoading }),
  }));
}

export const StudentsContext = createContext<StudentsStore | null>(null);

export function useStudentsStore(): StudentsStore {
  const store = useContext(StudentsContext);
  if (!store) throw new Error('useStudentsStore must be used within StudentsContext.Provider');
  return store;
}
