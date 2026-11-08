import {
  DataModuleColumn,
  DataModuleInitialProps,
  SortDirection,
  SortState,
} from '../init/data-module.init';

export interface DataModuleState<T = unknown> {
  // Domain data
  title: string;
  description?: string;
  data: T[];
  columns: DataModuleColumn<T>[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  isLoading: boolean;
  isFetching: boolean;
  search: string;
  /** What is typed in the search box (committed to `search` after the debounce). */
  searchInput: string;
  searchPlaceholder: string;
  sort: SortState;
  selectedIds: (string | number)[];
  selectable: boolean;
  filters: Record<string, unknown>;
  emptyMessage: string;
  emptyDescription?: string;
  keyExtractor: (item: T) => string | number;

  // External callback refs
  onSelect?: (rows: T[]) => void;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  onSearchChange?: (search: string) => void;
  onSortChange?: (column: string, direction: SortDirection) => void;
  onFilterChange?: (filters: Record<string, unknown>) => void;

  // Actions
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSearch: (search: string) => void;
  setSearchInput: (value: string) => void;
  setSort: (column: string) => void;
  setFilter: (key: string, value: unknown) => void;
  resetFilters: () => void;
  toggleRowSelection: (id: string | number) => void;
  selectAllRows: (ids: (string | number)[]) => void;
  clearRowSelection: () => void;
  updateFromProps: (props: DataModuleInitialProps<T>) => void;
}
