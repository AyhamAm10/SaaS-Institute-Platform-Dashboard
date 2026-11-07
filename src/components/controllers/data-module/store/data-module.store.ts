'use client';

import { createContext, useContext } from 'react';
import { createControllerStore } from '@/src/core/mirror';
import { ControllerStoreApi } from '@/src/core/mirror/types';
import { DataModuleInitialProps, SortDirection } from '../init/data-module.init';
import { DataModuleState } from '../state/data-module.state';

export type DataModuleStore<T = unknown> = ControllerStoreApi<DataModuleState<T>>;

function getSelectedRows<T>(state: {
  data: T[];
  selectedIds: (string | number)[];
  keyExtractor: (item: T) => string | number;
}): T[] {
  const idSet = new Set(state.selectedIds);
  return state.data.filter((item) => idSet.has(state.keyExtractor(item)));
}

export function selectSelectedRows<T>(state: DataModuleState<T>): T[] {
  return getSelectedRows(state);
}

export function createDataModuleStore<T = unknown>(
  props?: DataModuleInitialProps<T>,
): DataModuleStore<T> {
  return createControllerStore<DataModuleState<T>>((set, get) => ({
    title: props?.title ?? '',
    description: props?.description,
    data: props?.data ?? [],
    columns: props?.columns ?? [],
    total: props?.total ?? 0,
    page: props?.page ?? 1,
    limit: props?.limit ?? 10,
    totalPages: props?.totalPages ?? 1,
    isLoading: props?.isLoading ?? false,
    isFetching: props?.isFetching ?? false,
    search: props?.initialSearch ?? '',
    searchPlaceholder: props?.searchPlaceholder ?? 'بحث في السجلات...',
    sort: { column: null, direction: null },
    selectedIds: [],
    selectable: props?.selectable ?? false,
    filters: {},
    emptyMessage: props?.emptyMessage ?? 'لا توجد بيانات متاحة حاليا',
    emptyDescription: props?.emptyDescription,
    keyExtractor:
      props?.keyExtractor ??
      ((item: T) =>
        ((item as Record<string, unknown>)?.['id'] as string | number) ?? Math.random()),

    onSelect: props?.onSelect,
    onPageChange: props?.onPageChange,
    onLimitChange: props?.onLimitChange,
    onSearchChange: props?.onSearchChange,
    onSortChange: props?.onSortChange,
    onFilterChange: props?.onFilterChange,

    setPage: (page: number) => {
      set({ page, selectedIds: [] });
      get().onSelect?.([]);
      get().onPageChange?.(page);
    },

    setLimit: (limit: number) => {
      set({ limit, page: 1, selectedIds: [] });
      get().onSelect?.([]);
      get().onLimitChange?.(limit);
    },

    setSearch: (search: string) => {
      set({ search, page: 1, selectedIds: [] });
      get().onSelect?.([]);
      get().onSearchChange?.(search);
    },

    setSort: (column: string) => {
      const currentSort = get().sort;
      let nextDirection: SortDirection = 'asc';
      if (currentSort.column === column) {
        if (currentSort.direction === 'asc') nextDirection = 'desc';
        else if (currentSort.direction === 'desc') nextDirection = null;
        else nextDirection = 'asc';
      }

      set({ sort: { column: nextDirection ? column : null, direction: nextDirection } });
      get().onSortChange?.(column, nextDirection);
    },

    setFilter: (key: string, value: unknown) => {
      const nextFilters = { ...get().filters, [key]: value };
      set({ filters: nextFilters, page: 1, selectedIds: [] });
      get().onSelect?.([]);
      get().onFilterChange?.(nextFilters);
    },

    resetFilters: () => {
      set({ filters: {}, search: '', page: 1, selectedIds: [] });
      get().onSelect?.([]);
      get().onFilterChange?.({});
      get().onSearchChange?.('');
    },

    toggleRowSelection: (id: string | number) => {
      const current = get().selectedIds;
      const exists = current.includes(id);
      const nextIds = exists ? current.filter((item) => item !== id) : [...current, id];
      set({ selectedIds: nextIds });
      const selected = getSelectedRows({ ...get(), selectedIds: nextIds });
      get().onSelect?.(selected);
    },

    selectAllRows: (ids: (string | number)[]) => {
      set({ selectedIds: ids });
      const selected = getSelectedRows({ ...get(), selectedIds: ids });
      get().onSelect?.(selected);
    },

    clearRowSelection: () => {
      set({ selectedIds: [] });
      get().onSelect?.([]);
    },

    updateFromProps: (nextProps: DataModuleInitialProps<T>) => {
      let notifySelectionClear = false;
      set((state) => {
        const oldKeyExtractor = state.keyExtractor;
        const newKeyExtractor = nextProps.keyExtractor ?? oldKeyExtractor;
        const oldKeys = state.data.map(oldKeyExtractor);
        const newData = nextProps.data ?? state.data;
        const newKeys = newData.map(newKeyExtractor);
        const keysChanged =
          oldKeys.length !== newKeys.length ||
          oldKeys.some((k, i) => k !== newKeys[i]);

        if (keysChanged && state.selectedIds.length > 0) {
          notifySelectionClear = true;
        }

        return {
          title: nextProps.title ?? state.title,
          description: nextProps.description ?? state.description,
          data: nextProps.data ?? state.data,
          columns: nextProps.columns ?? state.columns,
          total: nextProps.total !== undefined ? nextProps.total : state.total,
          page: nextProps.page !== undefined ? nextProps.page : state.page,
          limit: nextProps.limit !== undefined ? nextProps.limit : state.limit,
          totalPages: nextProps.totalPages !== undefined ? nextProps.totalPages : state.totalPages,
          isLoading: nextProps.isLoading !== undefined ? nextProps.isLoading : state.isLoading,
          isFetching: nextProps.isFetching !== undefined ? nextProps.isFetching : state.isFetching,
          searchPlaceholder: nextProps.searchPlaceholder ?? state.searchPlaceholder,
          emptyMessage: nextProps.emptyMessage ?? state.emptyMessage,
          emptyDescription: nextProps.emptyDescription ?? state.emptyDescription,
          keyExtractor: nextProps.keyExtractor ?? state.keyExtractor,
          selectable: nextProps.selectable ?? state.selectable,
          onSelect: nextProps.onSelect ?? state.onSelect,
          selectedIds: keysChanged ? [] : state.selectedIds,
          onPageChange: nextProps.onPageChange ?? state.onPageChange,
          onLimitChange: nextProps.onLimitChange ?? state.onLimitChange,
          onSearchChange: nextProps.onSearchChange ?? state.onSearchChange,
          onSortChange: nextProps.onSortChange ?? state.onSortChange,
          onFilterChange: nextProps.onFilterChange ?? state.onFilterChange,
        };
      });

      if (notifySelectionClear) {
        get().onSelect?.([]);
      }
    },
  }));
}

export const DataModuleContext = createContext<DataModuleStore<unknown> | null>(null);

export function useDataModuleStore<T = unknown>(): DataModuleStore<T> {
  const context = useContext(DataModuleContext);
  if (!context) {
    throw new Error('useDataModuleStore must be used within a DataModuleController provider');
  }
  return context as unknown as DataModuleStore<T>;
}
