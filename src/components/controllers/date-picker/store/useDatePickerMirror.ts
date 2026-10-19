'use client';

import { useContext } from 'react';
import { useStore } from 'zustand';
import { DatePickerContext, DatePickerState } from './date-picker.store';

/**
 * Strongly typed Mirror hook for Date Picker Controller.
 * Subscribes to a single key in the isolated store with selective re-rendering.
 */
export function useDatePickerMirror<K extends keyof DatePickerState>(key: K): DatePickerState[K] {
  const store = useContext(DatePickerContext);

  if (!store) {
    throw new Error(
      'DatePicker compound sub-components must be rendered within a <DatePickerController /> provider.',
    );
  }

  return useStore(store, (state) => state[key]);
}

/**
 * Selector-based Mirror hook for Date Picker Controller.
 */
export function useDatePickerMirrorSelector<TSelected>(
  selector: (state: DatePickerState) => TSelected,
): TSelected {
  const store = useContext(DatePickerContext);

  if (!store) {
    throw new Error(
      'DatePicker compound sub-components must be rendered within a <DatePickerController /> provider.',
    );
  }

  return useStore(store, selector);
}
