'use client';

import { createContext, useContext } from 'react';
import { createControllerStore } from '@/src/core/mirror';
import { ControllerStoreApi } from '@/src/core/mirror/types';
import { InputState, createInitialInputState } from '../state/input.state';
import { InputInitialProps, resolveInputConfig } from '../init/input.init';

export type InputStore = ControllerStoreApi<InputState>;

/**
 * Creates an isolated, per-instance Zustand store for an InputController.
 * Adheres to the Per-Instance Store Isolation rule (role.md Section 3).
 */
export function createInputStore(initialProps: InputInitialProps): InputStore {
  const initial = createInitialInputState(initialProps);

  return createControllerStore<InputState>((set, get) => ({
    ...initial,

    setValue: (value: string | number | null, option?: any) => {
      set({ value, isTouched: true });
      const rawProps = get().rawProps;
      if (rawProps.onChange) {
        if (typeof value === 'object' && value !== null && 'target' in value) {
          rawProps.onChange(value);
        } else {
          // Select or direct value change
          rawProps.onChange(value as any, option);
        }
      }
    },

    setFocused: (isFocused: boolean) => set({ isFocused }),

    setTouched: (isTouched: boolean) => set({ isTouched }),

    togglePasswordVisibility: () =>
      set((state) => ({ isPasswordVisible: !state.isPasswordVisible })),

    setError: (error) => set({ error }),

    updateProps: (props: InputInitialProps) => {
      const config = resolveInputConfig(props);
      set((state) => ({
        rawProps: props,
        config,
        error: props.error !== undefined ? props.error : state.error,
        value: props.value !== undefined ? props.value : state.value,
      }));
    },
  }));
}

export const InputContext = createContext<InputStore | null>(null);

/**
 * Hook to retrieve the current InputStore instance from React Context.
 */
export function useInputStore(): InputStore {
  const store = useContext(InputContext);
  if (!store) {
    throw new Error(
      'useInputStore must be used within an <InputController> component hierarchy.',
    );
  }
  return store;
}
