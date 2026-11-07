'use client';

import { ScrollArea, Table, rem } from '@mantine/core';
import { ReactNode } from 'react';
import { AnimatePresence } from 'framer-motion';
import { DataModuleColumn } from '../init/data-module.init';
import { useDataModuleMirror } from '../store/useDataModuleMirror';
import { DataModuleEmpty } from './DataModuleEmpty';
import { DataModuleLoading } from './DataModuleLoading';
import { DataModuleTableHeader } from './DataModuleTableHeader';
import { DataModuleTableRow } from './DataModuleTableRow';

export interface DataModuleTableProps<T = Record<string, unknown>> {
  data?: T[];
  columns?: DataModuleColumn<T>[];
  keyExtractor?: (item: T) => string | number;
  emptyMessage?: string;
  emptyDescription?: string;
  emptyIcon?: ReactNode;
  isLoading?: boolean;
}

export function DataModuleTable<T = Record<string, unknown>>(props: DataModuleTableProps<T>) {
  const storeData = useDataModuleMirror('data') as T[];
  const storeColumns = useDataModuleMirror('columns') as DataModuleColumn<T>[];
  const storeIsLoading = useDataModuleMirror('isLoading');
  const storeKeyExtractor = useDataModuleMirror('keyExtractor');
  const sort = useDataModuleMirror('sort');
  const setSort = useDataModuleMirror('setSort');
  const selectable = useDataModuleMirror('selectable');
  const selectedIds = (useDataModuleMirror('selectedIds') ?? []) as (string | number)[];
  const toggleRowSelection = useDataModuleMirror('toggleRowSelection');
  const selectAllRows = useDataModuleMirror('selectAllRows');
  const clearRowSelection = useDataModuleMirror('clearRowSelection');

  const data = props.data ?? storeData;
  const columns = props.columns ?? storeColumns;
  const isLoading = props.isLoading ?? storeIsLoading;
  const keyExtractor = props.keyExtractor ?? storeKeyExtractor;

  if (isLoading) {
    return <DataModuleLoading />;
  }

  if (!data || data.length === 0) {
    return (
      <DataModuleEmpty
        message={props.emptyMessage}
        description={props.emptyDescription}
        icon={props.emptyIcon}
      />
    );
  }

  const pageRowKeys = data.map(keyExtractor);
  const selectedCount = pageRowKeys.filter((k) => selectedIds.includes(k)).length;
  const allSelected = pageRowKeys.length > 0 && selectedCount === pageRowKeys.length;
  const someSelected = selectedCount > 0 && !allSelected;

  const handleToggleAll = () => {
    if (allSelected) {
      clearRowSelection();
    } else {
      selectAllRows(pageRowKeys);
    }
  };

  return (
    <ScrollArea type="auto">
      <Table
        withTableBorder={false}
        withColumnBorders={false}
        highlightOnHover={false}
        style={{
          minWidth: rem(640),
          backgroundColor: 'transparent',
          borderCollapse: 'separate',
          borderSpacing: `0 ${rem(8)}`,
        }}
      >
        <DataModuleTableHeader
          columns={columns}
          sort={sort}
          onSort={setSort}
          selectable={selectable}
          allSelected={allSelected}
          someSelected={someSelected}
          onToggleAll={handleToggleAll}
        />
        <Table.Tbody>
          <AnimatePresence mode="popLayout">
            {data.map((row, index) => {
              const rowKey = keyExtractor(row);
              return (
                <DataModuleTableRow
                  key={rowKey}
                  row={row}
                  index={index}
                  rowKey={rowKey}
                  columns={columns}
                  selectable={selectable}
                  isSelected={selectedIds.includes(rowKey)}
                  onToggleSelect={() => toggleRowSelection(rowKey)}
                />
              );
            })}
          </AnimatePresence>
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );
}
