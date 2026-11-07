import type { Currency, PaymentMethod, PaymentRecord, PaymentStatus } from '@/src/core/api';

export interface PaymentFilters {
  from: string | null;
  to: string | null;
  currency: Currency | null;
  paymentMethod: PaymentMethod | null;
  status: PaymentStatus | null;
  receiptNumber: string;
}

/**
 * PaymentsState
 *
 * Payments page: filtered list (date range, currency, method, status,
 * receipt number, student search) and the cancel modal.
 */
export interface PaymentsState {
  page: number;
  limit: number;
  search: string;
  filters: PaymentFilters;
  data: PaymentRecord[];
  total: number;
  totalPages: number;
  isLoading: boolean;

  cancelTarget: PaymentRecord | null;
  cancelReason: string;
  cancelError: string | null;
  isCancelling: boolean;

  setPage: (page: number) => void;
  setSearch: (search: string) => void;
  setFilter: <K extends keyof PaymentFilters>(key: K, value: PaymentFilters[K]) => void;
  openCancel: (payment: PaymentRecord) => void;
  closeCancel: () => void;
  setCancelReason: (reason: string) => void;
  setCancelError: (error: string | null) => void;
  setIsCancelling: (value: boolean) => void;
  syncQueryData: (payload: { data: PaymentRecord[]; total: number; totalPages: number; isLoading: boolean }) => void;
}
