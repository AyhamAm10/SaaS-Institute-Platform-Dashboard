'use client';

import { useCallback, useEffect, useState } from 'react';
import { useStore } from 'zustand';
import { citiesResource, getApiErrorMessage, LookupItem } from '@/src/core/api';
import { LookupConfig } from './lookup.config';
import { createLookupStore, LookupContext, LookupStore } from './store/lookup.store';
import { toLookupPayload, validateLookupForm } from './utils/lookup-form.utils';
import { LookupView } from './ui/LookupView';

export interface LookupControllerProps {
  config: LookupConfig;
  canManage?: boolean;
}

/** Bridges the paginated list query of the table into the store. */
function QuerySync({ store }: { store: LookupStore }) {
  const config = useStore(store, (s) => s.config);
  const page = useStore(store, (s) => s.page);
  const limit = useStore(store, (s) => s.limit);
  const search = useStore(store, (s) => s.search);
  const syncQueryData = useStore(store, (s) => s.syncQueryData);

  const { data, isLoading, isFetching } = config.resource.useList({
    page,
    limit,
    search: search.trim() || undefined,
  });

  useEffect(() => {
    syncQueryData({
      data: data?.data ?? [],
      total: data?.total ?? 0,
      totalPages: data?.totalPages ?? 1,
      isLoading,
      isFetching,
    });
  }, [data, isLoading, isFetching, syncQueryData]);

  return null;
}

/** Loads city options for tables whose fields/columns reference a city. */
function CityOptionsSync({ store }: { store: LookupStore }) {
  const syncOptions = useStore(store, (s) => s.syncOptions);
  const { data } = citiesResource.useList({ limit: 100 });

  useEffect(() => {
    syncOptions(
      'cities',
      (data?.data ?? []).map((city) => ({ value: String(city.id), label: city.name })),
    );
  }, [data, syncOptions]);

  return null;
}

/**
 * LookupController
 *
 * Generic controller of one reference table (cities, schools, buses...).
 * Behaviour comes entirely from its LookupConfig; owns its isolated store,
 * query sync and mutation orchestration (role.md §3).
 */
export function LookupController({ config, canManage = true }: LookupControllerProps) {
  const [store] = useState(() => createLookupStore(config));
  const createMutation = config.resource.useCreate();
  const updateMutation = config.resource.useUpdate();
  const deleteMutation = config.resource.useDelete();

  const needsCities =
    config.fields.some((f) => f.options === 'cities') ||
    config.columns.some((c) => c.options === 'cities');

  const handleSubmit = useCallback(async () => {
    const { form, editing, setFormErrors, setGeneralError, setIsSubmitting, closeDrawer } =
      store.getState();
    setGeneralError(null);

    const errors = validateLookupForm(config.fields, form);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const payload = toLookupPayload(config.fields, form, !editing);
    setIsSubmitting(true);
    try {
      if (editing) await updateMutation.mutateAsync({ id: editing.id, payload });
      else await createMutation.mutateAsync(payload);
      closeDrawer();
    } catch (err: unknown) {
      setGeneralError(getApiErrorMessage(err, `تعذّر حفظ ${config.singular}`));
    } finally {
      setIsSubmitting(false);
    }
  }, [store, config, createMutation, updateMutation]);

  const handleConfirmDelete = useCallback(
    async (item: LookupItem) => {
      const { setDeleteError, setIsDeleting, closeDelete } = store.getState();
      setDeleteError(null);
      setIsDeleting(true);
      try {
        await deleteMutation.mutateAsync(item.id);
        closeDelete();
      } catch (err: unknown) {
        setDeleteError(getApiErrorMessage(err, `تعذّر حذف ${config.singular}`));
      } finally {
        setIsDeleting(false);
      }
    },
    [store, config, deleteMutation],
  );

  return (
    <LookupContext.Provider value={store}>
      <QuerySync store={store} />
      {needsCities && <CityOptionsSync store={store} />}
      <LookupView onSubmit={handleSubmit} onConfirmDelete={handleConfirmDelete} canManage={canManage} />
    </LookupContext.Provider>
  );
}
