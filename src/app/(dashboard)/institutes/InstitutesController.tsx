'use client';

import { useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  FeatureKey,
  INSTITUTES_QUERY_KEYS,
  useCreateInstituteMutation,
  useUpdateInstituteFeaturesMutation,
  useUpdateInstituteMutation,
} from '@/src/core/api';
import { createInstitutesStore, InstitutesContext } from './store/institutes.store';
import { InstitutesView } from './ui/InstitutesView';
import { extractApiError, toInstituteDetailsPayload, validateInstituteForm } from './utils/institute-form.utils';
import { FeaturesSync, QuerySync } from './InstitutesQuerySync';

/**
 * InstitutesController
 *
 * Root entry point for the Institutes management module.
 * Owns the Zustand store instance, query synchronization, and the create / edit /
 * feature-flag mutation orchestration.
 * Strictly adheres to the Controller Component Pattern (role.md).
 */
export function InstitutesController() {
  const [store] = useState(() => createInstitutesStore());
  const queryClient = useQueryClient();
  const createMutation = useCreateInstituteMutation();
  const updateMutation = useUpdateInstituteMutation();
  const featuresMutation = useUpdateInstituteFeaturesMutation();

  const handleRefetch = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: INSTITUTES_QUERY_KEYS.all });
  }, [queryClient]);

  const handleFormSubmit = useCallback(async () => {
    const { form, drawerMode, editingInstitute } = store.getState();
    store.getState().setGeneralError(null);
    store.getState().setGeneralSuccess(null);

    // ── Client-side validation ──
    const errors = validateInstituteForm(form, drawerMode);
    Object.entries(errors).forEach(([field, msg]) => store.getState().setFieldError(field, msg));
    if (Object.keys(errors).length > 0) return;

    store.getState().setIsSubmitting(true);
    try {
      const details = toInstituteDetailsPayload(form);
      if (drawerMode === 'edit' && editingInstitute) {
        await updateMutation.mutateAsync({ id: editingInstitute.id, payload: details });
      } else {
        await createMutation.mutateAsync({
          ...details,
          adminFullName: form.adminFullName.trim(),
          adminPhone: form.adminPhone.trim(),
          adminPassword: form.adminPassword.trim(),
        });
      }

      store.getState().closeFormDrawer();
      store.getState().resetForm();
    } catch (err: unknown) {
      store.getState().setGeneralError(extractApiError(err, 'حدث خطأ أثناء حفظ بيانات المعهد التعليمي'));
    } finally {
      store.getState().setIsSubmitting(false);
    }
  }, [store, createMutation, updateMutation]);

  const handleToggleFeature = useCallback(
    async (key: FeatureKey, enabled: boolean) => {
      const { selectedInstitute } = store.getState();
      if (!selectedInstitute) return;

      store.getState().setFeaturesError(null);
      store.getState().setFeatureSavingKey(key);
      try {
        await featuresMutation.mutateAsync({
          id: selectedInstitute.id,
          features: [{ key, enabled }],
        });
      } catch (err: unknown) {
        store.getState().setFeaturesError(extractApiError(err, 'تعذر تحديث حالة الميزة'));
      } finally {
        store.getState().setFeatureSavingKey(null);
      }
    },
    [store, featuresMutation],
  );

  return (
    <InstitutesContext.Provider value={store}>
      <QuerySync store={store} />
      <FeaturesSync store={store} />
      <InstitutesView onRefresh={handleRefetch} onFormSubmit={handleFormSubmit} onToggleFeature={handleToggleFeature} />
    </InstitutesContext.Provider>
  );
}
