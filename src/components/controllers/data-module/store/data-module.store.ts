'use client';

import { createContext, useContext } from 'react';
import { createControllerStore } from '@/src/core/mirror';
import { ControllerStoreApi } from '@/src/core/mirror/types';
import { DataModuleInitialProps, SortDirection } from '../init/data-module.init';
import { DataModuleState } from '../state/data-module.state';

export type DataModuleStore<T = unknown> = ControllerStoreApi<DataModuleState<T>>;

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
    filters: {},
    emptyMessage: props?.emptyMessage ?? 'لا توجد بيانات متاحة حالياً',
    emptyDescription: props?.emptyDescription,
    keyExtractor:
      props?.keyExtractor ??
      ((item: T) =>
        ((item as Record<string, unknown>)?.['id'] as string | number) ?? Math.random()),

    onPageChange: props?.onPageChange,
    onLimitChange: props?.onLimitChange,
    onSearchChange: props?.onSearchChange,
    onSortChange: props?.onSortChange,
    onFilterChange: props?.onFilterChange,

    setPage: (page: number) => {
      set({ page });
      get().onPageChange?.(page);
    },

    setLimit: (limit: number) => {
      set({ limit, page: 1 });
      get().onLimitChange?.(limit);
    },

    setSearch: (search: string) => {
      set({ search, page: 1 });
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
      set({ filters: nextFilters, page: 1 });
      get().onFilterChange?.(nextFilters);
    },

    resetFilters: () => {
      set({ filters: {}, search: '', page: 1 });
      get().onFilterChange?.({});
      get().onSearchChange?.('');
    },

    toggleRowSelection: (id: string | number) => {
      const current = get().selectedIds;
      const exists = current.includes(id);
      set({
        selectedIds: exists ? current.filter((item) => item !== id) : [...current, id],
      });
    },

    selectAllRows: (ids: (string | number)[]) => {
      set({ selectedIds: ids });
    },

    clearRowSelection: () => {
      set({ selectedIds: [] });
    },

    updateFromProps: (nextProps: DataModuleInitialProps<T>) => {
      set((state) => ({
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
        onPageChange: nextProps.onPageChange ?? state.onPageChange,
        onLimitChange: nextProps.onLimitChange ?? state.onLimitChange,
        onSearchChange: nextProps.onSearchChange ?? state.onSearchChange,
        onSortChange: nextProps.onSortChange ?? state.onSortChange,
        onFilterChange: nextProps.onFilterChange ?? state.onFilterChange,
      }));
    },
  }));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const DataModuleContext = createContext<DataModuleStore<any> | null>(null);

export function useDataModuleStore<T = unknown>(): DataModuleStore<T> {
  const context = useContext(DataModuleContext);
  if (!context) {
    throw new Error('useDataModuleStore must be used within a DataModuleController provider');
  }
  return context as unknown as DataModuleStore<T>;
}
