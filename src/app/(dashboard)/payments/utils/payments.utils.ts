import type { PaymentsQuery } from '@/src/core/api';
import type { PaymentFilters } from '../state/payments.state';

/** Page state → API query (empty filters are omitted). */
export function toPaymentsQuery(page: number, limit: number, search: string, filters: PaymentFilters): PaymentsQuery {
  const receipt = Number(filters.receiptNumber.trim());
  return {
    page,
    limit,
    search: search.trim() || undefined,
    from: filters.from ?? undefined,
    to: filters.to ?? undefined,
    currency: filters.currency ?? undefined,
    paymentMethod: filters.paymentMethod ?? undefined,
    status: filters.status ?? undefined,
    receiptNumber: Number.isInteger(receipt) && receipt > 0 ? receipt : undefined,
  };
}
