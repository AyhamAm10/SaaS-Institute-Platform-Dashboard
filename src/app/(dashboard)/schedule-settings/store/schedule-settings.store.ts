'use client';

import { createContext, useContext } from 'react';
import { createControllerStore } from '@/src/core/mirror';
import { ControllerStoreApi } from '@/src/core/mirror/types';
import {
  ScheduleSettingsFormState,
  ScheduleSettingsState,
} from '../state/schedule-settings.state';

export type ScheduleSettingsStore = ControllerStoreApi<ScheduleSettingsState>;

const defaultFormState: ScheduleSettingsFormState = {
  workingDays: [0, 1, 2, 3, 4],
  dayStartTime: '08:00',
  dayEndTime: '14:00',
  periodDurationMinutes: 45,
  breaks: [],
};

export function createScheduleSettingsStore(): ScheduleSettingsStore {
  return createControllerStore<ScheduleSettingsState>((set) => ({
    form: { ...defaultFormState },
    formErrors: {},
    generalError: null,
    generalSuccess: null,
    isSubmitting: false,
    isLoading: true,
    slots: [],

    setWorkingDays: (days) =>
      set((state) => ({
        form: { ...state.form, workingDays: days },
        formErrors: { ...state.formErrors, workingDays: undefined },
      })),

    setDayStartTime: (time) =>
      set((state) => ({
        form: { ...state.form, dayStartTime: time },
        formErrors: { ...state.formErrors, dayStartTime: undefined },
      })),

    setDayEndTime: (time) =>
      set((state) => ({
        form: { ...state.form, dayEndTime: time },
        formErrors: { ...state.formErrors, dayEndTime: undefined },
      })),

    setPeriodDurationMinutes: (minutes) =>
      set((state) => ({
        form: { ...state.form, periodDurationMinutes: minutes },
        formErrors: { ...state.formErrors, periodDurationMinutes: undefined },
      })),

    addBreak: (item) =>
      set((state) => ({
        form: { ...state.form, breaks: [...state.form.breaks, item] },
      })),

    removeBreak: (index) =>
      set((state) => ({
        form: {
          ...state.form,
          breaks: state.form.breaks.filter((_, i) => i !== index),
        },
      })),

    updateBreak: (index, item) =>
      set((state) => {
        const next = [...state.form.breaks];
        next[index] = item;
        return {
          form: { ...state.form, breaks: next },
        };
      }),

    setFieldError: (field, error) =>
      set((state) => ({
        formErrors: { ...state.formErrors, [field]: error || undefined },
      })),

    setGeneralError: (error) => set({ generalError: error }),
    setGeneralSuccess: (success) => set({ generalSuccess: success }),
    setIsSubmitting: (submitting) => set({ isSubmitting: submitting }),

    syncConfigData: (payload) =>
      set((state) => {
        // If not already modified or first load, sync form
        const isFresh = state.isLoading;
        return {
          isLoading: payload.isLoading,
          slots: payload.slots,
          form: isFresh
            ? {
                workingDays: payload.workingDays,
                dayStartTime: payload.dayStartTime,
                dayEndTime: payload.dayEndTime,
                periodDurationMinutes: payload.periodDurationMinutes,
                breaks: payload.breaks,
              }
            : state.form,
        };
      }),
  }));
}

export const ScheduleSettingsContext =
  createContext<ScheduleSettingsStore | null>(null);

export function useScheduleSettingsStore(): ScheduleSettingsStore {
  const store = useContext(ScheduleSettingsContext);
  if (!store) {
    throw new Error(
      'useScheduleSettingsStore must be used within a ScheduleSettingsController.',
    );
  }
  return store;
}
