'use client';

import { useCallback, useEffect, useState } from 'react';
import { useStore } from 'zustand';
import {
  useStudentFieldsQuery,
  useCreateStudentFieldMutation,
  useUpdateStudentFieldMutation,
} from '@/src/core/api';
import { createStudentFieldsStore, StudentFieldsContext } from './store/student-fields.store';
import { StudentFieldsView } from './ui/StudentFieldsView';

/**
 * QuerySync
 *
 * Bridges React Query data for custom student fields into the isolated Zustand store.
 * Strictly adheres to QuerySync pattern from Section 9 & 12 of role.md.
 */
function QuerySync({ store }: { store: ReturnType<typeof createStudentFieldsStore> }) {
  const syncFields = useStore(store, (s) => s.syncFields);
  const { data = [], isLoading } = useStudentFieldsQuery(true);

  useEffect(() => {
    syncFields(data, isLoading);
  }, [data, isLoading, syncFields]);

  return null;
}

/**
 * StudentFieldsController
 *
 * Root Controller Component for Custom Student Fields configuration.
 * Owns the isolated Zustand store lifecycle and coordinates state transitions.
 */
export function StudentFieldsController() {
  const [store] = useState(() => createStudentFieldsStore());
  const createMutation = useCreateStudentFieldMutation();
  const updateMutation = useUpdateStudentFieldMutation();

  const handleSubmit = useCallback(async () => {
    const {
      selectedField,
      formName,
      formLabel,
      formType,
      formOptions,
      formOptionsText,
      formIsRequired,
      formDisplayInReport,
      formSortOrder,
    } = store.getState();

    if (!formLabel.trim()) {
      return;
    }

    const options =
      formType === 'SELECT'
        ? formOptions && formOptions.length > 0
          ? formOptions
          : formOptionsText
              .split('\n')
              .map((s) => s.trim())
              .filter(Boolean)
        : undefined;

    // Auto-generate a clean, slugified key from label or fallback to unique timestamp id
    const slugifiedLabel = formLabel
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '');
    const generatedName = selectedField
      ? selectedField.name
      : formName.trim() || slugifiedLabel || `field_${Date.now()}`;

    store.getState().setSubmitting(true);
    try {
      if (selectedField) {
        await updateMutation.mutateAsync({
          id: selectedField.id,
          payload: {
            name: selectedField.name,
            label: formLabel.trim(),
            type: formType,
            options,
            isRequired: formIsRequired,
            displayInReport: formDisplayInReport,
            sortOrder: Number(formSortOrder) || 0,
          },
        });
      } else {
        await createMutation.mutateAsync({
          name: generatedName,
          label: formLabel.trim(),
          type: formType,
          options,
          isRequired: formIsRequired,
          displayInReport: formDisplayInReport,
          sortOrder: Number(formSortOrder) || 0,
        });
      }

      store.getState().closeDrawer();
    } catch (error) {
      console.error('Failed to save student field:', error);
    } finally {
      store.getState().setSubmitting(false);
    }
  }, [store, createMutation, updateMutation]);

  return (
    <StudentFieldsContext.Provider value={store}>
      <QuerySync store={store} />
      <StudentFieldsView onSubmit={handleSubmit} />
    </StudentFieldsContext.Provider>
  );
}
