'use client';

import { createContext, useContext } from 'react';
import { createControllerStore } from '@/src/core/mirror';
import { InstituteTabState } from '../state/institute-tab.state';

export type InstituteTabStore = ReturnType<typeof createInstituteTabStore>;

export function createInstituteTabStore() {
  return createControllerStore<InstituteTabState>((set) => ({
    profile: null,
    form: {
      name: '',
      phone: '',
      address: '',
      timezone: 'Asia/Damascus',
    },
    initialTimezone: 'Asia/Damascus',
    isLoading: true,
    isSubmitting: false,
    generalError: null,
    generalSuccess: null,
    fieldErrors: {},

    syncProfile: (profile, isLoading) =>
      set(() => {
        if (!profile) return { isLoading };
        return {
          profile,
          isLoading,
          initialTimezone: profile.timezone || 'Asia/Damascus',
          form: {
            name: profile.name || '',
            phone: profile.phone || '',
            address: profile.address || '',
            timezone: profile.timezone || 'Asia/Damascus',
          },
        };
      }),

    setFormField: (field, value) =>
      set((state) => ({
        form: { ...state.form, [field]: value },
        fieldErrors: { ...state.fieldErrors, [field]: undefined },
        generalSuccess: null,
      })),

    setFieldError: (field, error) =>
      set((state) => ({
        fieldErrors: { ...state.fieldErrors, [field]: error ?? undefined },
      })),

    setGeneralError: (error) => set({ generalError: error, generalSuccess: null }),
    setGeneralSuccess: (success) => set({ generalSuccess: success, generalError: null }),
    setIsSubmitting: (submitting) => set({ isSubmitting: submitting }),
  }));
}

export const InstituteTabContext = createContext<InstituteTabStore | null>(null);

export function useInstituteTabStore(): InstituteTabStore {
  const store = useContext(InstituteTabContext);
  if (!store) {
    throw new Error('useInstituteTabStore must be used within an InstituteTabContext.Provider');
  }
  return store;
}
