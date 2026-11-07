import type { Currency, OverdueInstallment } from '@/src/core/api';

/** Overdue installments report: paginated, by currency and student name. */
export interface OverdueState {
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
