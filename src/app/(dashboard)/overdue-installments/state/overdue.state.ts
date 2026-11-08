import type { DashboardOverview, OverdueAgingItem } from '@/src/core/api';
import type { Currency, OverdueInstallment } from '@/src/core/api';

/** Overdue installments report: paginated, by currency and student name. */
export interface OverdueState {
  /** Home numbers (GET /dashboard/overview) for the KPI cards and charts. */
  overview: DashboardOverview | null;
  /** Overdue amounts per age bucket (GET /fees/overdue/summary). */
  aging: OverdueAgingItem[];
  syncOverview: (overview: DashboardOverview | null, aging?: OverdueAgingItem[]) => void;
  page: number;
  limit: number;
  search: string;
  currency: Currency | null;
  data: OverdueInstallment[];
  total: number;
  totalPages: number;
  isLoading: boolean;

  setPage: (page: number) => void;
  setSearch: (search: string) => void;
  setCurrency: (currency: Currency | null) => void;
  syncQueryData: (payload: {
    data: OverdueInstallment[];
    total: number;
    totalPages: number;
    isLoading: boolean;
  }) => void;
}
