'use client';

import { createContext, useContext } from 'react';
import { createControllerStore } from '@/src/core/mirror';
import { ControllerStoreApi } from '@/src/core/mirror/types';
import { SectionsState } from '../state/sections.state';

export type SectionsStore = ControllerStoreApi<SectionsState>;

/**
 * Creates an isolated per-instance Zustand store for the Sections Controller.
 * All UI state (pagination, filters, modals, drawer, form states, mutation tracking) lives here.
 * Strictly adheres to role.md Section 3 & Section 12.
 */
export function createSectionsStore(): SectionsStore {
  return createControllerStore<SectionsState>((set) => ({
    // ── Pagination & Filters ──
    page: 1,
    limit: 10,
    search: '',
    selectedYearId: null,
    selectedBranchId: null,
    filterOptionsRequested: false,

    // ── Query-Derived Data ──
    data: [],
    total: 0,
    totalPages: 1,
    isLoading: true,
    isFetching: false,

    // ── Academic Years & Academic Branches ──
    academicYears: [],
    academicBranches: [],

    // ── Form Modal State ──
    formModalOpened: false,
    selectedSection: null,
    sectionForm: {
      name: '',
      academicBranchId: null,
      academicYearId: null,
      feeAmount: '0',
    },
    sectionFormError: null,

    // ── Fee Modal State ──
    feeModalOpened: false,
    feeSection: null,
    feeFormAmount: '0',
    feeError: null,

    // ── Details Drawer State ──
    drawerOpened: false,
    detailSectionId: null,
    detailsData: null,
    sectionSubjectsData: [],
    instituteSubjectsData: [],
    teachersData: [],
    isLoadingDetails: false,
    isLoadingSectionSubjects: false,

    // ── Academic Branches Management Modal State ──
    branchesModalOpened: false,
    branchForm: {
      name: '',
      description: '',
    },
    branchError: null,
    branchSuccess: null,

    // ── Section Subjects Assignment State ──
    assignSubjectId: null,
    assignWeeklyPeriods: 2,
    assignTeacherId: null,
    assignSubjectError: null,
    isAssigningSubject: false,
    isRemovingSubjectId: null,

    // ── Mutation Loading ──
    formSubmitting: false,
    feeSubmitting: false,
    branchSubmitting: false,

    // ── Actions: Section Subjects ──
    setAssignSubjectId: (id) => set({ assignSubjectId: id, assignSubjectError: null }),
    setAssignWeeklyPeriods: (periods) => set({ assignWeeklyPeriods: periods }),
    setAssignTeacherId: (teacherId) => set({ assignTeacherId: teacherId }),
    setAssignSubjectError: (error) => set({ assignSubjectError: error }),
    setIsAssigningSubject: (submitting) => set({ isAssigningSubject: submitting }),
    setIsRemovingSubjectId: (id) => set({ isRemovingSubjectId: id }),

    // ── Actions: Pagination & Filters ──
    setPage: (page: number) => set({ page }),
    setSearch: (search: string) => set({ search, page: 1 }),
    setSelectedYearId: (yearId: string | null) => set({ selectedYearId: yearId, page: 1 }),
    setSelectedBranchId: (branchId: string | null) => set({ selectedBranchId: branchId, page: 1 }),
    requestFilterOptions: () => set({ filterOptionsRequested: true }),

    // ── Actions: Form Modal ──
    openCreate: () =>
      set((state) => {
        const currentYear =
          state.academicYears.find((y) => y.isCurrent) ?? state.academicYears[0];
        const defaultBranch = state.academicBranches[0];
        return {
          selectedSection: null,
          formModalOpened: true,
          sectionForm: {
            name: '',
            academicBranchId: defaultBranch ? String(defaultBranch.id) : null,
            academicYearId: currentYear ? String(currentYear.id) : null,
            feeAmount: '0',
          },
          sectionFormError: null,
        };
      }),
    openEdit: (section) =>
      set({
        selectedSection: section,
        formModalOpened: true,
        sectionForm: {
          name: section.name,
          academicBranchId: String(section.academicBranchId),
          academicYearId: String(section.academicYearId),
          feeAmount: String(section.feeAmount),
        },
        sectionFormError: null,
      }),
    closeFormModal: () => set({ formModalOpened: false }),
    setSectionFormField: (field, value) =>
      set((state) => ({
        sectionForm: {
          ...state.sectionForm,
          [field]: value,
        },
        sectionFormError: null,
      })),
    setSectionFormError: (error) => set({ sectionFormError: error }),
    resetSectionForm: () =>
      set({
        sectionForm: {
          name: '',
          academicBranchId: null,
          academicYearId: null,
          feeAmount: '0',
        },
        sectionFormError: null,
      }),

    // ── Actions: Fee Modal ──
    openFeeModal: (section) =>
      set({
        feeSection: section,
        feeModalOpened: true,
        feeFormAmount: String(section.feeAmount),
        feeError: null,
      }),
    closeFeeModal: () => set({ feeModalOpened: false }),
    setFeeFormAmount: (amount) => set({ feeFormAmount: amount, feeError: null }),
    setFeeError: (error) => set({ feeError: error }),

    // ── Actions: Details Drawer ──
    openDetails: (section) =>
      set({
        detailSectionId: section.id,
        drawerOpened: true,
        assignSubjectId: null,
        assignSubjectError: null,
      }),
    closeDrawer: () =>
      set({
        drawerOpened: false,
        detailSectionId: null,
        detailsData: null,
        sectionSubjectsData: [],
      }),

    // ── Actions: Branches Modal ──
    openBranchesModal: () =>
      set({
        branchesModalOpened: true,
        branchError: null,
        branchSuccess: null,
      }),
    closeBranchesModal: () => set({ branchesModalOpened: false }),
    setBranchFormField: (field, value) =>
      set((state) => ({
        branchForm: {
          ...state.branchForm,
          [field]: value,
        },
      })),
    resetBranchForm: () =>
      set({
        branchForm: {
          name: '',
          description: '',
        },
      }),
    setBranchError: (error) => set({ branchError: error }),
    setBranchSuccess: (success) => set({ branchSuccess: success }),

    // ── Actions: Query Sync ──
    syncQueryData: (payload) =>
      set({
        data: payload.data,
        total: payload.total,
        totalPages: payload.totalPages,
        isLoading: payload.isLoading,
        isFetching: payload.isFetching,
      }),
    syncAcademicYears: (years) =>
      set((state) => {
        // If create form is open and year not selected yet, auto-select current year
        let updatedForm = state.sectionForm;
        if (state.formModalOpened && !state.selectedSection && !state.sectionForm.academicYearId) {
          const currentYear = years.find((y) => y.isCurrent) ?? years[0];
          if (currentYear) {
            updatedForm = { ...updatedForm, academicYearId: String(currentYear.id) };
          }
        }
        return { academicYears: years, sectionForm: updatedForm };
      }),
    syncAcademicBranches: (branches) =>
      set((state) => {
        // If create form is open and branch not selected yet, auto-select first branch
        let updatedForm = state.sectionForm;
        if (state.formModalOpened && !state.selectedSection && !state.sectionForm.academicBranchId) {
          const defaultBranch = branches[0];
          if (defaultBranch) {
            updatedForm = { ...updatedForm, academicBranchId: String(defaultBranch.id) };
          }
        }
        return { academicBranches: branches, sectionForm: updatedForm };
      }),
    syncSectionDetails: (details, isLoading) =>
      set({ detailsData: details, isLoadingDetails: isLoading }),
    syncSectionSubjects: (subjects, isLoading) =>
      set({ sectionSubjectsData: subjects, isLoadingSectionSubjects: isLoading }),
    syncInstituteSubjects: (subjects) => set({ instituteSubjectsData: subjects }),
    syncTeachers: (teachers) => set({ teachersData: teachers }),

    // ── Actions: Mutations ──
    setFormSubmitting: (submitting: boolean) => set({ formSubmitting: submitting }),
    setFeeSubmitting: (submitting: boolean) => set({ feeSubmitting: submitting }),
    setBranchSubmitting: (submitting: boolean) => set({ branchSubmitting: submitting }),
  }));
}

export const SectionsContext = createContext<SectionsStore | null>(null);

export function useSectionsStore(): SectionsStore {
  const store = useContext(SectionsContext);
  if (!store) {
    throw new Error(
      'useSectionsStore must be used within a <SectionsController> component hierarchy.',
    );
  }
  return store;
}
