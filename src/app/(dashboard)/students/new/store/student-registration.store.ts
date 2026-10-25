'use client';

import { createContext, useContext } from 'react';
import { createStore, StoreApi } from 'zustand';
import { StudentRegistrationState, NewFamilyForm } from '../state/student-registration.state';
import { StudentField } from '@/src/core/api';

export type StudentRegistrationStore = StoreApi<StudentRegistrationState>;

const initialNewFamily: NewFamilyForm = {
  familyName: '',
  fatherName: '',
  motherName: '',
  phone: '',
};

export function createStudentRegistrationStore(): StudentRegistrationStore {
  return createStore<StudentRegistrationState>((set, get) => ({
    activeStep: 0,
    isSubmitting: false,
    stepErrors: {},

    familyMode: 'search',
    selectedFamily: null,
    familySearchQuery: '',
    newFamily: { ...initialNewFamily },

    fullName: '',
    birthDate: '',
    gender: 'MALE',
    branchId: null,
    sectionId: null,
    academicYearId: null,

    customFields: {},

    setActiveStep: (activeStep) => set({ activeStep }),

    setFamilyMode: (familyMode) => set({ familyMode, stepErrors: { ...get().stepErrors, 0: null } }),

    setSelectedFamily: (selectedFamily) =>
      set({ selectedFamily, stepErrors: { ...get().stepErrors, 0: null } }),

    setFamilySearchQuery: (familySearchQuery) => set({ familySearchQuery }),

    setNewFamilyField: (field, value) =>
      set((s) => ({
        newFamily: { ...s.newFamily, [field]: value },
        stepErrors: { ...s.stepErrors, 0: null },
      })),

    setStudentField: (field, value) =>
      set((s) => ({
        ...s,
        [field]: value,
        stepErrors: { ...s.stepErrors, 1: null },
      })),

    setCustomFieldValue: (fieldName, value) =>
      set((s) => ({
        customFields: { ...s.customFields, [fieldName]: value },
        stepErrors: { ...s.stepErrors, 2: null },
      })),

    setSubmitting: (isSubmitting) => set({ isSubmitting }),

    setStepError: (step, error) =>
      set((s) => ({
        stepErrors: { ...s.stepErrors, [step]: error },
      })),

    validateCurrentStep: (configuredFields: StudentField[] = []) => {
      const state = get();
      const { activeStep } = state;

      if (activeStep === 0) {
        if (state.familyMode === 'search') {
          if (!state.selectedFamily) {
            state.setStepError(0, 'يرجى اختيار عائلة الطالب من القائمة أو التبديل لإنشاء عائلة جديدة');
            return false;
          }
        } else {
          if (!state.newFamily.familyName.trim()) {
            state.setStepError(0, 'يرجى إدخال كنية العائلة');
            return false;
          }
        }
        state.setStepError(0, null);
        return true;
      }

      if (activeStep === 1) {
        if (!state.fullName.trim()) {
          state.setStepError(1, 'يرجى إدخال اسم الطالب الكامل');
          return false;
        }
        if (!state.birthDate) {
          state.setStepError(1, 'يرجى اختيار تاريخ ميلاد الطالب');
          return false;
        }
        if (!state.gender) {
          state.setStepError(1, 'يرجى تحديد جنس الطالب');
          return false;
        }
        for (const field of configuredFields) {
          if (field.isRequired) {
            const val = state.customFields[field.name];
            if (val === undefined || val === null || String(val).trim() === '') {
              state.setStepError(1, `الحقل "${field.label}" مطلوب ويجب إدخال قيمته`);
              return false;
            }
          }
        }
        state.setStepError(1, null);
        return true;
      }

      if (activeStep === 2) {
        state.setStepError(2, null);
        return true;
      }

      return true;
    },

    reset: () =>
      set({
        activeStep: 0,
        isSubmitting: false,
        stepErrors: {},
        familyMode: 'search',
        selectedFamily: null,
        familySearchQuery: '',
        newFamily: { ...initialNewFamily },
        fullName: '',
        birthDate: '',
        gender: 'MALE',
        branchId: null,
        sectionId: null,
        academicYearId: null,
        customFields: {},
      }),
  }));
}

export const StudentRegistrationContext = createContext<StudentRegistrationStore | null>(null);

export function useStudentRegistrationStore(): StudentRegistrationStore {
  const store = useContext(StudentRegistrationContext);
  if (!store) {
    throw new Error('useStudentRegistrationStore must be used within StudentRegistrationContext.Provider');
  }
  return store;
}
