'use client';

import { Checkbox, Table, Text, UnstyledButton, rem } from '@mantine/core';
import { IconChevronDown, IconChevronUp, IconSelector } from '@tabler/icons-react';
import { DataModuleColumn, SortState } from '../init/data-module.init';

export interface DataModuleTableHeaderProps<T = unknown> {
  columns: DataModuleColumn<T>[];
  sort: SortState;
  onSort: (column: string) => void;
  selectable?: boolean;
  allSelected?: boolean;
  someSelected?: boolean;
  onToggleAll?: () => void;
}

export function DataModuleTableHeader<T = unknown>({
  columns,
  sort,
  onSort,
  selectable,
  allSelected,
  someSelected,
  onToggleAll,
}: DataModuleTableHeaderProps<T>) {
  return (
    <Table.Thead>
      <Table.Tr style={{ backgroundColor: 'transparent' }}>
        {selectable && (
          <Table.Th
            style={{
              width: rem(48),
              textAlign: 'center',
              padding: `${rem(2)} ${rem(12)}`,
              border: 0,
            }}
          >
            <Checkbox
              checked={allSelected}
              indeterminate={someSelected}
              onChange={onToggleAll}
              aria-label="تحديد جميع السجلات"
            />
          </Table.Th>
        )}
        {columns.map((col) => {
          const isSorted = sort.column === col.key;
          return (
            <Table.Th
              key={col.key}
              style={{
                width: col.width,
                textAlign: col.align ?? 'right',
                fontSize: rem(12),
                fontWeight: 400,
                color: 'var(--app-text-muted)',
                padding: `${rem(2)} ${rem(20)}`,
                whiteSpace: 'nowrap',
                border: 0,
              }}
            >
              {col.sortable ? (
                <UnstyledButton
                  onClick={() => onSort(col.key)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: rem(4),
                    color: isSorted ? 'var(--app-text-primary)' : 'inherit',
                  }}
                >
                  <Text span inherit style={{ fontSize: rem(12) }}>
                    {col.title}
                  </Text>
                  {isSorted ? (
                    sort.direction === 'asc' ? (
                      <IconChevronUp size={13} color="var(--app-brand-accent)" />
                    ) : (
                      <IconChevronDown size={13} color="var(--app-brand-accent)" />
                    )
                  ) : (
                    <IconSelector size={13} opacity={0.45} />
                  )}
                </UnstyledButton>
              ) : (
                col.title
              )}
            </Table.Th>
          );
        })}
      </Table.Tr>
    </Table.Thead>
  );
}
