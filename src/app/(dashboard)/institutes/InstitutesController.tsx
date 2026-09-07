'use client';

import { useCallback, useEffect, useState } from 'react';
import { useStore } from 'zustand';
import { useQueryClient } from '@tanstack/react-query';
import {
  INSTITUTES_QUERY_KEYS,
  useCreateInstituteMutation,
  useInstitutesQuery,
} from '@/src/core/api';
import {
  createInstitutesStore,
  InstitutesContext,
} from './store/institutes.store';
import { InstitutesView } from './ui/InstitutesView';

/**
 * QuerySync
 *
 * Internal component bridging React Query data into the Zustand store.
 * Keeps the store synchronized with server data without the UI layer needing
 * to know about React Query.
 */
function QuerySync({
  store,
}: {
  store: ReturnType<typeof createInstitutesStore>;
}) {
  const page = useStore(store, (s) => s.page);
  const limit = useStore(store, (s) => s.limit);
  const search = useStore(store, (s) => s.search);
  const syncQueryData = useStore(store, (s) => s.syncQueryData);

  const { data: paginatedData, isLoading, isFetching } = useInstitutesQuery({
    page,
    limit,
    search: search.trim() ? search.trim() : undefined,
  });

  useEffect(() => {
    syncQueryData({
      data: paginatedData?.data ?? [],
      total: paginatedData?.total ?? 0,
      totalPages: paginatedData?.totalPages ?? 1,
      isLoading,
      isFetching,
    });
  }, [paginatedData, isLoading, isFetching, syncQueryData]);

  return null;
}

/**
 * InstitutesController
 *
 * Root entry point for the Institutes management module.
 * Owns the Zustand store instance, query synchronization, and creation mutation orchestration.
 * Strictly adheres to the Controller Component Pattern (role.md).
 */
export function InstitutesController() {
  const [store] = useState(() => createInstitutesStore());
  const queryClient = useQueryClient();
  const createMutation = useCreateInstituteMutation();

  const handleRefetch = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: INSTITUTES_QUERY_KEYS.all });
  }, [queryClient]);

  const handleCreateSubmit = useCallback(async () => {
    const { form } = store.getState();
    store.getState().setGeneralError(null);
    store.getState().setGeneralSuccess(null);

    // ── Client-side validation ──
    let hasError = false;

    if (!form.name.trim()) {
      store.getState().setFieldError('name', 'يرجى إدخال اسم المعهد التعليمي');
      hasError = true;
    }
    if (!form.phone.trim()) {
      store.getState().setFieldError('phone', 'يرجى إدخال هاتف المعهد');
      hasError = true;
    }
    if (!form.address.trim()) {
      store.getState().setFieldError('address', 'يرجى إدخال عنوان المعهد');
      hasError = true;
    }
    if (!form.adminFullName.trim()) {
      store.getState().setFieldError('adminFullName', 'يرجى إدخال اسم مدير المعهد');
      hasError = true;
    }
    if (!form.adminPhone.trim()) {
      store.getState().setFieldError('adminPhone', 'يرجى إدخال رقم هاتف المدير');
      hasError = true;
    }
    if (!form.adminPassword.trim() || form.adminPassword.length < 6) {
      store
        .getState()
        .setFieldError('adminPassword', 'كلمة المرور يجب أن لا تقل عن 6 خانات');
      hasError = true;
    }

    if (hasError) return;

    store.getState().setIsSubmitting(true);
    try {
      await createMutation.mutateAsync({
        name: form.name.trim(),
        logoUrl: form.logoUrl.trim() || undefined,
        primaryColor: form.primaryColor || '#1a73e8',
        secondaryColor: form.secondaryColor || '#34a853',
        phone: form.phone.trim(),
        address: form.address.trim(),
        adminFullName: form.adminFullName.trim(),
        adminPhone: form.adminPhone.trim(),
        adminPassword: form.adminPassword.trim(),
      });

      store.getState().closeCreateDrawer();
      store.getState().resetForm();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'حدث خطأ أثناء إنشاء المعهد التعليمي وتعيين المدير';
      store.getState().setGeneralError(Array.isArray(msg) ? msg.join(', ') : msg);
    } finally {
      store.getState().setIsSubmitting(false);
    }
  }, [store, createMutation]);

  return (
    <InstitutesContext.Provider value={store}>
      <QuerySync store={store} />
      <InstitutesView
        onRefresh={handleRefetch}
        onCreateSubmit={handleCreateSubmit}
      />
    </InstitutesContext.Provider>
  );
}
