import { ReactNode } from 'react';
import type { ReportCell, ReportColumnKind } from '@/src/core/api';

export type SortDirection = 'asc' | 'desc' | null;

export interface SortState {
  column: string | null;
  direction: SortDirection;
}

export interface DataModuleColumn<T = unknown> {
  key: string;
  title: string;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  render?: (row: T, index: number) => ReactNode;
  /** Value of this column in print / Excel (selection export). Omit to leave the column out (e.g. actions). */
  exportValue?: (row: T) => ReportCell;
  /** How the exported value is formatted (default: 'text'). */
  exportKind?: ReportColumnKind;
}

export interface DataModuleInitialProps<T = unknown> {
  title?: string;
  description?: string;
  data?: T[];
  columns?: DataModuleColumn<T>[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  isLoading?: boolean;
  isFetching?: boolean;
  searchPlaceholder?: string;
  initialSearch?: string;
  keyExtractor?: (item: T) => string | number;
  emptyMessage?: string;
  emptyDescription?: string;
  /** Shows the selection column and "select all"; required for print / Excel. */
  selectable?: boolean;
  /** Selected rows (full objects, current page) whenever the selection changes. */
  onSelect?: (rows: T[]) => void;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  onSearchChange?: (search: string) => void;
  onSortChange?: (column: string, direction: SortDirection) => void;
  onFilterChange?: (filters: Record<string, unknown>) => void;
}
