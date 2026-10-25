'use client';

import { createContext, useContext } from 'react';
import { createStore, StoreApi } from 'zustand';
import {
  AddedAvailability,
  AddedQualification,
  TeacherRegistrationState,
} from '../state/teacher-registration.state';

export type TeacherRegistrationStore = StoreApi<TeacherRegistrationState>;

function parseTimeToMinutes(timeStr: string): number {
  const parts = timeStr.split(':').map(Number);
  const hours = parts[0] ?? 0;
  const minutes = parts[1] ?? 0;
  return hours * 60 + minutes;
}

export function createTeacherRegistrationStore(): TeacherRegistrationStore {
  return createStore<TeacherRegistrationState>((set, get) => ({
    activeStep: 0,
    isSubmitting: false,
    stepErrors: {},

    // Step 1: Basic info
    fullName: '',
    phone: '',
    password: '',
    specialization: '',
    branchIds: [],
    isActive: true,

    // Step 2: Qualifications
    qualifications: [],
    stagedAcademicBranchId: undefined,
    stagedSubjectId: undefined,

    // Step 3: Availability
    availabilities: [],
    stagedDayOfWeek: '0',
    stagedStartTime: '08:00',
    stagedEndTime: '12:00',

    setActiveStep: (activeStep) => set({ activeStep }),
    setSubmitting: (isSubmitting) => set({ isSubmitting }),
    setStepError: (step, error) =>
      set((s) => ({
        stepErrors: { ...s.stepErrors, [step]: error },
      })),

    setBasicField: (field, value) =>
      set((s) => ({
        ...s,
        [field]: value,
        stepErrors: { ...s.stepErrors, 0: null },
      })),

    setBranchIds: (branchIds) =>
      set((s) => ({
        ...s,
        branchIds,
        stepErrors: { ...s.stepErrors, 0: null },
      })),

    setStagedAcademicBranchId: (stagedAcademicBranchId) =>
      set((s) => ({
        ...s,
        stagedAcademicBranchId,
        stepErrors: { ...s.stepErrors, 1: null },
      })),

    setStagedSubjectId: (stagedSubjectId) =>
      set((s) => ({
        ...s,
        stagedSubjectId,
        stepErrors: { ...s.stepErrors, 1: null },
      })),

    addQualification: (academicBranchName, subjectName) => {
      const state = get();
      if (!state.stagedAcademicBranchId || !state.stagedSubjectId) {
        set((s) => ({
          stepErrors: { ...s.stepErrors, 1: 'يرجى اختيار الفرع الأكاديمي والمادة الدراسية' },
        }));
        return false;
      }

      const isDuplicate = state.qualifications.some(
        (q) =>
          q.academicBranchId === state.stagedAcademicBranchId &&
          q.subjectId === state.stagedSubjectId,
      );

      if (isDuplicate) {
        set((s) => ({
          stepErrors: { ...s.stepErrors, 1: 'هذه المادة مسجلة مسبقاً لهذا الفرع الأكاديمي' },
        }));
        return false;
      }

      const newQualification: AddedQualification = {
        academicBranchId: state.stagedAcademicBranchId,
        academicBranchName,
        subjectId: state.stagedSubjectId,
        subjectName,
      };

      set((s) => ({
        qualifications: [...s.qualifications, newQualification],
        stagedSubjectId: undefined,
        stepErrors: { ...s.stepErrors, 1: null },
      }));

      return true;
    },

    removeQualification: (index) =>
      set((s) => ({
        qualifications: s.qualifications.filter((_, i) => i !== index),
      })),

    setStagedDayOfWeek: (stagedDayOfWeek) => set({ stagedDayOfWeek }),
    setStagedStartTime: (stagedStartTime) => set({ stagedStartTime }),
    setStagedEndTime: (stagedEndTime) => set({ stagedEndTime }),

    addAvailability: () => {
      const state = get();
      const day = Number(state.stagedDayOfWeek);
      const start = state.stagedStartTime.trim();
      const end = state.stagedEndTime.trim();

      const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(start) || !timeRegex.test(end)) {
        set((s) => ({
          stepErrors: { ...s.stepErrors, 2: 'يرجى كتابة التوقيت بصيغة صحيحة (HH:mm) مثل 08:30' },
        }));
        return false;
      }

      const startMins = parseTimeToMinutes(start);
      const endMins = parseTimeToMinutes(end);

      if (startMins >= endMins) {
        set((s) => ({
          stepErrors: { ...s.stepErrors, 2: 'وقت نهاية الدوام يجب أن يكون بعد وقت البداية' },
        }));
        return false;
      }

      // Check overlap on same day
      const sameDayIntervals = state.availabilities.filter((a) => a.dayOfWeek === day);
      for (const item of sameDayIntervals) {
        const itemStart = parseTimeToMinutes(item.startTime);
        const itemEnd = parseTimeToMinutes(item.endTime);
        if (startMins < itemEnd && endMins > itemStart) {
          set((s) => ({
            stepErrors: { ...s.stepErrors, 2: 'توجد فترة دوام أخرى متداخلة مع هذا التوقيت في نفس اليوم' },
          }));
          return false;
        }
      }

      const newAvail: AddedAvailability = {
        dayOfWeek: day,
        startTime: start,
        endTime: end,
      };

      set((s) => ({
        availabilities: [...s.availabilities, newAvail].sort(
          (a, b) =>
            a.dayOfWeek - b.dayOfWeek ||
            parseTimeToMinutes(a.startTime) - parseTimeToMinutes(b.startTime),
        ),
        stepErrors: { ...s.stepErrors, 2: null },
      }));

      return true;
    },

    removeAvailability: (index) =>
      set((s) => ({
        availabilities: s.availabilities.filter((_, i) => i !== index),
      })),

    validateCurrentStep: () => {
      const state = get();
      const { activeStep } = state;

      if (activeStep === 0) {
        if (!state.fullName.trim()) {
          set((s) => ({
            stepErrors: { ...s.stepErrors, 0: 'يرجى إدخال اسم المعلم الكامل' },
          }));
          return false;
        }
        if (!state.phone.trim() || state.phone.trim().length < 8) {
          set((s) => ({
            stepErrors: { ...s.stepErrors, 0: 'يرجى إدخال رقم هاتف صحيح (8 أرقام على الأقل)' },
          }));
          return false;
        }
        if (!state.password || state.password.length < 6) {
          set((s) => ({
            stepErrors: { ...s.stepErrors, 0: 'كلمة المرور يجب أن لا تقل عن 6 خانات' },
          }));
          return false;
        }
        set((s) => ({
          stepErrors: { ...s.stepErrors, 0: null },
        }));
        return true;
      }

      if (activeStep === 1) {
        // Step 2 is qualifications; allowed to be empty or configured
        set((s) => ({
          stepErrors: { ...s.stepErrors, 1: null },
        }));
        return true;
      }

      if (activeStep === 2) {
        // Step 3 is availability; allowed to be empty (defaults to full working hours)
        set((s) => ({
          stepErrors: { ...s.stepErrors, 2: null },
        }));
        return true;
      }

      return true;
    },

    resetForm: () =>
      set({
        activeStep: 0,
        isSubmitting: false,
        stepErrors: {},
        fullName: '',
        phone: '',
        password: '',
        specialization: '',
        branchIds: [],
        isActive: true,
        qualifications: [],
        stagedAcademicBranchId: undefined,
        stagedSubjectId: undefined,
        availabilities: [],
        stagedDayOfWeek: '0',
        stagedStartTime: '08:00',
        stagedEndTime: '12:00',
      }),
  }));
}

export const TeacherRegistrationContext = createContext<TeacherRegistrationStore | null>(null);

export function useTeacherRegistrationStore(): TeacherRegistrationStore {
  const store = useContext(TeacherRegistrationContext);
  if (!store) {
    throw new Error(
      'useTeacherRegistrationStore must be used within a TeacherRegistrationContext.Provider',
    );
  }
  return store;
}
