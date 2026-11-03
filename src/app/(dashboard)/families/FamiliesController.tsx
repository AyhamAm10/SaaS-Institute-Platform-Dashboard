'use client';

import { useCallback, useEffect, useState } from 'react';
import { useStore } from 'zustand';
import { useQueryClient } from '@tanstack/react-query';
import {
  Family,
  useCreateFamilyMutation,
  useDeleteFamilyMutation,
  useFamiliesSearchQuery,
  useUpdateFamilyMutation,
} from '@/src/core/api';
import { createFamiliesStore, FamiliesContext } from './store/families.store';
import { FamiliesView } from './ui/FamiliesView';

function extractErrorMessage(err: unknown, fallback: string): string {
  const e = err as { response?: { data?: { message?: string | string[] } }; message?: string };
  const msg = e?.response?.data?.message || e?.message || fallback;
  return Array.isArray(msg) ? msg.join('، ') : msg;
}

/**
 * QuerySync
 *
 * Bridges React Query data into the Zustand store.
 * Synchronizes server data into the isolated store without UI layer knowing about React Query.
 */
function QuerySync({ store }: { store: ReturnType<typeof createFamiliesStore> }) {
  const search = useStore(store, (s) => s.search);
  const syncQueryData = useStore(store, (s) => s.syncQueryData);

  const { data, isLoading, isFetching } = useFamiliesSearchQuery(
    search.trim() ? search.trim() : undefined,
  );

  useEffect(() => {
    syncQueryData({ data: data ?? [], isLoading, isFetching });
  }, [data, isLoading, isFetching, syncQueryData]);

  return null;
}

/**
 * FamiliesController
 *
 * Controller orchestrator for the Families module.
 * Owns the Zustand store instance, query synchronization, and mutation orchestration.
 * Strictly adheres to role.md.
 */
export function FamiliesController() {
  const [store] = useState(() => createFamiliesStore());
  const queryClient = useQueryClient();
  const createMutation = useCreateFamilyMutation();
  const updateMutation = useUpdateFamilyMutation();
  const deleteMutation = useDeleteFamilyMutation();

  const handleRefetch = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['families'] });
  }, [queryClient]);

  const handleSubmit = useCallback(async () => {
    const { form, drawerMode, selectedFamily } = store.getState();
    store.getState().setGeneralError(null);

    // ── Client-side validation ──
    if (!form.familyName.trim()) {
      store.getState().setFieldError('familyName', 'يرجى إدخال كنية العائلة');
      return;
    }

    const payload = {
      familyName: form.familyName.trim(),
      fatherName: form.fatherName.trim(),
      motherName: form.motherName.trim(),
      phone: form.phone.trim(),
    };

    store.getState().setIsSubmitting(true);
    try {
      if (drawerMode === 'edit' && selectedFamily) {
        await updateMutation.mutateAsync({ id: selectedFamily.id, payload });
      } else {
        await createMutation.mutateAsync({
          familyName: payload.familyName,
          fatherName: payload.fatherName || undefined,
          motherName: payload.motherName || undefined,
          phone: payload.phone || undefined,
        });
      }
      store.getState().closeDrawer();
    } catch (err: unknown) {
      store
        .getState()
        .setGeneralError(extractErrorMessage(err, 'حدث خطأ أثناء حفظ بيانات العائلة'));
    } finally {
      store.getState().setIsSubmitting(false);
    }
  }, [store, createMutation, updateMutation]);

  const handleConfirmDelete = useCallback(
    async (family: Family) => {
      store.getState().setDeleteError(null);
      store.getState().setIsDeleting(true);
      try {
        await deleteMutation.mutateAsync(family.id);
        store.getState().closeDeleteModal();
      } catch (err: unknown) {
        store
          .getState()
          .setDeleteError(extractErrorMessage(err, 'حدث خطأ أثناء حذف العائلة'));
      } finally {
        store.getState().setIsDeleting(false);
      }
    },
    [store, deleteMutation],
  );

  return (
    <FamiliesContext.Provider value={store}>
      <QuerySync store={store} />
      <FamiliesView
        onRefresh={handleRefetch}
        onSubmit={handleSubmit}
        onConfirmDelete={handleConfirmDelete}
      />
    </FamiliesContext.Provider>
  );
}
