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
        verticalSpacing="xs"
        horizontalSpacing="md"
        withTableBorder={false}
        withColumnBorders={false}
        style={{
          minWidth: rem(600),
          backgroundColor: 'transparent',
          borderCollapse: 'separate',
          borderSpacing: '0 8px',
          padding: `0 ${rem(14)}`,
        }}
      >
        <Table.Thead
          style={{
            backgroundColor: 'var(--app-table-header-bg)',
            transition: 'background-color 200ms ease',
          }}
        >
          <Table.Tr
            style={{
              backgroundColor: 'transparent',
            }}
          >
            {columns.map((col, cIdx) => {
              const isSorted = sort.column === col.key;
              const isFirst = cIdx === 0;
              const isLast = cIdx === columns.length - 1;
              return (
                <Table.Th
                  key={col.key}
                  style={{
                    width: col.width,
                    textAlign: col.align ?? 'right',
                    fontSize: rem(12.5),
                    fontWeight: 600,
                    color: 'var(--app-text-secondary)',
                    letterSpacing: '0.1px',
                    padding: `${rem(12)} ${rem(18)}`,
                    whiteSpace: 'nowrap',
                    borderTopRightRadius: isFirst ? rem(10) : undefined,
                    borderBottomRightRadius: isFirst ? rem(10) : undefined,
                    borderTopLeftRadius: isLast ? rem(10) : undefined,
                    borderBottomLeftRadius: isLast ? rem(10) : undefined,
                    borderTop: '1px solid var(--app-border)',
                    borderBottom: '1px solid var(--app-border)',
                    borderRight: isFirst ? '1px solid var(--app-border)' : undefined,
                    borderLeft: isLast ? '1px solid var(--app-border)' : undefined,
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
                        color: 'inherit',
                      }}
                    >
                      <Text size="xs" fw={600} style={{ fontSize: rem(12.5), color: 'inherit' }}>
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
          <AnimatePresence mode="popLayout">
            {data.map((row, index) => {
              const rowKey = keyExtractor(row);
              return (
                <motion.tr
                  key={rowKey}
                  className="data-module-floating-row"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{
                    duration: 0.38,
                    delay: Math.min(index * 0.05, 0.45),
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileHover={{
                    scale: 1.008,
                    x: -8,
                    y: -1,
                    transition: { duration: 0.2, ease: 'easeOut' },
                  }}
                  style={{
                    backgroundColor: 'var(--app-surface)',
                    color: 'var(--app-table-text)',
                    position: 'relative',
                  }}
                >
                  {columns.map((col, cIdx) => {
                    const isFirst = cIdx === 0;
                    const isLast = cIdx === columns.length - 1;
                    return (
                      <Table.Td
                        key={col.key}
                        style={{
                          textAlign: col.align ?? 'right',
                          fontSize: rem(13),
                          fontWeight: 400,
                          padding: `${rem(13)} ${rem(18)}`,
                          color: 'var(--app-table-text)',
                          borderTop: '1px solid var(--app-border)',
                          borderBottom: '1px solid var(--app-border)',
                          borderRight: isFirst ? '1px solid var(--app-border)' : undefined,
                          borderLeft: isLast ? '1px solid var(--app-border)' : undefined,
                          borderTopRightRadius: isFirst ? rem(12) : undefined,
                          borderBottomRightRadius: isFirst ? rem(12) : undefined,
                          borderTopLeftRadius: isLast ? rem(12) : undefined,
                          borderBottomLeftRadius: isLast ? rem(12) : undefined,
                          backgroundColor: 'inherit',
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
