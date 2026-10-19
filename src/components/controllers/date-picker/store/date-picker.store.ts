import { createContext } from 'react';
import { createStore, StoreApi } from 'zustand';
import { ReactNode } from 'react';
import {
  DatePickerProps,
  ResolvedDatePickerConfig,
  resolveDatePickerConfig,
  parseDateValue,
  formatDateToISO,
} from '../init/date-picker.init';

export interface DatePickerState {
  config: ResolvedDatePickerConfig;
  value: Date | null;
  isFocused: boolean;
  error: ReactNode;
  rawProps: DatePickerProps;

  setValue: (val: Date | null) => void;
  setFocused: (isFocused: boolean) => void;
  updateProps: (props: DatePickerProps) => void;
}

export type DatePickerStore = StoreApi<DatePickerState>;

/**
 * Creates an isolated, per-instance Zustand store for DatePickerController.
 * Adheres strictly to role.md Section 3 (No Global Singletons).
 */
export function createDatePickerStore(initialProps: DatePickerProps): DatePickerStore {
  const initialConfig = resolveDatePickerConfig(initialProps);
  const initialValue = parseDateValue(initialProps.value ?? initialProps.defaultValue);

  return createStore<DatePickerState>((set, get) => ({
    config: initialConfig,
    value: initialValue,
    isFocused: false,
    error: initialProps.error ?? null,
    rawProps: initialProps,

    setValue: (val: Date | null) => {
      set({ value: val });
      const isoStr = formatDateToISO(val);
      get().rawProps.onChange?.(isoStr);
    },

    setFocused: (isFocused: boolean) => {
      set({ isFocused });
    },

    updateProps: (props: DatePickerProps) => {
      const nextConfig = resolveDatePickerConfig(props);
      const nextValue =
        props.value !== undefined ? parseDateValue(props.value) : get().value;

      set({
        config: nextConfig,
        value: nextValue,
        error: props.error ?? null,
        rawProps: props,
      });
    },
  }));
}

export const DatePickerContext = createContext<DatePickerStore | null>(null);
