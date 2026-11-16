'use client';

import { createContext, useContext } from 'react';
import { useStore } from 'zustand';
import { createControllerStore } from '@/src/core/mirror';
import { ControllerStoreApi } from '@/src/core/mirror/types';
import { authApi, getApiErrorMessage } from '@/src/core/api';
import type { PasswordChangeInitialProps, PasswordChangeState } from '../state/password-change.state';
import { passwordChangeLabels, validatePasswordChange } from '../init/password-change.init';

export type PasswordChangeStore = ControllerStoreApi<PasswordChangeState>;

/** Isolated per-instance store of the forced password change. */
export function createPasswordChangeStore(props?: PasswordChangeInitialProps): PasswordChangeStore {
  return createControllerStore<PasswordChangeState>((set, get) => ({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    errorMessage: null,
    isSubmitting: false,

    setCurrentPassword: (currentPassword) => set({ currentPassword, errorMessage: null }),
    setNewPassword: (newPassword) => set({ newPassword, errorMessage: null }),
    setConfirmPassword: (confirmPassword) => set({ confirmPassword, errorMessage: null }),

    submit: async () => {
      const { currentPassword, newPassword, confirmPassword, isSubmitting } = get();
      if (isSubmitting) return;
      const invalid = validatePasswordChange(currentPassword, newPassword, confirmPassword);
      if (invalid) return set({ errorMessage: invalid });

      set({ isSubmitting: true, errorMessage: null });
      try {
        await authApi.changePassword({ currentPassword, newPassword });
        await props?.onSuccess?.();
      } catch (err: unknown) {
        set({ errorMessage: getApiErrorMessage(err, passwordChangeLabels.failed) });
      } finally {
        set({ isSubmitting: false });
      }
    },
  }));
}

export const PasswordChangeContext = createContext<PasswordChangeStore | null>(null);

export function usePasswordChangeMirror<K extends keyof PasswordChangeState>(key: K): PasswordChangeState[K] {
  const store = useContext(PasswordChangeContext);
  if (!store) throw new Error('usePasswordChangeMirror must be used within <PasswordChangeController>.');
  return useStore(store, (state) => state[key]);
}
