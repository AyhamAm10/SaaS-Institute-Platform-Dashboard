'use client';

import { Box } from '@mantine/core';
import { ReactNode, useEffect, useState } from 'react';
import { DataModuleInitialProps } from './init/data-module.init';
import { DataModuleContext, createDataModuleStore } from './store/data-module.store';
import {
  DataModuleActions,
  DataModuleContent,
  DataModuleEmpty,
  DataModuleFilterBar,
  DataModuleFilterSlot,
  DataModuleFooter,
  DataModuleHeader,
  DataModuleLoading,
  DataModulePagination,
  DataModuleResetButton,
  DataModuleSearchInput,
  DataModuleTable,
  DataModuleTitle,
} from './ui';

export interface DataModuleControllerProps<T = unknown> extends DataModuleInitialProps<T> {
  children?: ReactNode;
}

/**
 * DataModuleController
 *
 * Root Controller Component orchestrating domain data views (tables, filters, pagination, actions).
 * Adheres strictly to:
 * - Compound Component Pattern for flexible visual authoring
 * - Layer Pattern (init, state, store, ui)
 * - Isolated per-instance Zustand Store (role.md Section 3)
 * - Mantine-Only primitives & Modern Curved Organic UI
 */
export function DataModuleController<T = unknown>({
  children,
  ...props
}: DataModuleControllerProps<T>) {
  const [store] = useState(() => createDataModuleStore<T>(props));

  // Sync external reactive updates into the isolated store
  useEffect(() => {
    store.getState().updateFromProps(props);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    props.title,
    props.description,
    props.data,
    props.columns,
    props.total,
    props.page,
    props.limit,
    props.totalPages,
    props.isLoading,
    props.isFetching,
    props.searchPlaceholder,
    props.emptyMessage,
    props.emptyDescription,
    props.keyExtractor,
    props.onPageChange,
    props.onLimitChange,
    props.onSearchChange,
    props.onSortChange,
    props.onFilterChange,
    store,
  ]);

  const defaultContent = (
    <Box>
      <DataModuleHeader>
        <DataModuleTitle />
      </DataModuleHeader>
      <DataModuleFilterBar>
        <DataModuleSearchInput />
        <DataModuleResetButton />
      </DataModuleFilterBar>
      <DataModuleContent>
        <DataModuleTable />
      </DataModuleContent>
      <DataModuleFooter />
    </Box>
  );

  return (
    <DataModuleContext.Provider value={store}>
      <Box p={{ base: 'xs', sm: 'md' }}>
        {children ?? defaultContent}
      </Box>
    </DataModuleContext.Provider>
  );
}

// Compound component attachments
DataModuleController.Header = DataModuleHeader;
DataModuleController.Title = DataModuleTitle;
DataModuleController.Actions = DataModuleActions;
DataModuleController.FilterBar = DataModuleFilterBar;
DataModuleController.SearchInput = DataModuleSearchInput;
DataModuleController.FilterSlot = DataModuleFilterSlot;
DataModuleController.ResetButton = DataModuleResetButton;
DataModuleController.Content = DataModuleContent;
DataModuleController.Table = DataModuleTable;
DataModuleController.Footer = DataModuleFooter;
DataModuleController.Pagination = DataModulePagination;
DataModuleController.Empty = DataModuleEmpty;
DataModuleController.Loading = DataModuleLoading;
