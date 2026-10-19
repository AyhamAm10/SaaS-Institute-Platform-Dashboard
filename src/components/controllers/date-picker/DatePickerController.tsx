'use client';

import React, { useState, useEffect } from 'react';
import { DatePickerProps } from './init/date-picker.init';
import { createDatePickerStore, DatePickerContext } from './store/date-picker.store';
import { DatePickerView } from './ui/DatePickerView';

export interface DatePickerControllerProps extends DatePickerProps {}

/**
 * DatePickerController (AppDatePicker)
 *
 * Official Unified Date Picker Controller for the SaaS Education Platform.
 * Built adhering strictly to role.md Section 5.2 and Controller Architecture standards.
 *
 * Responsibilities:
 * - Wraps Mantine's official @mantine/dates DatePickerInput component.
 * - Enforces identical 38px height and rounded aesthetic matching AppInput and AppSelect.
 * - Manages isolated per-instance Zustand store state per role.md Section 3.
 * - Automatically emits standard ISO YYYY-MM-DD strings for backend API compatibility.
 * - Fully localized in Arabic with native RTL calendar navigation.
 */
export function DatePickerController(props: DatePickerControllerProps) {
  const [store] = useState(() => createDatePickerStore(props));

  // Sync external controlled props into the isolated store
  useEffect(() => {
    store.getState().updateProps(props);
  }, [
    props.value,
    props.error,
    props.disabled,
    props.placeholder,
    props.label,
    props.description,
    props.leftSection,
    props.rightSection,
    props.minDate,
    props.maxDate,
    props.clearable,
    store,
  ]);

  return (
    <DatePickerContext.Provider value={store}>
      <DatePickerView />
    </DatePickerContext.Provider>
  );
}

// Canonical alias for ergonomic import per role.md Section 5.2
export const AppDatePicker = DatePickerController;
