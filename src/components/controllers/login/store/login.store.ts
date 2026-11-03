'use client';

import { createContext, useContext } from 'react';
import { createControllerStore } from '@/src/core/mirror';
import { ControllerStoreApi } from '@/src/core/mirror/types';
import { LoginState, LoginInitialProps } from '../state/login.state';
import { authApi } from '@/src/core/api';

export type LoginStore = ControllerStoreApi<LoginState>;

/**
 * Creates an isolated per-instance Zustand store for the Login Controller.
 */
export function createLoginStore(props?: LoginInitialProps): LoginStore {
  return createControllerStore<LoginState>((set, get) => ({
    phone: '',
    password: '',
    instituteCode: '',
    errorMessage: props?.initialError ?? null,
    isSubmitting: false,

    setPhone: (phone: string) => set({ phone }),
    setPassword: (password: string) => set({ password }),
    setInstituteCode: (instituteCode: string) => set({ instituteCode }),
    setErrorMessage: (errorMessage: string | null) => set({ errorMessage }),

    submit: async () => {
      const { phone, password, instituteCode, isSubmitting } = get();
      if (isSubmitting) return;

      if (!phone || phone.trim().length === 0) {
        set({ errorMessage: 'رقم الجوال مطلوب' });
        return;
      }

      if (!password || password.length === 0) {
        set({ errorMessage: 'كلمة المرور مطلوبة' });
        return;
      }

      set({ isSubmitting: true, errorMessage: null });

      try {
        await authApi.login({
          phone: phone.trim(),
          password,
          ...(instituteCode.trim() && { instituteCode: instituteCode.trim() }),
        });

        if (props?.onSuccess) {
          props.onSuccess();
        }
      } catch (err: unknown) {
        const responseMessage = (
          err as { response?: { data?: { message?: string | string[] } } }
        )?.response?.data?.message;

        const hasResponse = Boolean((err as { response?: unknown })?.response);

        let msg = 'فشل تسجيل الدخول. يرجى التحقق من صحة رقم الجوال وكلمة المرور.';
        if (!hasResponse) {
          // Network error: the API server could not be reached at all
          msg = 'تعذر الاتصال بالخادم. يرجى التأكد من تشغيل الخادم والمحاولة مجدداً.';
        } else if (typeof responseMessage === 'string') {
          msg = responseMessage;
        } else if (Array.isArray(responseMessage) && responseMessage.length > 0) {
          msg = responseMessage[0];
        }

        set({ errorMessage: msg });
      } finally {
        set({ isSubmitting: false });
      }
    },
  }));
}

export const LoginContext = createContext<LoginStore | null>(null);

export function useLoginStore(): LoginStore {
  const store = useContext(LoginContext);
  if (!store) {
    throw new Error(
      'useLoginStore must be used within a <LoginController> component hierarchy.',
    );
  }
  return store;
}
