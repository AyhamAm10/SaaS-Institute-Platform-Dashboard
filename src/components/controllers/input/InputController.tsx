'use client';

import React, { useState, useEffect } from 'react';
import { InputInitialProps } from './init/input.init';
import { createInputStore, InputContext } from './store/input.store';
import { InputFactory } from './ui/InputFactory';

export interface InputControllerProps extends InputInitialProps {}

/**
 * InputController (AppInput)
 *
 * Unified Custom Input Controller for the SaaS Education Platform.
 *
 * Responsibilities:
 * - Serves as the single, authoritative input component across the entire dashboard.
 * - Wraps Mantine's input primitives (TextInput, PasswordInput, NumberInput, Textarea) with identical curved aesthetic.
 * - Manages isolated per-instance state (Section 3 of role.md) via createInputStore.
 * - Automatically handles LTR/RTL intelligence for numbers, phones, passwords, emails, and Arabic text.
 * - Provides smart default icons based on the `type` prop.
 */
export function InputController(props: InputControllerProps) {
  const [store] = useState(() => createInputStore(props));

  // Sync external controlled props into the isolated store
  useEffect(() => {
    store.getState().updateProps(props);
  }, [
    props.value,
    props.error,
    props.disabled,
    props.type,
    props.placeholder,
    props.label,
    props.description,
    props.leftSection,
    props.rightSection,
    store,
  ]);

  return (
    <InputContext.Provider value={store}>
      <InputFactory />
    </InputContext.Provider>
  );
}

// Convenient alias for ergonomic import
export const AppInput = InputController;
