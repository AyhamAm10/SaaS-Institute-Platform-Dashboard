'use client';

import {
  ActionIcon,
  ScrollArea,
  Table,
  Text,
  UnstyledButton,
  rem,
} from '@mantine/core';
import {
  IconChevronDown,
  IconChevronUp,
  IconSelector,
} from '@tabler/icons-react';
import { ReactNode } from 'react';
import { DataModuleColumn } from '../init/data-module.init';
import { useDataModuleMirror } from '../store/useDataModuleMirror';
import { DataModuleEmpty } from './DataModuleEmpty';
import { DataModuleLoading } from './DataModuleLoading';

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

  return (
    <ScrollArea type="auto">
      <Table
        verticalSpacing="md"
        horizontalSpacing="lg"
        highlightOnHover
        withTableBorder={false}
        withColumnBorders={false}
        style={{
          minWidth: rem(600),
        }}
      >
        <Table.Thead
          style={{
            backgroundColor: 'var(--mantine-color-gray-0)',
            borderBottom: '1px solid var(--mantine-color-gray-2)',
          }}
        >
          <Table.Tr>
            {columns.map((col) => {
              const isSorted = sort.column === col.key;
              return (
                <Table.Th
                  key={col.key}
                  style={{
                    width: col.width,
                    textAlign: col.align ?? 'right',
                    fontSize: rem(12.5),
                    fontWeight: 700,
                    color: 'var(--mantine-color-gray-6)',
                    letterSpacing: '0.2px',
                    padding: `${rem(14)} ${rem(20)}`,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {col.sortable ? (
                    <UnstyledButton
                      onClick={() => setSort(col.key)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: rem(4),
                        cursor: 'pointer',
                      }}
                    >
                      <Text size="xs" fw={700}>
                        {col.title}
                      </Text>
                      <ActionIcon size="xs" variant="transparent" color="gray">
                        {isSorted ? (
                          sort.direction === 'asc' ? (
                            <IconChevronUp size={14} />
                          ) : (
                            <IconChevronDown size={14} />
                          )
                        ) : (
                          <IconSelector size={14} opacity={0.4} />
                        )}
                      </ActionIcon>
                    </UnstyledButton>
                  ) : (
                    col.title
                  )}
                </Table.Th>
              );
            })}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data.map((row, index) => {
            const rowKey = keyExtractor(row);
            return (
              <Table.Tr
                key={rowKey}
                style={{
                  borderBottom: '1px solid var(--mantine-color-gray-1)',
                  transition: 'background-color 120ms ease',
                }}
              >
                {columns.map((col) => (
                  <Table.Td
                    key={col.key}
                    style={{
                      textAlign: col.align ?? 'right',
                      fontSize: rem(13.5),
                      fontWeight: 500,
                      padding: `${rem(16)} ${rem(20)}`,
                    }}
                  >
                    {col.render ? col.render(row, index) : ((row as Record<string, unknown>)?.[col.key] as ReactNode ?? '—')}
                  </Table.Td>
                ))}
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );
}
