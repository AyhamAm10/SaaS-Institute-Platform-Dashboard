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

    setValue: (value: string | number) => {
      set({ value, isTouched: true });
      const rawProps = get().rawProps;
      if (rawProps.onChange) {
        // If consumer passed raw onChange, allow standard synthetic event or raw value
        if (typeof value === 'object') {
          rawProps.onChange(value);
        } else {
          // Synthetic-like fallback
          rawProps.onChange(value as any);
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
