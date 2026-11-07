import type { ReportCategory, ReportDefinition } from '@/src/core/api';

/**
 * ReportsCenterState
 *
 * The reports center (D3): the catalog the server allows this user, a free
 * search and a category filter.
 */
export interface ReportsCenterState {
  catalog: ReportDefinition[];
  isLoading: boolean;
  search: string;
  category: ReportCategory | 'all';

  setSearch: (search: string) => void;
  setCategory: (category: ReportCategory | 'all') => void;
  syncCatalog: (catalog: ReportDefinition[], isLoading: boolean) => void;
}
