import { ReactNode } from 'react';
import { ControllerState } from '@/src/core/mirror/types';
import { InputInitialProps, ResolvedInputConfig, resolveInputConfig } from '../init/input.init';

/**
 * Mirror state contract for the InputController.
 */
export interface InputState extends ControllerState {
  // Domain State
  value: string | number;
  isFocused: boolean;
  isTouched: boolean;
  isPasswordVisible: boolean;
  error: ReactNode | null;
  config: ResolvedInputConfig;
  rawProps: InputInitialProps;

  // Actions
  setValue: (value: string | number) => void;
  setFocused: (isFocused: boolean) => void;
  setTouched: (isTouched: boolean) => void;
  togglePasswordVisibility: () => void;
  setError: (error: ReactNode | null) => void;
  updateProps: (props: InputInitialProps) => void;
}

/**
 * Creates initial state schema for the Input store.
 */
export function createInitialInputState(props: InputInitialProps): Omit<
  InputState,
  | 'setValue'
  | 'setFocused'
  | 'setTouched'
  | 'togglePasswordVisibility'
  | 'setError'
  | 'updateProps'
> {
  const config = resolveInputConfig(props);

  return {
    value: props.value ?? props.defaultValue ?? '',
    isFocused: false,
    isTouched: false,
    isPasswordVisible: false,
    error: props.error ?? null,
    config,
    rawProps: props,
  };
}
