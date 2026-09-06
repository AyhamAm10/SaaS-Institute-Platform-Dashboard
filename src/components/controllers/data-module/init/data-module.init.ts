import { ReactNode } from 'react';

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
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  onSearchChange?: (search: string) => void;
  onSortChange?: (column: string, direction: SortDirection) => void;
  onFilterChange?: (filters: Record<string, unknown>) => void;
}
