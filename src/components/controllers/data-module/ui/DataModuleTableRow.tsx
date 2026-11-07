'use client';

import { Checkbox, Table, rem } from '@mantine/core';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { DataModuleColumn } from '../init/data-module.init';

const ROW_RADIUS = 'var(--app-radius-md)';
const ROW_BORDER = '1px solid var(--app-table-border)';

export interface DataModuleTableRowProps<T = unknown> {
  row: T;
  index: number;
  rowKey: string | number;
  columns: DataModuleColumn<T>[];
  selectable?: boolean;
  isSelected?: boolean;
  onToggleSelect?: () => void;
}

export function DataModuleTableRow<T = unknown>({
  row,
  index,
  rowKey,
  columns,
  selectable,
  isSelected,
  onToggleSelect,
}: DataModuleTableRowProps<T>) {
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
      {selectable && (
        <Table.Td
          style={{
            width: rem(48),
            textAlign: 'center',
            padding: `${rem(14)} ${rem(12)}`,
            backgroundColor: 'var(--app-table-bg)',
            borderTop: ROW_BORDER,
            borderBottom: ROW_BORDER,
            borderRight: ROW_BORDER,
            borderTopRightRadius: ROW_RADIUS,
            borderBottomRightRadius: ROW_RADIUS,
          }}
        >
          <Checkbox
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              onToggleSelect?.();
            }}
            onClick={(e) => e.stopPropagation()}
            aria-label="تحديد السجل"
          />
        </Table.Td>
      )}
      {columns.map((col, cIdx) => {
        const isFirst = !selectable && cIdx === 0;
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
            {col.render
              ? col.render(row, index)
              : ((row as Record<string, unknown>)?.[col.key] as ReactNode ?? '—')}
          </Table.Td>
        );
      })}
    </motion.tr>
  );
}
