'use client';

import { ScrollArea, Table, Text, UnstyledButton, rem } from '@mantine/core';
import { IconChevronDown, IconChevronUp, IconSelector } from '@tabler/icons-react';
import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

const ROW_RADIUS = 'var(--app-radius-md)';
const ROW_BORDER = '1px solid var(--app-table-border)';

/**
 * Rows render as separate frosted strips (border-spacing) inside the glass content card.
 * Header is a quiet caption row; hover lifts a row to solid white (see `.data-module-floating-row`).
 */
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
        <Table.Thead>
          <Table.Tr style={{ backgroundColor: 'transparent' }}>
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
                      onClick={() => setSort(col.key)}
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
        <Table.Tbody>
          <AnimatePresence mode="popLayout">
            {data.map((row, index) => {
              const rowKey = keyExtractor(row);
              return (
                <motion.tr
                  key={rowKey}
                  className="data-module-floating-row"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 0.36,
                    delay: Math.min(index * 0.04, 0.4),
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{ color: 'var(--app-table-text)', borderRadius: ROW_RADIUS }}
                >
                  {columns.map((col, cIdx) => {
                    const isFirst = cIdx === 0;
                    const isLast = cIdx === columns.length - 1;
                    return (
                      <Table.Td
                        key={col.key}
                        style={{
                          textAlign: col.align ?? 'right',
                          fontSize: rem(13.5),
                          fontWeight: 400,
                          padding: `${rem(14)} ${rem(20)}`,
                          color: 'var(--app-table-text)',
                          backgroundColor: 'var(--app-table-bg)',
                          borderTop: ROW_BORDER,
                          borderBottom: ROW_BORDER,
                          borderRight: isFirst ? ROW_BORDER : undefined,
                          borderLeft: isLast ? ROW_BORDER : undefined,
                          borderTopRightRadius: isFirst ? ROW_RADIUS : undefined,
                          borderBottomRightRadius: isFirst ? ROW_RADIUS : undefined,
                          borderTopLeftRadius: isLast ? ROW_RADIUS : undefined,
                          borderBottomLeftRadius: isLast ? ROW_RADIUS : undefined,
                        }}
                      >
                        {col.render ? col.render(row, index) : ((row as Record<string, unknown>)?.[col.key] as ReactNode ?? '—')}
                      </Table.Td>
                    );
                  })}
                </motion.tr>
              );
            })}
          </AnimatePresence>
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );
}
